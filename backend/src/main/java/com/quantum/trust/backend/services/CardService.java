package com.quantum.trust.backend.services;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.quantum.trust.backend.mappers.CardMapper;
import com.quantum.trust.backend.model.dto.CardDto;
import com.quantum.trust.backend.model.dto.EncryptedDto;
import com.quantum.trust.backend.model.entities.Account;
import com.quantum.trust.backend.model.entities.Card;
import com.quantum.trust.backend.repositories.CardRepository;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class CardService {
    private final AccountService accountService;
    private final CryptoService cryptoService;
    private final CardMapper cardMapper;
    private final CardRepository cardRepository;

    @Autowired
    public CardService(AccountService accountService, CryptoService cryptoService, CardMapper cardMapper,
            CardRepository cardRepository) {
        this.accountService = accountService;
        this.cryptoService = cryptoService;
        this.cardMapper = cardMapper;
        this.cardRepository = cardRepository;
    }

    public ResponseEntity<?> getResponeWithAllUserCards(HttpServletRequest httpServletRequest) {
        try {
            List<Account> accountsList = this.accountService.retrieveAccountsFromUserId(httpServletRequest);
            return accountsList.isEmpty() ? ResponseEntity.status(HttpStatus.NOT_FOUND).build()
                    : this.getResponse(accountsList);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public List<Card> getAllUserCards(HttpServletRequest httpServletRequest) {
        List<Account> accountsList = this.accountService.retrieveAccountsFromUserId(httpServletRequest);
        if (accountsList.isEmpty()) {
            return null;
        }
        List<Card> cardsList = new ArrayList<>();
        this.addAllCards(accountsList, cardsList);
        return cardsList;
    }

    private ResponseEntity<?> getResponse(List<Account> accountsList) throws Exception {
        List<Card> cardsList = new ArrayList<>();
        this.addAllCards(accountsList, cardsList);
        List<CardDto> cardsListDto = cardsList.stream().map(this.cardMapper::convertToCardDto)
                .collect(Collectors.toList());
        String encryptedCardsList = this.cryptoService.encryptData(cardsListDto);
        EncryptedDto encryptedDto = new EncryptedDto(encryptedCardsList);
        return cardsList.isEmpty() ? ResponseEntity.status(HttpStatus.NOT_FOUND).build()
                : ResponseEntity.status(HttpStatus.OK).body(encryptedDto);
    }

    private void addAllCards(List<Account> accountsList, List<Card> cardsList) {
        for (Account account : accountsList) {
            List<Card> allCardsFromAccount = this.cardRepository.findAllCardsByAccount(account);
            if (!allCardsFromAccount.isEmpty()) {
                for (Card card : allCardsFromAccount) {
                    cardsList.add(card);
                }
            }
        }
    }
}
