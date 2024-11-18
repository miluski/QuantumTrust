package com.quantum.trust.backend.mappers;

import org.springframework.stereotype.Component;

import com.quantum.trust.backend.model.dto.TransactionDto;
import com.quantum.trust.backend.model.entities.Transaction;

@Component
public class TransactionMapper {
    public TransactionDto convertToTransactionDto(Transaction transaction) {
        return TransactionDto
                .builder()
                .id(transaction.getId())
                .account(transaction.getAccount())
                .accountAmountAfter(transaction.getAccountAmountAfter())
                .accountCurrency(transaction.getAccountCurrency())
                .amount(transaction.getAmount())
                .category(transaction.getCategory())
                .currency(transaction.getCurrency())
                .date(transaction.getDate())
                .hour(transaction.getHour())
                .status(transaction.getStatus())
                .title(transaction.getTitle())
                .type(transaction.getType())
                .build();
    }

    public Transaction convertToTransaction(TransactionDto transactionDto) {
        return Transaction
                .builder()
                .account(transactionDto.getAccount())
                .accountAmountAfter(transactionDto.getAccountAmountAfter())
                .accountCurrency(transactionDto.getAccountCurrency())
                .amount(transactionDto.getAmount())
                .category(transactionDto.getCategory())
                .currency(transactionDto.getCurrency())
                .date(transactionDto.getDate())
                .hour(transactionDto.getHour())
                .status(transactionDto.getStatus())
                .title(transactionDto.getTitle())
                .type(transactionDto.getType())
                .build();
    }
}
