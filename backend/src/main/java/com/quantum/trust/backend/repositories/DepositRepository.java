package com.quantum.trust.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.quantum.trust.backend.model.entities.Account;
import com.quantum.trust.backend.model.entities.Deposit;

/**
 * @repository DepositRepository
 * @description Repository interface for managing Deposit entities.
 *
 * @interface DepositRepository
 *
 * @method findAllDepositsByAccount - Finds all deposits associated with a
 *         specific account.
 * @param {Account} assignedAccount - The account whose deposits are to be
 *                  found.
 * @returns {List<Deposit>} - A list of deposits associated with the account.
 */
public interface DepositRepository extends JpaRepository<Deposit, String> {
    List<Deposit> findAllDepositsByAccount(Account assignedAccount);
}
