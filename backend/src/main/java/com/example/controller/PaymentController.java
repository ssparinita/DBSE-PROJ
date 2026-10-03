package com.example.controller;

import com.example.entity.Cart;
import com.example.entity.CartItem;
import com.example.entity.Inventory;
import com.example.entity.Order;
import com.example.entity.OrderItem;
import com.example.entity.Payment;
import com.example.entity.User;
import com.example.repository.CartItemRepository;
import com.example.repository.CartRepository;
import com.example.repository.InventoryRepository;
import com.example.repository.OrderItemRepository;
import com.example.repository.OrderRepository;
import com.example.repository.PaymentRepository;
import com.example.repository.UserRepository;
import com.example.service.AlgorandService;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(
        origins = "http://localhost:5175",
        allowCredentials = "true"
)
public class PaymentController {

    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final InventoryRepository inventoryRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final AlgorandService algorandService;

    public PaymentController(
            UserRepository userRepository,
            PaymentRepository paymentRepository,
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            InventoryRepository inventoryRepository,
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            AlgorandService algorandService) {

        this.userRepository = userRepository;
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.inventoryRepository = inventoryRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.algorandService = algorandService;
    }

    @GetMapping("/{id}")
    public Map<String, Object> getPayment(
            @PathVariable Long id,
            @AuthenticationPrincipal OAuth2User oauthUser) {

        User user = getUser(oauthUser);

        Payment payment = paymentRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Payment not found"));

        if (!payment.getOrder()
                .getUser()
                .getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "Unauthorized payment"
            );
        }

        BigDecimal amount = payment.getAmount();

        long microAlgo =
                algorandService.inrToMicroAlgo(amount);

        BigDecimal algo =
                algorandService.inrToAlgo(amount);

        String paymentUri =
                "algorand:"
                        + algorandService.getMerchantAddress()
                        + "?amount="
                        + microAlgo
                        + "&note=GALERIE-ORDER-"
                        + payment.getOrder().getId();

        return Map.of(
                "id", payment.getId(),
                "orderId", payment.getOrder().getId(),
                "amountInr", amount,
                "amountAlgo", algo,
                "microAlgo", microAlgo,
                "merchantAddress",
                algorandService.getMerchantAddress(),
                "paymentUri", paymentUri,
                "network", payment.getNetwork(),
                "status", payment.getStatus().name()
        );
    }

    @PostMapping("/{id}/verify")
    @Transactional
    public Map<String, Object> verifyPayment(
            @PathVariable Long id,
            @RequestBody VerifyRequest request,
            @AuthenticationPrincipal OAuth2User oauthUser)
            throws Exception {

        User user = getUser(oauthUser);

        Payment payment = paymentRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Payment not found"
                        ));

        Order order = payment.getOrder();

        if (!order.getUser()
                .getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "Unauthorized payment"
            );
        }

        if (payment.getStatus()
                == Payment.Status.CONFIRMED) {

            return Map.of(
                    "success", true,
                    "confirmed", true,
                    "orderId", order.getId(),
                    "paymentId", payment.getId(),
                    "status", "CONFIRMED",
                    "message",
                    "Payment was already confirmed"
            );
        }

        if (request.transactionId() == null
                || request.transactionId().isBlank()) {

            throw new RuntimeException(
                    "Transaction ID is required"
            );
        }

        AlgorandService.PaymentVerification verification =
                algorandService.verifyPayment(
                        request.transactionId().trim(),
                        payment.getAmount()
                );

        if (!verification.confirmed()) {

            return Map.of(
                    "success", false,
                    "confirmed", false,
                    "status", "PENDING",
                    "message",
                    "Transaction has not been confirmed yet"
            );
        }

        /*
         * Store transaction ID.
         */
        payment.setTransactionId(
                request.transactionId().trim()
        );

        payment.setStatus(
                Payment.Status.CONFIRMED
        );

        paymentRepository.save(payment);

        /*
         * Finalize inventory.
         */
        for (OrderItem orderItem :
                orderItemRepository.findByOrderId(
                        order.getId()
                )) {

            Inventory inventory =
                    inventoryRepository
                            .findByProductId(
                                    orderItem
                                            .getProduct()
                                            .getId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Inventory not found"
                                    ));

            int quantity =
                    orderItem.getQuantity();

            if (inventory.getReserved()
                    < quantity) {

                throw new RuntimeException(
                        "Inventory reservation mismatch"
                );
            }

            if (inventory.getQuantity()
                    < quantity) {

                throw new RuntimeException(
                        "Insufficient inventory"
                );
            }

            inventory.setQuantity(
                    inventory.getQuantity()
                            - quantity
            );

            inventory.setReserved(
                    inventory.getReserved()
                            - quantity
            );

            inventoryRepository.save(inventory);
        }

        /*
         * Confirm order.
         */
        order.setStatus(
                Order.Status.CONFIRMED
        );

        orderRepository.save(order);

        /*
         * Clear user's cart.
         */
        Cart cart = cartRepository
                .findByUserId(user.getId())
                .orElse(null);

        if (cart != null) {

            for (CartItem item :
                    cartItemRepository.findByCartId(
                            cart.getId()
                    )) {

                cartItemRepository.delete(item);
            }
        }

        return Map.of(
                "success", true,
                "confirmed", true,
                "orderId", order.getId(),
                "paymentId", payment.getId(),
                "status", "CONFIRMED",
                "transactionId",
                payment.getTransactionId(),
                "confirmedRound",
                verification.confirmedRound(),
                "amountMicroAlgo",
                verification.amountMicroAlgo(),
                "message",
                "Algorand Testnet payment confirmed"
        );
    }

    private User getUser(
            OAuth2User oauthUser) {

        if (oauthUser == null) {

            throw new RuntimeException(
                    "Not authenticated"
            );
        }

        String email =
                oauthUser.getAttribute("email");

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        ));
    }

    public record VerifyRequest(
            String transactionId
    ) {
    }
}