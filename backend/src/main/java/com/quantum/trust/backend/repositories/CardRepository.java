package com.quantum.trust.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.quantum.trust.backend.model.entities.Account;
import com.quantum.trust.backend.model.entities.Card;

/**
 * @repository CardRepository
 * @description Repository interface for managing Card entities.
 *
 * @interface CardRepository
 *
 * @method findAllCardsByAccount - Finds all cards associated with a specific
 *         account.
 * @param {Account} assignedAccount - The account whose cards are to be found.
 * @returns {List<Card>} - A list of cards associated with the account.
 */
public interface CardRepository extends JpaRepository<Card, Long> {
    List<Card> findAllCardsByAccount(Account assignedAccount);
}