package com.example.controller;

import com.example.entity.Cart;
import com.example.entity.CartItem;
import com.example.entity.Product;
import com.example.entity.User;
import com.example.repository.CartItemRepository;
import com.example.repository.CartRepository;
import com.example.repository.ProductRepository;
import com.example.repository.UserRepository;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(
        origins = "http://localhost:5175",
        allowCredentials = "true"
)
public class CartController {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public CartController(
            UserRepository userRepository,
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            ProductRepository productRepository) {

        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
    }

    @GetMapping
    public Map<String, Object> getCart(
            @AuthenticationPrincipal OAuth2User oauthUser) {

        User user = getUser(oauthUser);

        Cart cart = cartRepository
                .findByUserId(user.getId())
                .orElse(null);

        if (cart == null) {
            return Map.of(
                    "items", List.of(),
                    "total", BigDecimal.ZERO
            );
        }

        List<CartItem> cartItems =
                cartItemRepository.findByCartId(cart.getId());

        List<Map<String, Object>> items =
                new ArrayList<>();

        BigDecimal total = BigDecimal.ZERO;

        for (CartItem item : cartItems) {

            Product product = item.getProduct();

            BigDecimal lineTotal =
                    product.getPrice()
                            .multiply(
                                    BigDecimal.valueOf(
                                            item.getQuantity()
                                    )
                            );

            total = total.add(lineTotal);

            items.add(
                    Map.of(
                            "id", item.getId(),
                            "productId", product.getId(),
                            "quantity", item.getQuantity(),
                            "product", Map.of(
                                    "id", product.getId(),
                                    "name", product.getName(),
                                    "price", product.getPrice(),
                                    "imageUrl",
                                            product.getImageUrl(),
                                    "rating",
                                            product.getRating(),
                                    "reviewCount",
                                            product.getReviewCount(),
                                    "category",
                                            product.getCategory().getName(),
                                    "vendor",
                                            product.getVendor().getStoreName()
                            ),
                            "lineTotal", lineTotal
                    )
            );
        }

        return Map.of(
                "items", items,
                "total", total
        );
    }

    @PostMapping("/items")
    public Map<String, Object> addItem(
            @RequestBody AddCartRequest request,
            @AuthenticationPrincipal OAuth2User oauthUser) {

        User user = getUser(oauthUser);

        Product product =
                productRepository
                        .findById(request.productId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found"
                                )
                        );

        Cart cart =
                cartRepository
                        .findByUserId(user.getId())
                        .orElseGet(() -> {

                            Cart newCart = new Cart();

                            newCart.setUser(user);

                            return cartRepository.save(newCart);
                        });

        List<CartItem> existingItems =
                cartItemRepository.findByCartId(
                        cart.getId()
                );

        CartItem existing =
                existingItems.stream()
                        .filter(item ->
                                item.getProduct()
                                        .getId()
                                        .equals(product.getId())
                        )
                        .findFirst()
                        .orElse(null);

        int quantity =
                Math.max(1, request.quantity());

        if (existing != null) {

            existing.setQuantity(
                    existing.getQuantity() + quantity
            );

            cartItemRepository.save(existing);

        } else {

            CartItem item = new CartItem();

            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(quantity);

            cartItemRepository.save(item);
        }

        return Map.of(
                "success", true
        );
    }

    @PutMapping("/items/{id}")
    public Map<String, Object> updateItem(
            @PathVariable Long id,
            @RequestBody UpdateCartRequest request,
            @AuthenticationPrincipal OAuth2User oauthUser) {

        User user = getUser(oauthUser);

        Cart cart =
                cartRepository
                        .findByUserId(user.getId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Cart not found"
                                )
                        );

        CartItem item =
                cartItemRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Cart item not found"
                                )
                        );

        if (!item.getCart()
                .getId()
                .equals(cart.getId())) {

            throw new RuntimeException(
                    "Unauthorized cart item"
            );
        }

        if (request.quantity() <= 0) {

            cartItemRepository.delete(item);

        } else {

            item.setQuantity(
                    request.quantity()
            );

            cartItemRepository.save(item);
        }

        return Map.of(
                "success", true
        );
    }

    @DeleteMapping("/items/{id}")
    public Map<String, Object> deleteItem(
            @PathVariable Long id,
            @AuthenticationPrincipal OAuth2User oauthUser) {

        User user = getUser(oauthUser);

        Cart cart =
                cartRepository
                        .findByUserId(user.getId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Cart not found"
                                )
                        );

        CartItem item =
                cartItemRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Cart item not found"
                                )
                        );

        if (!item.getCart()
                .getId()
                .equals(cart.getId())) {

            throw new RuntimeException(
                    "Unauthorized cart item"
            );
        }

        cartItemRepository.delete(item);

        return Map.of(
                "success", true
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
                        )
                );
    }

    public record AddCartRequest(
            Long productId,
            int quantity
    ) {}

    public record UpdateCartRequest(
            int quantity
    ) {}
}