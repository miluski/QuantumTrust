package com.quantum.trust.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.quantum.trust.backend.services.DepositService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/deposits")
public class DepositController {
    private final DepositService depositService;

    @Autowired
    public DepositController(DepositService depositService) {
        this.depositService = depositService;
    }

    @GetMapping("/user/all")
    public ResponseEntity<?> getAllUserDeposits(HttpServletRequest httpServletRequest) {
        return this.depositService.getAllUserDeposits(httpServletRequest);
    }
}
