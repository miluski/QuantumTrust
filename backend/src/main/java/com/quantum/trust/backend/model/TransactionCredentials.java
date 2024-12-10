package com.quantum.trust.backend.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @class TransactionCredentials
 * @description Class representing the credentials for a transaction.
 *
 * @field {Float} accountAmountAfter - The account balance after the
 *        transaction.
 * @field {Float} amount - The amount of the transaction.
 * @field {String} category - The category of the transaction.
 * @field {String} status - The status of the transaction.
 * @field {String} title - The title of the transaction.
 * @field {String} type - The type of the transaction.
 */
@Getter
@AllArgsConstructor
public class TransactionCredentials {
    private final Float accountAmountAfter;
    private final Float amount;
    private final String category;
    private final String status;
    private final String title;
    private final String type;
}
