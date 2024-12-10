package com.quantum.trust.backend.utils;

import java.io.Serializable;
import java.util.Random;

import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;

/**
 * @class PolishAccountNumberGenerator
 * @description Utility class for generating random Polish bank account numbers.
 *
 * @implements IdentifierGenerator
 *
 * @method generate - Generates a random Polish bank account number.
 * @param {SharedSessionContractImplementor} session - The Hibernate session.
 * @param {Object}                           object - The entity for which the
 *                                           ID is being generated.
 * @returns {Serializable} - The generated Polish bank account number.
 *
 * @method generateRandomDigits - Generates a string of random digits of the
 *         specified length.
 * @param {int} length - The length of the string of random digits to generate.
 * @returns {String} - The generated string of random digits.
 */
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