package com.quantum.trust.backend.services;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.quantum.trust.backend.mappers.TransactionMapper;
import com.quantum.trust.backend.model.dto.TransactionDto;
import com.quantum.trust.backend.model.entities.Account;
import com.quantum.trust.backend.model.entities.Transaction;
import com.quantum.trust.backend.repositories.TransactionRepository;

@Service
public class TransactionService {
    private final TransactionMapper transactionMapper;
    private final TransactionRepository transactionRepository;
    
    private static final Map<String, Float> exchangeRates = new HashMap<>();

    static {
        exchangeRates.put("PLN", 1.0f);
        exchangeRates.put("EUR", 4.2883f);
        exchangeRates.put("USD", 3.8659f);
        exchangeRates.put("GBP", 5.0812f);
        exchangeRates.put("CHF", 4.5574f);
        exchangeRates.put("JPY", 0.027475f);
        exchangeRates.put("AUD", 2.596f);
        exchangeRates.put("CAD", 2.8475f);
    }

    @Autowired
    public TransactionService(TransactionMapper transactionMapper, TransactionRepository transactionRepository) {
        this.transactionMapper = transactionMapper;
        this.transactionRepository = transactionRepository;
    }

    public boolean saveNewTransaction(TransactionDto transactionDto) {
        try {
            Transaction transaction = this.transactionMapper.convertToTransaction(transactionDto);
            this.transactionRepository.save(transaction);
            return true;
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
            return false;
        }
    }

    public TransactionDto createStartTransactionDto(Account account) {
        return TransactionDto
                .builder()
                .account(account)
                .accountAmountAfter(this.getInitialAmount(account))
                .accountCurrency(account.getCurrency())
                .amount(this.getInitialAmount(account))
                .category("Inne")
                .currency(account.getCurrency())
                .date(LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")))
                .hour(LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm")))
                .status("settled")
                .title("Założenie nowego konta bankowego.")
                .type("incoming")
                .build();
    }

    public float getInitialAmount(Account account) {
        float amountInPLN = 1000.0f;
        float exchangeRate = getExchangeRate(account.getCurrency());
        float amountInCurrency = amountInPLN / exchangeRate;
        return amountInCurrency;
    }

    private float getExchangeRate(String currency) {
        return exchangeRates.getOrDefault(currency, 1.0f);
    }
}
