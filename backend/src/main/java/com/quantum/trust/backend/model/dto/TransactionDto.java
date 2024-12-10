package com.quantum.trust.backend.model.dto;

import java.io.Serializable;

import com.quantum.trust.backend.model.entities.Account;
import com.quantum.trust.backend.model.entities.Card;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * @dto TransactionDto
 * @description Data Transfer Object for Transaction entities.
 *
 * @class TransactionDto
 *
 * @field {Long} id - The unique identifier of the transaction.
 * @field {String} date - The date of the transaction.
 * @field {String} hour - The hour of the transaction.
 * @field {String} title - The title of the transaction.
 * @field {Account} account - The account associated with the transaction.
 * @field {Card} card - The card associated with the transaction.
 * @field {String} assignedAccountNumber - The account number assigned to the
 *        transaction.
 * @field {String} type - The type of the transaction.
 * @field {Float} amount - The amount of the transaction.
 * @field {String} currency - The currency of the transaction.
 * @field {Float} accountAmountAfter - The account balance after the
 *        transaction.
 * @field {String} category - The category of the transaction.
 * @field {String} accountCurrency - The currency of the account.
 * @field {String} status - The status of the transaction.
 */
@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDto implements Serializable {
    private Long id;
    private String date;
    private String hour;
    private String title;
    private Account account;
    private Card card;
    private String assignedAccountNumber;
    private String type;
    private Float amount;
    private String currency;
    private Float accountAmountAfter;
    private String category;
    private String accountCurrency;
    private String status;
}
