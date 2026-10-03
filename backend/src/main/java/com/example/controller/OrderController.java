package com.example.controller;

import com.example.entity.Cart;
import com.example.entity.CartItem;
import com.example.entity.Inventory;
import com.example.entity.Order;
import com.example.entity.OrderItem;
import com.example.entity.Payment;
import com.example.entity.Product;
import com.example.entity.User;
import com.example.repository.CartItemRepository;
import com.example.repository.CartRepository;
import com.example.repository.InventoryRepository;
import com.example.repository.OrderItemRepository;
import com.example.repository.OrderRepository;
import com.example.repository.PaymentRepository;
import com.example.repository.UserRepository;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(
        origins = "http://localhost:5175",
        allowCredentials = "true"
)
public class OrderController {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final InventoryRepository inventoryRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentRepository paymentRepository;

    public OrderController(
            UserRepository userRepository,
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            InventoryRepository inventoryRepository,
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            PaymentRepository paymentRepository) {

        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.inventoryRepository = inventoryRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.paymentRepository = paymentRepository;
    }

    @PostMapping
    @Transactional
    public Map<String, Object> createOrder(
            @AuthenticationPrincipal OAuth2User oauthUser) {

        User user = getUser(oauthUser);

        Cart cart = cartRepository
                .findByUserId(user.getId())
                .orElseThrow(() ->
                        new RuntimeException("Cart is empty"));

        List<CartItem> cartItems =
                cartItemRepository.findByCartId(cart.getId());

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        /*
         * Validate inventory before creating anything.
         */
        for (CartItem cartItem : cartItems) {

            Product product = cartItem.getProduct();

            Inventory inventory = inventoryRepository
                    .findByProductId(product.getId())
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Inventory not found for product: "
                                            + product.getName()
                            ));

            int available =
                    inventory.getQuantity()
                            - inventory.getReserved();

            if (available < cartItem.getQuantity()) {
                throw new RuntimeException(
                        "Insufficient stock for: "
                                + product.getName()
                );
            }
        }

        /*
         * Calculate total from backend prices.
         * Never trust totals sent by the frontend.
         */
        BigDecimal total = BigDecimal.ZERO;

        for (CartItem cartItem : cartItems) {

            BigDecimal lineTotal =
                    cartItem.getProduct()
                            .getPrice()
                            .multiply(
                                    BigDecimal.valueOf(
                                            cartItem.getQuantity()
                                    )
                            );

            total = total.add(lineTotal);
        }

        /*
         * Create the order.
         */
        Order order = new Order();

        order.setUser(user);
        order.setTotalAmount(total);
        order.setStatus(Order.Status.PENDING);

        order = orderRepository.save(order);

        /*
         * Create order items using price snapshots.
         */
        List<Map<String, Object>> responseItems =
                new ArrayList<>();

        for (CartItem cartItem : cartItems) {

            Product product = cartItem.getProduct();

            OrderItem orderItem = new OrderItem();

            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(product.getPrice());

            orderItemRepository.save(orderItem);

            /*
             * Reserve inventory.
             *
             * quantity = physical stock
             * reserved = stock already reserved by pending orders
             */
            Inventory inventory = inventoryRepository
                    .findByProductId(product.getId())
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Inventory not found"
                            ));

            inventory.setReserved(
                    inventory.getReserved()
                            + cartItem.getQuantity()
            );

            inventoryRepository.save(inventory);

            responseItems.add(
                    Map.of(
                            "productId", product.getId(),
                            "name", product.getName(),
                            "quantity", cartItem.getQuantity(),
                            "price", product.getPrice()
                    )
            );
        }

        /*
         * Create pending payment.
         */
        Payment payment = new Payment();

        payment.setOrder(order);
        payment.setAmount(total);
        payment.setStatus(Payment.Status.PENDING);

        paymentRepository.save(payment);

        return Map.of(
                "success", true,
                "orderId", order.getId(),
                "paymentId", payment.getId(),
                "status", order.getStatus().name(),
                "paymentStatus", payment.getStatus().name(),
                "total", total,
                "network", payment.getNetwork(),
                "items", responseItems
        );
    }

    @GetMapping
    public List<Map<String, Object>> getOrders(
            @AuthenticationPrincipal OAuth2User oauthUser) {

        User user = getUser(oauthUser);

        List<Order> orders =
                orderRepository.findByUserId(user.getId());

        List<Map<String, Object>> response =
                new ArrayList<>();

        for (Order order : orders) {

            Payment payment =
                    paymentRepository
                            .findByOrderId(order.getId())
                            .orElse(null);

            List<OrderItem> items =
                    orderItemRepository
                            .findByOrderId(order.getId());

            List<Map<String, Object>> orderItems =
                    new ArrayList<>();

            for (OrderItem item : items) {

                Product product = item.getProduct();

                orderItems.add(
                        Map.of(
                                "id", item.getId(),
                                "productId", product.getId(),
                                "name", product.getName(),
                                "imageUrl",
                                product.getImageUrl(),
                                "quantity",
                                item.getQuantity(),
                                "price",
                                item.getPrice()
                        )
                );
            }

            response.add(
                    Map.of(
                            "id", order.getId(),
                            "totalAmount",
                            order.getTotalAmount(),
                            "status",
                            order.getStatus().name(),
                            "createdAt",
                            order.getCreatedAt(),
                            "payment",
                            payment == null
                                    ? Map.of()
                                    : Map.of(
                                            "id", payment.getId(),
                                            "amount",
                                            payment.getAmount(),
                                            "status",
                                            payment.getStatus().name(),
                                            "transactionId",
                                            payment.getTransactionId() == null
                                                    ? ""
                                                    : payment.getTransactionId(),
                                            "network",
                                            payment.getNetwork()
                                    ),
                            "items", orderItems
                    )
            );
        }

        return response;
    }

    @GetMapping("/{id}")
    public Map<String, Object> getOrder(
            @PathVariable Long id,
            @AuthenticationPrincipal OAuth2User oauthUser) {

        User user = getUser(oauthUser);

        Order order = orderRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));

        if (!order.getUser()
                .getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "Unauthorized order"
            );
        }

        Payment payment =
                paymentRepository
                        .findByOrderId(order.getId())
                        .orElse(null);

        List<OrderItem> items =
                orderItemRepository
                        .findByOrderId(order.getId());

        List<Map<String, Object>> orderItems =
                new ArrayList<>();

        for (OrderItem item : items) {

            Product product = item.getProduct();

            orderItems.add(
                    Map.of(
                            "id", item.getId(),
                            "productId", product.getId(),
                            "name", product.getName(),
                            "imageUrl",
                            product.getImageUrl(),
                            "quantity",
                            item.getQuantity(),
                            "price", item.getPrice()
                    )
            );
        }

        return Map.of(
                "id", order.getId(),
                "totalAmount", order.getTotalAmount(),
                "status", order.getStatus().name(),
                "createdAt", order.getCreatedAt(),
                "payment",
                payment == null
                        ? Map.of()
                        : Map.of(
                                "id", payment.getId(),
                                "amount", payment.getAmount(),
                                "status",
                                payment.getStatus().name(),
                                "transactionId",
                                payment.getTransactionId() == null
                                        ? ""
                                        : payment.getTransactionId(),
                                "network",
                                payment.getNetwork()
                        ),
                "items", orderItems
        );
    }

    private User getUser(OAuth2User oauthUser) {

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
}