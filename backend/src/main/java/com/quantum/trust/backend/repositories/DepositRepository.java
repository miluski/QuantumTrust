package com.quantum.trust.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.quantum.trust.backend.model.entities.Account;
import com.quantum.trust.backend.model.entities.Deposit;

public interface DepositRepository extends JpaRepository<Deposit, String> {
    List<Deposit> findAllDepositsByAccount(Account assignedAccount);
}
