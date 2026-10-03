package com.example.service;

import com.example.entity.Category;
import com.example.entity.Inventory;
import com.example.entity.Product;
import com.example.entity.User;
import com.example.entity.Vendor;
import com.example.repository.CategoryRepository;
import com.example.repository.InventoryRepository;
import com.example.repository.ProductRepository;
import com.example.repository.UserRepository;
import com.example.repository.VendorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

//@Configuration
public class DataSeeder {

    private final ProductRepository productRepository;

    public DataSeeder(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Bean
    CommandLineRunner seedData(
            UserRepository userRepository,
            VendorRepository vendorRepository,
            CategoryRepository categoryRepository,
            InventoryRepository inventoryRepository) {

        return args -> {

            if (productRepository.count() > 0) {
                return;
            }

            // Vendor user
            User user = new User();
            user.setName("Galerie Studio");
            user.setEmail("vendor@galerie.demo");
            user.setGoogleId("demo-vendor");
            user.setRole(User.Role.VENDOR);
            userRepository.save(user);

            // Vendor
            Vendor vendor = new Vendor();
            vendor.setUser(user);
            vendor.setStoreName("Galerie Studio");
            vendor.setDescription(
                    "Curated products from independent creators."
            );
            vendorRepository.save(vendor);

            // Categories
            Category fashion = createCategory(
                    "Fashion",
                    "Clothing, accessories and contemporary fashion."
            );

            Category electronics = createCategory(
                    "Electronics",
                    "Modern gadgets and everyday technology."
            );

            Category home = createCategory(
                    "Home",
                    "Design-led products for modern spaces."
            );

            categoryRepository.save(fashion);
            categoryRepository.save(electronics);
            categoryRepository.save(home);

            // Products
            createProduct(
                    vendor,
                    fashion,
                    "Minimal Linen Shirt",
                    "Premium everyday linen shirt with a relaxed silhouette.",
                    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf",
                    "2499.00",
                    42,
                    inventoryRepository
            );

            createProduct(
                    vendor,
                    fashion,
                    "Classic Leather Backpack",
                    "Clean leather backpack designed for everyday carry.",
                    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
                    "3999.00",
                    25,
                    inventoryRepository
            );

            createProduct(
                    vendor,
                    electronics,
                    "Wireless Headphones",
                    "Comfortable wireless headphones for work and travel.",
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
                    "5499.00",
                    31,
                    inventoryRepository
            );

            createProduct(
                    vendor,
                    electronics,
                    "Smart Desk Lamp",
                    "Minimal LED desk lamp with adjustable brightness.",
                    "https://images.unsplash.com/photo-1507473885765-e6ed057f782c",
                    "1899.00",
                    18,
                    inventoryRepository
            );

            createProduct(
                    vendor,
                    home,
                    "Ceramic Table Vase",
                    "Hand-finished ceramic vase for contemporary interiors.",
                    "https://images.unsplash.com/photo-1578500351865-d6c3706c7f18",
                    "1299.00",
                    35,
                    inventoryRepository
            );

            createProduct(
                    vendor,
                    home,
                    "Modern Lounge Chair",
                    "Comfortable accent chair with a contemporary design.",
                    "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c",
                    "8999.00",
                    9,
                    inventoryRepository
            );

            System.out.println("GALERIE demo catalog seeded successfully.");
        };
    }

    private Category createCategory(
            String name,
            String description) {

        Category category = new Category();
        category.setName(name);
        category.setDescription(description);

        return category;
    }

    private void createProduct(
            Vendor vendor,
            Category category,
            String name,
            String description,
            String imageUrl,
            String price,
            int quantity,
            InventoryRepository inventoryRepository) {

        Product product = new Product();

        product.setVendor(vendor);
        product.setCategory(category);
        product.setName(name);
        product.setDescription(description);
        product.setPrice(new BigDecimal(price));
        product.setImageUrl(imageUrl);
        product.setRating(4.5);
        product.setReviewCount(0);
        product.setActive(true);

        Product savedProduct = productRepository.save(product);

        Inventory inventory = new Inventory();
        inventory.setProduct(savedProduct);
        inventory.setQuantity(quantity);
        inventory.setReserved(0);

        inventoryRepository.save(inventory);
    }
}