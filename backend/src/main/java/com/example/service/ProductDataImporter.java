package com.example.service;

import com.example.entity.Product;
import com.example.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class ProductDataImporter implements CommandLineRunner {

    private final ProductRepository productRepository;

    public ProductDataImporter(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {

        long count = productRepository.count();

        if (count > 0) {
            System.out.println("==============================================");
            System.out.println("GALERIE CATALOG ALREADY EXISTS");
            System.out.println("Products in database : " + count);
            System.out.println("Skipping re-import.");
            System.out.println("==============================================");
            return;
        }

        System.out.println("==============================================");
        System.out.println("GALERIE CATALOG IS EMPTY");
        System.out.println("Importer should populate it here.");
        System.out.println("==============================================");

        // IMPORTANT:
        // Do not delete products here.
        //
        // Your existing 505-product catalog is already in MySQL.
        // If the database is empty in the future, the catalog import
        // logic can be added here separately.
    }
}