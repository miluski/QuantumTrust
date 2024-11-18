package com.quantum.trust.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.quantum.trust.backend.model.entities.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
}
