package com.example.controller;

import com.example.entity.Product;
import com.example.repository.ProductRepository;
import com.example.repository.InventoryRepository;
import com.example.repository.OrderRepository;
import com.example.repository.OrderItemRepository;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(
        origins = "http://localhost:5175",
        allowCredentials = "true"
)
public class AIController {

    private final Client client;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    @Value("${gemini.model:gemini-flash-latest}")
    private String model;

    public AIController(
            @Value("${gemini.api-key}") String apiKey,
            ProductRepository productRepository,
            InventoryRepository inventoryRepository,
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository) {

        this.client = Client.builder()
                .apiKey(apiKey)
                .build();

        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
    }

    @PostMapping("/ask")
    public Map<String, Object> ask(
            @RequestBody Map<String, String> request) {

        String question = request.get("question");

        if (question == null || question.isBlank()) {
            throw new RuntimeException("Question is required");
        }

        long productCount = productRepository.count();
        long inventoryCount = inventoryRepository.count();
        long orderCount = orderRepository.count();

        String marketplaceData = """
                GALERIE LIVE MARKETPLACE DATA

                Total products: %d
                Total inventory records: %d
                Total orders: %d

                Important:
                - These values come from the GALERIE database.
                - Do not invent statistics.
                - If the supplied data is insufficient to answer something,
                  explicitly say that the data is insufficient.
                """.formatted(
                productCount,
                inventoryCount,
                orderCount
        );

        String prompt = """
                You are GALERIE AI, the intelligence assistant
                for a multi-vendor e-commerce marketplace.

                Your job is to analyze the marketplace data supplied
                below and answer the user's question.

                Be concise, practical and specific.

                Never invent marketplace statistics.
                Never pretend that unavailable data exists.

                %s

                USER QUESTION:
                %s
                """.formatted(
                marketplaceData,
                question
        );

        GenerateContentResponse response =
                client.models.generateContent(
                        model,
                        prompt,
                        null
                );

        return Map.of(
                "success", true,
                "answer", response.text(),
                "data", Map.of(
                        "products", productCount,
                        "inventory", inventoryCount,
                        "orders", orderCount
                )
        );
    }
}