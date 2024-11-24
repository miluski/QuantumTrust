package com.quantum.trust.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.quantum.trust.backend.model.entities.Account;
import com.quantum.trust.backend.model.entities.Card;
import com.quantum.trust.backend.model.entities.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findAllTransactionsByAccount(Account assignedAccount);

    List<Transaction> findAllTransactionsByCard(Card assignedCard);
}
