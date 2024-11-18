package com.quantum.trust.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.quantum.trust.backend.model.entities.Deposit;

public interface DepositRepository extends JpaRepository<Deposit, String> {
}
