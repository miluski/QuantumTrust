package com.quantum.trust.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.quantum.trust.backend.model.entities.Account;
import com.quantum.trust.backend.model.entities.User;

public interface AccountRepository extends JpaRepository<Account, String> {
    List<Account> findAllAcountsByUser(User user);
}
