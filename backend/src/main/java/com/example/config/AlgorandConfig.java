package com.example.config;

import com.algorand.algosdk.v2.client.common.AlgodClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AlgorandConfig {

    @Value("${algorand.algod-url}")
    private String algodUrl;

    @Bean
    public AlgodClient algodClient() {
        return new AlgodClient(
                algodUrl,
                443,
                ""
        );
    }
}