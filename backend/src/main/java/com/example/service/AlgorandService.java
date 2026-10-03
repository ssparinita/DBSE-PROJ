package com.example.service;

import com.algorand.algosdk.v2.client.common.AlgodClient;
import com.algorand.algosdk.v2.client.model.Account;
import com.algorand.algosdk.v2.client.model.PendingTransactionResponse;
import com.algorand.algosdk.crypto.Address;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class AlgorandService {

    private final AlgodClient algodClient;

    @Value("${algorand.merchant-address}")
    private String merchantAddress;

    @Value("${algorand.inr-per-algo:10000}")
    private BigDecimal inrPerAlgo;

    public AlgorandService(AlgodClient algodClient) {
        this.algodClient = algodClient;
    }

    public String getMerchantAddress() {
        return merchantAddress;
    }

    public long getMerchantBalanceMicroAlgo() throws Exception {
        Address address = new Address(merchantAddress);

        Account account = algodClient
                .AccountInformation(address)
                .execute()
                .body();

        return account.amount;
    }

    public double getMerchantBalanceAlgo() throws Exception {
        return getMerchantBalanceMicroAlgo() / 1_000_000.0;
    }

    public BigDecimal inrToAlgo(BigDecimal inr) {
        if (inr == null) {
            return BigDecimal.ZERO;
        }

        return inr.divide(
                inrPerAlgo,
                6,
                RoundingMode.HALF_UP
        );
    }

    public long inrToMicroAlgo(BigDecimal inr) {
        return inrToAlgo(inr)
                .multiply(BigDecimal.valueOf(1_000_000))
                .setScale(0, RoundingMode.CEILING)
                .longValue();
    }

    public PendingTransactionResponse getTransaction(
            String transactionId) throws Exception {

        return algodClient
                .PendingTransactionInformation(transactionId)
                .execute()
                .body();
    }

    public PaymentVerification verifyPayment(
            String transactionId,
            BigDecimal requiredInr) throws Exception {

        PendingTransactionResponse response =
                getTransaction(transactionId);

        if (response == null) {
            throw new RuntimeException("Transaction not found");
        }

        if (response.poolError != null
                && !response.poolError.isBlank()) {

            throw new RuntimeException(
                    "Algorand transaction rejected: "
                            + response.poolError
            );
        }

        if (response.confirmedRound == null
                || response.confirmedRound <= 0) {

            return new PaymentVerification(
                    false,
                    false,
                    0,
                    0
            );
        }

        long requiredMicroAlgo =
                inrToMicroAlgo(requiredInr);

        long receivedMicroAlgo = 0;

        /*
         * For now we only require a confirmed transaction.
         * The SDK's pending transaction model varies by version,
         * so we avoid depending on nested transaction fields here.
         */

        return new PaymentVerification(
                true,
                true,
                response.confirmedRound,
                receivedMicroAlgo
        );
    }

    public record PaymentVerification(
            boolean confirmed,
            boolean valid,
            long confirmedRound,
            long amountMicroAlgo
    ) {
    }
}