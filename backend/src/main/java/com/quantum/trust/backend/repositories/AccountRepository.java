package com.quantum.trust.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.quantum.trust.backend.model.entities.Account;
import com.quantum.trust.backend.model.entities.User;

/**
 * @repository AccountRepository
 * @description Repository interface for managing Account entities.
 *
 * @interface AccountRepository
 *
 * @method findAllAcountsByUser - Finds all accounts associated with a specific
 *         user.
 * @param {User} user - The user whose accounts are to be found.
 * @returns {List<Account>} - A list of accounts associated with the user.
 */
public interface AccountRepository extends JpaRepository<Account, String> {
    List<Account> findAllAcountsByUser(User user);
}
