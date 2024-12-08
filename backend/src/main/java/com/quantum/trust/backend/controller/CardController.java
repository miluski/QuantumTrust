package com.quantum.trust.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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

    @PostMapping("/new")
    public ResponseEntity<?> orderNewCard(@RequestBody String encryptedCardDto) {
        return this.cardService.orderNewCard(encryptedCardDto);
    }

    @PatchMapping("/suspend")
    public ResponseEntity<?> suspendCard(@RequestParam String id) {
        return this.cardService.suspendCard(id);
    }

    @PatchMapping("/unsuspend")
    public ResponseEntity<?> unsuspendCard(@RequestParam String id) {
        return this.cardService.unsuspendCard(id);
    }

    @PatchMapping("/edit")
    public ResponseEntity<?> editCard(@RequestBody String encryptedCardObject) {
        return this.cardService.editCard(encryptedCardObject);
    }
}
