package com.quantum.trust.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.quantum.trust.backend.model.entities.Account;
import com.quantum.trust.backend.model.entities.Card;

public interface CardRepository extends JpaRepository<Card, Long> {
    List<Card> findAllCardsByAccount(Account assignedAccount);
}