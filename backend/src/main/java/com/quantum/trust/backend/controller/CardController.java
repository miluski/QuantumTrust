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

/**
 * @controller CardController
 * @description Controller class for managing card-related operations.
 *
 * @class CardController
 *
 * @constructor
 *              Initializes the CardController with the specified CardService.
 *
 * @method getAllUserCards - Retrieves all cards for a user.
 * @param {HttpServletRequest} httpServletRequest - The HTTP request containing
 *                             user information.
 * @returns {ResponseEntity<?>} - A ResponseEntity containing the user's cards
 *          or an error status.
 *
 * @method orderNewCard - Orders a new card.
 * @param {String} encryptedCardDto - The encrypted card data transfer object.
 * @returns {ResponseEntity<?>} - A ResponseEntity indicating the result of the
 *          operation.
 *
 * @method suspendCard - Suspends a card.
 * @param {String} id - The ID of the card to suspend.
 * @returns {ResponseEntity<?>} - A ResponseEntity indicating the result of the
 *          operation.
 *
 * @method unsuspendCard - Unsuspends a card.
 * @param {String} id - The ID of the card to unsuspend.
 * @returns {ResponseEntity<?>} - A ResponseEntity indicating the result of the
 *          operation.
 *
 * @method editCard - Edits a card.
 * @param {String} encryptedCardObject - The encrypted card object containing
 *                 the updated card information.
 * @returns {ResponseEntity<?>} - A ResponseEntity indicating the result of the
 *          operation.
 */
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
