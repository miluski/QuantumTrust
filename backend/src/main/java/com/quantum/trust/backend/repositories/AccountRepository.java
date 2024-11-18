package com.quantum.trust.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.quantum.trust.backend.model.entities.Account;

public interface AccountRepository extends JpaRepository<Account, String> {
}
