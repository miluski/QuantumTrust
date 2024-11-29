package com.quantum.trust.backend.services;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quantum.trust.backend.mappers.CardMapper;
import com.quantum.trust.backend.model.Fees;
import com.quantum.trust.backend.model.TransactionCredentials;
import com.quantum.trust.backend.model.dto.CardDto;
import com.quantum.trust.backend.model.dto.EncryptedDto;
import com.quantum.trust.backend.model.dto.TransactionDto;
import com.quantum.trust.backend.model.entities.Account;
import com.quantum.trust.backend.model.entities.Card;
import com.quantum.trust.backend.repositories.AccountRepository;
import com.quantum.trust.backend.repositories.CardRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;

@Service
@EnableScheduling
public class CardService {
    private final AccountService accountService;
    private final CryptoService cryptoService;
    private final ValidationService validationService;
    private final TransactionService transactionService;
    private final CardMapper cardMapper;
    private final ObjectMapper objectMapper;
    private final CardRepository cardRepository;
    private final AccountRepository accountRepository;

    @Autowired
    public CardService(AccountService accountService, CryptoService cryptoService, ValidationService validationService,
            @Lazy TransactionService transactionService, CardMapper cardMapper,
            ObjectMapper objectMapper,
            CardRepository cardRepository, AccountRepository accountRepository) {
        this.accountService = accountService;
        this.cryptoService = cryptoService;
        this.validationService = validationService;
        this.transactionService = transactionService;
        this.cardMapper = cardMapper;
        this.objectMapper = objectMapper;
        this.cardRepository = cardRepository;
        this.accountRepository = accountRepository;
    }

    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void checkCardsFees() {
        try {
            List<Card> cardList = this.cardRepository.findAll();
            LocalDate today = LocalDate.now();
            for (Card card : cardList) {
                LocalDate creationDate = card.getCreationDate();
                if (creationDate.getDayOfMonth() == today.getDayOfMonth() && today.isAfter(creationDate)) {
                    this.chargeMonthlyFee(card);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Scheduled(cron = "0 * * * * *")
    @Transactional
    public void checkIsCardValid() {
        try {
            List<Card> cardList = this.cardRepository.findAll();
            LocalDate today = LocalDate.now();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
            for (Card card : cardList) {
                LocalDate cardExpirationDate = LocalDate.parse(card.getExpirationDate(), formatter);
                if (cardExpirationDate.isBefore(today)) {
                    this.cardRepository.delete(card);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
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

    public ResponseEntity<?> orderNewCard(String encryptedCardDto) {
        try {
            CardDto cardDto = this.getDecryptedCardDto(encryptedCardDto);
            Account account = this.getAccountFromCardDto(cardDto);
            Card card = this.cardMapper.convertToCard(cardDto);
            this.setCardCredentials(card, account);
            this.validationService.validateCard(card);
            this.cardRepository.save(card);
            this.chargeReleaseCardFee(account, card);
            return ResponseEntity.status(HttpStatus.OK).build();
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

    private void chargeMonthlyFee(Card card) throws Exception {
        Account account = card.getAccount();
        Fees fees = this.getFeesFromCard(card);
        if (account.getBalance() >= fees.getMonthly()) {
            this.saveMonthlyChargeTransaction(account, card);
            this.accountRepository.save(account);
        } else {
            this.cardRepository.delete(card);
        }
    }

    private void saveMonthlyChargeTransaction(Account account, Card card) throws Exception {
        TransactionCredentials transactionCredentials = this.getTransactionCredentials(account, card, "monthlyFee");
        TransactionDto transactionDto = this.transactionService.getTransactionDto(account, transactionCredentials);
        this.transactionService.saveNewTransaction(transactionDto);
    }

    private CardDto getDecryptedCardDto(String encryptedCardDto) throws Exception {
        String decryptedCardDto = this.cryptoService.decryptData(encryptedCardDto);
        decryptedCardDto = decryptedCardDto.replace("\\", "\"");
        return objectMapper.readValue(decryptedCardDto, CardDto.class);
    }

    private Account getAccountFromCardDto(CardDto cardDto) throws Exception {
        Optional<Account> account = this.accountRepository.findById(cardDto.getAssignedAccountNumber());
        if (account.isEmpty()) {
            throw new Exception("Account not found");
        }
        return account.get();
    }

    private void setCardCredentials(Card card, Account account) throws Exception {
        card.setAccount(account);
        card.setCvcCode(this.getCvcCode());
        card.setCreationDate(LocalDate.now());
    }

    private void chargeReleaseCardFee(Account account, Card card) throws Exception {
        TransactionCredentials transactionCredentials = this.getTransactionCredentials(account, card, "releaseFee");
        if (transactionCredentials.getAmount() > 0) {
            TransactionDto transactionDto = this.transactionService.getTransactionDto(account, transactionCredentials);
            this.transactionService.saveNewTransaction(transactionDto);
            this.accountRepository.save(account);
        }
    }

    private Fees getFeesFromCard(Card card) throws Exception {
        String decryptedFeesObject = this.cryptoService.decryptData(card.getFees());
        decryptedFeesObject = decryptedFeesObject.replace("\\", "\"");
        return this.objectMapper.readValue(decryptedFeesObject, Fees.class);
    }

    private TransactionCredentials getTransactionCredentials(Account account, Card card, String transactionType)
            throws Exception {
        Fees fees = this.getFeesFromCard(card);
        boolean isMonthlyFee = transactionType.equals("monthlyFee");
        String transactionTitle = isMonthlyFee ? "Opłata miesięczna za kartę " : "Opłata za założenie karty ";
        transactionTitle += this.formatCardId(card.getId());
        Float fee = isMonthlyFee ? Float.valueOf(fees.getMonthly()) : Float.valueOf(fees.getRelease());
        Float newAccountBalance = account.getBalance() - fee;
        if (fee > 0) {
            account.setBalance(newAccountBalance);
        }
        return new TransactionCredentials(newAccountBalance,
                fee, "Inne", "settled", transactionTitle, "outgoing");
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

    private String getCvcCode() throws Exception {
        Integer generatedCvcCode = ThreadLocalRandom.current().nextInt(100, 1000);
        return this.cryptoService.encryptData(generatedCvcCode);
    }

    private String formatCardId(String cardId) {
        return cardId.replaceAll("(.{4})", "$1 ").trim();
    }
}
