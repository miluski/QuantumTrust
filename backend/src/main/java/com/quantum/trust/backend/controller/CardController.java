package com.quantum.trust.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.quantum.trust.backend.services.CardService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/cards")
public class CardController {
    private final CardService cardService;

    @Autowired
    public CardController(CardService cardService) {
        this.cardService = cardService;
    }

    @GetMapping("/user/all")
    public ResponseEntity<?> getAllUserCards(HttpServletRequest httpServletRequest) {
        return this.cardService.getResponeWithAllUserCards(httpServletRequest);
    }
}
