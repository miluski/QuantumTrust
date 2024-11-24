package com.quantum.trust.backend.model.dto;

import java.io.Serializable;

import com.quantum.trust.backend.model.entities.Account;
import com.quantum.trust.backend.model.entities.Card;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@ToString
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
