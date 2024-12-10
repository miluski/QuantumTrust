package com.quantum.trust.backend.utils;

import java.io.Serializable;
import java.util.Random;

import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;

/**
 * @class CardNumberGenerator
 * @description Utility class for generating random card numbers.
 *
 * @implements IdentifierGenerator
 *
 * @method generate - Generates a random 16-digit card number.
 * @param {SharedSessionContractImplementor} session - The Hibernate session.
 * @param {Object}                           object - The entity for which the
 *                                           ID is being generated.
 * @returns {Serializable} - The generated card number.
 */
public class CardNumberGenerator implements IdentifierGenerator {
    @Override
    public Serializable generate(SharedSessionContractImplementor session, Object object) {
        Random random = new Random();
        StringBuilder cardNumber = new StringBuilder();
        for (int i = 0; i < 16; i++) {
            cardNumber.append(random.nextInt(10));
        }
        return cardNumber.toString();
    }
}