package com.quantum.trust.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.quantum.trust.backend.model.entities.Account;
import com.quantum.trust.backend.model.entities.Card;
import com.quantum.trust.backend.model.entities.Transaction;

/**
 * @repository TransactionRepository
 * @description Repository interface for managing Transaction entities.
 *
 * @interface TransactionRepository
 *
 * @method findAllTransactionsByAccount - Finds all transactions associated with
 *         a specific account.
 * @param {Account} assignedAccount - The account whose transactions are to be
 *                  found.
 * @returns {List<Transaction>} - A list of transactions associated with the
 *          account.
 *
 * @method findAllTransactionsByCard - Finds all transactions associated with a
 *         specific card.
 * @param {Card} assignedCard - The card whose transactions are to be found.
 * @returns {List<Transaction>} - A list of transactions associated with the
 *          card.
 */
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findAllTransactionsByAccount(Account assignedAccount);

    List<Transaction> findAllTransactionsByCard(Card assignedCard);
}
