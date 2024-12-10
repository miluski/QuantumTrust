package com.quantum.trust.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.quantum.trust.backend.services.DepositService;

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

    @PostMapping("/new")
    public ResponseEntity<?> openNewDeposit(HttpServletRequest httpServletRequest,
            @RequestBody String encryptedDepositDto) {
        return this.depositService.saveNewDeposit(httpServletRequest, encryptedDepositDto);
    }
}
