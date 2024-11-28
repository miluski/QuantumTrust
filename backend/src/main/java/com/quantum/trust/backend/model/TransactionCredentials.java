package com.quantum.trust.backend.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

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
