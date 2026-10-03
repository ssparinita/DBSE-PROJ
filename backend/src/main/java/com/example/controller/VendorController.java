package com.example.controller;

import com.example.entity.*;
import com.example.repository.*;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/vendor")
@CrossOrigin(
        origins = "http://localhost:5175",
        allowCredentials = "true"
)
public class VendorController {

    private final UserRepository userRepository;
    private final VendorRepository vendorRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentRepository paymentRepository;

    public VendorController(
            UserRepository userRepository,
            VendorRepository vendorRepository,
            ProductRepository productRepository,
            InventoryRepository inventoryRepository,
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            PaymentRepository paymentRepository) {

        this.userRepository = userRepository;
        this.vendorRepository = vendorRepository;
        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.paymentRepository = paymentRepository;
    }

    // =========================================================
    // PRODUCTS
    // =========================================================

    @GetMapping("/products")
    public List<Map<String, Object>> products(
            @AuthenticationPrincipal OAuth2User oauthUser) {

        Vendor vendor = getVendor(oauthUser);

        return productRepository.findAll()
                .stream()
                .filter(p ->
                        p.getVendor() != null &&
                        p.getVendor().getId() != null &&
                        p.getVendor().getId().equals(vendor.getId()))
                .map(this::productResponse)
                .toList();
    }

    // =========================================================
    // INVENTORY
    // =========================================================

    @GetMapping("/inventory")
    public List<Map<String, Object>> inventory() {

        org.springframework.security.core.Authentication authentication =
                org.springframework.security.core.context.SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !(authentication.getPrincipal()
                        instanceof OAuth2User oauthUser)) {

            throw new RuntimeException(
                    "No logged-in Google user"
            );
        }

        Vendor vendor = getVendor(oauthUser);

        return inventoryRepository.findAll()
                .stream()
                .filter(i ->
                        i.getProduct() != null &&
                        i.getProduct().getVendor() != null &&
                        i.getProduct().getVendor().getId() != null &&
                        i.getProduct().getVendor().getId()
                                .equals(vendor.getId()))
                .map(this::inventoryResponse)
                .toList();
    }

    // =========================================================
    // ORDERS
    // =========================================================

    @GetMapping("/orders")
    public List<Map<String, Object>> orders(
            @AuthenticationPrincipal OAuth2User oauthUser) {

        Vendor vendor = getVendor(oauthUser);

        List<Map<String, Object>> result =
                new ArrayList<>();

        for (Order order : orderRepository.findAll()) {

            List<OrderItem> vendorItems =
                    orderItemRepository
                            .findByOrderId(order.getId())
                            .stream()
                            .filter(item ->
                                    item.getProduct() != null &&
                                    item.getProduct().getVendor() != null &&
                                    item.getProduct().getVendor().getId() != null &&
                                    item.getProduct().getVendor().getId()
                                            .equals(vendor.getId()))
                            .toList();

            if (vendorItems.isEmpty()) {
                continue;
            }

            List<Map<String, Object>> items =
                    vendorItems.stream()
                            .map(this::orderItemResponse)
                            .toList();

            Map<String, Object> response =
                    new LinkedHashMap<>();

            response.put(
                    "id",
                    order.getId()
            );

            response.put(
                    "status",
                    order.getStatus() == null
                            ? "UNKNOWN"
                            : order.getStatus().name()
            );

            response.put(
                    "createdAt",
                    order.getCreatedAt()
            );

            response.put(
                    "customerName",
                    order.getUser() != null
                            ? order.getUser().getName()
                            : "Customer"
            );

            response.put(
                    "items",
                    items
            );

            BigDecimal total =
                    vendorItems.stream()
                            .map(item ->
                                    item.getPrice()
                                            .multiply(
                                                    BigDecimal.valueOf(
                                                            item.getQuantity()
                                                    )
                                            ))
                            .reduce(
                                    BigDecimal.ZERO,
                                    BigDecimal::add
                            );

            response.put(
                    "total",
                    total
            );

            Payment payment =
                    paymentRepository
                            .findByOrderId(order.getId())
                            .orElse(null);

            response.put(
                    "paymentStatus",
                    payment == null ||
                            payment.getStatus() == null
                            ? "PENDING"
                            : payment.getStatus().name()
            );

            result.add(response);
        }

        return result;
    }

    // =========================================================
    // REVENUE
    // =========================================================

    @GetMapping("/revenue")
    public Map<String, Object> revenue(
            @AuthenticationPrincipal OAuth2User oauthUser) {

        Vendor vendor = getVendor(oauthUser);

        List<OrderItem> items =
                orderItemRepository.findAll()
                        .stream()
                        .filter(item ->
                                item.getProduct() != null &&
                                item.getProduct().getVendor() != null &&
                                item.getProduct().getVendor().getId() != null &&
                                item.getProduct().getVendor().getId()
                                        .equals(vendor.getId()))
                        .toList();

        BigDecimal total =
                BigDecimal.ZERO;

        BigDecimal last30 =
                BigDecimal.ZERO;

        BigDecimal commission =
                BigDecimal.ZERO;

        LocalDateTime thirtyDaysAgo =
                LocalDateTime.now()
                        .minus(30, ChronoUnit.DAYS);

        Map<Long, ProductRevenue> productMap =
                new LinkedHashMap<>();

        for (OrderItem item : items) {

            if (item.getPrice() == null ||
                    item.getProduct() == null) {
                continue;
            }

            BigDecimal gross =
                    item.getPrice()
                            .multiply(
                                    BigDecimal.valueOf(
                                            item.getQuantity()
                                    ));

            total =
                    total.add(gross);

            if (item.getOrder() != null &&
                    item.getOrder().getCreatedAt() != null &&
                    item.getOrder()
                            .getCreatedAt()
                            .isAfter(thirtyDaysAgo)) {

                last30 =
                        last30.add(gross);
            }

            BigDecimal itemCommission =
                    gross.multiply(
                            new BigDecimal("0.085"));

            commission =
                    commission.add(itemCommission);

            Long productId =
                    item.getProduct().getId();

            ProductRevenue current =
                    productMap.computeIfAbsent(
                            productId,
                            id -> new ProductRevenue(
                                    item.getProduct().getName()
                            )
                    );

            current.units +=
                    item.getQuantity();

            current.revenue =
                    current.revenue.add(gross);

            current.commission =
                    current.commission.add(
                            itemCommission
                    );
        }

        BigDecimal net =
                total.subtract(commission);

        List<Map<String, Object>> byProduct =
                productMap.values()
                        .stream()
                        .map(ProductRevenue::toMap)
                        .toList();

        return Map.of(
                "total",
                total,

                "last30",
                last30,

                "commission",
                commission,

                "net",
                net,

                "trend",
                buildTrend(items),

                "byProduct",
                byProduct
        );
    }

    // =========================================================
    // DASHBOARD
    // =========================================================

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard(
            @AuthenticationPrincipal OAuth2User oauthUser) {

        Vendor vendor =
                getVendor(oauthUser);

        long products =
                productRepository.findAll()
                        .stream()
                        .filter(p ->
                                p.getVendor() != null &&
                                p.getVendor().getId() != null &&
                                p.getVendor().getId()
                                        .equals(vendor.getId()))
                        .count();

        long lowStock =
                inventoryRepository.findAll()
                        .stream()
                        .filter(i ->
                                i.getProduct() != null &&
                                i.getProduct().getVendor() != null &&
                                i.getProduct()
                                        .getVendor()
                                        .getId() != null &&
                                i.getProduct()
                                        .getVendor()
                                        .getId()
                                        .equals(vendor.getId()) &&
                                i.getQuantity()
                                        - i.getReserved()
                                        <= 9)
                        .count();

        List<Order> orders =
                orderRepository.findAll()
                        .stream()
                        .filter(order ->
                                orderItemRepository
                                        .findByOrderId(
                                                order.getId()
                                        )
                                        .stream()
                                        .anyMatch(item ->
                                                item.getProduct() != null &&
                                                item.getProduct()
                                                        .getVendor() != null &&
                                                item.getProduct()
                                                        .getVendor()
                                                        .getId() != null &&
                                                item.getProduct()
                                                        .getVendor()
                                                        .getId()
                                                        .equals(
                                                                vendor.getId()
                                                        )))
                        .toList();

        return Map.of(
                "vendorId",
                vendor.getId(),

                "storeName",
                vendor.getStoreName() == null
                        ? "Galerie Marketplace"
                        : vendor.getStoreName(),

                "products",
                products,

                "orders",
                orders.size(),

                "lowStock",
                lowStock
        );
    }

    // =========================================================
    // VENDOR RESOLUTION
    // =========================================================

    private Vendor getVendor(
            OAuth2User oauthUser) {

        if (oauthUser == null) {
            throw new RuntimeException(
                    "Not authenticated"
            );
        }

        String email =
                oauthUser.getAttribute("email");

        if (email == null ||
                email.isBlank()) {

            throw new RuntimeException(
                    "Google account email not available"
            );
        }

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found for Google email: "
                                                + email
                                ));

        /*
         * ADMIN ACCESS
         *
         * The current logged-in account is:
         * parinitatumu@gmail.com
         *
         * It is ADMIN and should be able to use
         * the Studio for the expo.
         *
         * Therefore ADMIN uses the existing
         * Galerie Marketplace vendor.
         */
        if (user.getRole() == User.Role.ADMIN) {

            return vendorRepository
                    .findAll()
                    .stream()
                    .findFirst()
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "No vendor profile exists"
                            ));
        }

        /*
         * NORMAL VENDOR ACCESS
         */
        if (user.getRole() != User.Role.VENDOR) {

            throw new RuntimeException(
                    "Vendor access required. Current role: "
                            + user.getRole()
            );
        }

        return vendorRepository
                .findAll()
                .stream()
                .filter(v ->
                        v.getUser() != null &&
                        v.getUser().getId() != null &&
                        v.getUser()
                                .getId()
                                .equals(user.getId()))
                .findFirst()
                .orElseThrow(() ->
                        new RuntimeException(
                                "Vendor profile not found for user ID: "
                                        + user.getId()
                                        + ", email: "
                                        + email
                        ));
    }

    // =========================================================
    // PRODUCT RESPONSE
    // =========================================================

    private Map<String, Object> productResponse(
            Product product) {

        Map<String, Object> response =
                new LinkedHashMap<>();

        response.put(
                "id",
                product.getId()
        );

        response.put(
                "name",
                product.getName()
        );

        response.put(
                "description",
                product.getDescription()
        );

        response.put(
                "price",
                product.getPrice()
        );

        response.put(
                "imageUrl",
                product.getImageUrl()
        );

        response.put(
                "rating",
                product.getRating()
        );

        response.put(
                "reviewCount",
                product.getReviewCount()
        );

        response.put(
                "active",
                product.isActive()
        );

        if (product.getCategory() != null) {

            response.put(
                    "category",
                    Map.of(
                            "id",
                            product.getCategory().getId(),

                            "name",
                            product.getCategory().getName()
                    )
            );
        }

        Inventory inventory =
                inventoryRepository
                        .findByProductId(
                                product.getId()
                        )
                        .orElse(null);

        if (inventory != null) {

            response.put(
                    "stock",
                    inventory.getQuantity()
            );

            response.put(
                    "reserved",
                    inventory.getReserved()
            );

        } else {

            response.put(
                    "stock",
                    0
            );

            response.put(
                    "reserved",
                    0
            );
        }

        return response;
    }

    // =========================================================
    // INVENTORY RESPONSE
    // =========================================================

    private Map<String, Object> inventoryResponse(
            Inventory inventory) {

        Product product =
                inventory.getProduct();

        Map<String, Object> response =
                new LinkedHashMap<>();

        response.put(
                "id",
                inventory.getId()
        );

        response.put(
                "quantity",
                inventory.getQuantity()
        );

        response.put(
                "reserved",
                inventory.getReserved()
        );

        response.put(
                "available",
                Math.max(
                        0,
                        inventory.getQuantity()
                                - inventory.getReserved()
                )
        );

        Map<String, Object> productData =
                new LinkedHashMap<>();

        productData.put(
                "id",
                product.getId()
        );

        productData.put(
                "name",
                product.getName()
        );

        productData.put(
                "imageUrl",
                product.getImageUrl() == null
                        ? ""
                        : product.getImageUrl()
        );

        productData.put(
                "category",
                product.getCategory() == null
                        ? ""
                        : product.getCategory().getName()
        );

        response.put(
                "product",
                productData
        );

        return response;
    }

    // =========================================================
    // ORDER ITEM RESPONSE
    // =========================================================

    private Map<String, Object> orderItemResponse(
            OrderItem item) {

        Product product =
                item.getProduct();

        Map<String, Object> response =
                new LinkedHashMap<>();

        response.put(
                "id",
                item.getId()
        );

        response.put(
                "quantity",
                item.getQuantity()
        );

        response.put(
                "price",
                item.getPrice()
        );

        Map<String, Object> productData =
                new LinkedHashMap<>();

        productData.put(
                "id",
                product.getId()
        );

        productData.put(
                "name",
                product.getName()
        );

        productData.put(
                "price",
                product.getPrice()
        );

        productData.put(
                "imageUrl",
                product.getImageUrl() == null
                        ? ""
                        : product.getImageUrl()
        );

        response.put(
                "product",
                productData
        );

        return response;
    }

    // =========================================================
    // REVENUE TREND
    // =========================================================

    private List<Map<String, Object>> buildTrend(
            List<OrderItem> items) {

        Map<String, BigDecimal> grouped =
                new LinkedHashMap<>();

        LocalDateTime now =
                LocalDateTime.now();

        for (int i = 11; i >= 0; i--) {

            LocalDateTime start =
                    now.minusWeeks(i + 1);

            LocalDateTime end =
                    now.minusWeeks(i);

            BigDecimal value =
                    items.stream()
                            .filter(item ->
                                    item.getOrder() != null &&
                                    item.getOrder()
                                            .getCreatedAt() != null &&
                                    !item.getOrder()
                                            .getCreatedAt()
                                            .isBefore(start) &&
                                    item.getOrder()
                                            .getCreatedAt()
                                            .isBefore(end))
                            .map(item ->
                                    item.getPrice()
                                            .multiply(
                                                    BigDecimal.valueOf(
                                                            item.getQuantity()
                                                    )))
                            .reduce(
                                    BigDecimal.ZERO,
                                    BigDecimal::add
                            );

            grouped.put(
                    "W" + (12 - i),
                    value
            );
        }

        return grouped.entrySet()
                .stream()
                .map(entry ->
                        Map.<String, Object>of(
                                "label",
                                entry.getKey(),

                                "value",
                                entry.getValue(),

                                "revenue",
                                entry.getValue()
                        ))
                .collect(
                        Collectors.toList()
                );
    }

    // =========================================================
    // PRODUCT REVENUE
    // =========================================================

    private static class ProductRevenue {

        String productName;

        int units = 0;

        BigDecimal revenue =
                BigDecimal.ZERO;

        BigDecimal commission =
                BigDecimal.ZERO;

        ProductRevenue(
                String productName) {

            this.productName =
                    productName;
        }

        Map<String, Object> toMap() {

            return Map.of(
                    "productName",
                    productName,

                    "units",
                    units,

                    "revenue",
                    revenue,

                    "commission",
                    commission,

                    "net",
                    revenue.subtract(
                            commission
                    )
            );
        }
    }
}