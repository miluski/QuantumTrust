package com.quantum.trust.backend.utils;

import java.io.Serializable;
import java.util.Random;

import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;

public class PolishAccountNumberGenerator implements IdentifierGenerator {

    @Override
    public Serializable generate(SharedSessionContractImplementor session, Object object) {
        String countryCode = "PL";
        String checkDigits = "49";
        String bankCode = "1020";
        String branchCode = "2892";
        String accountNumber = generateRandomDigits(4) + " " + generateRandomDigits(4) + " " + generateRandomDigits(4)
                + " " + generateRandomDigits(4);
        return countryCode + " " + checkDigits + " " + bankCode + " " + branchCode + " " + accountNumber;
    }

    private String generateRandomDigits(int length) {
        Random random = new Random();
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < length; i++) {
            result.append(random.nextInt(10));
        }
        return result.toString();
    }
}