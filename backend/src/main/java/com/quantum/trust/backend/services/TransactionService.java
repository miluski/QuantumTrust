package com.quantum.trust.backend.services;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.quantum.trust.backend.mappers.TransactionMapper;
import com.quantum.trust.backend.model.TransactionCredentials;
import com.quantum.trust.backend.model.dto.EncryptedDto;
import com.quantum.trust.backend.model.dto.TransactionDto;
import com.quantum.trust.backend.model.entities.Account;
import com.quantum.trust.backend.model.entities.Card;
import com.quantum.trust.backend.model.entities.Transaction;
import com.quantum.trust.backend.repositories.TransactionRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;

/**
 * @service TransactionService
 * @description Service class for handling transactions, including saving,
 *              retrieving, and recalculating amounts.
 *
 * @class TransactionService
 *
 * @constructor
 *              Initializes the TransactionService with the specified services
 *              and repositories.
 *
 * @method checkTransactionStatuses - Scheduled method to check and update
 *         transaction statuses.
 *
 * @method getAllUserTransactions - Retrieves all transactions for a user.
 * @param {HttpServletRequest} httpServletRequest - The HTTP request containing
 *                             user information.
 * @returns {ResponseEntity<?>} - A ResponseEntity containing the user's
 *          transactions or an error status.
 *
 * @method saveNewTransaction - Saves a new transaction.
 * @param {TransactionDto} transactionDto - The transaction data transfer
 *                         object.
 * @returns {boolean} - True if the transaction was saved successfully, false
 *          otherwise.
 *
 * @method getTransactionDto - Converts transaction credentials to a
 *         TransactionDto.
 * @param {Account}                account - The account associated with the
 *                                 transaction.
 * @param {TransactionCredentials} transactionCredentials - The transaction
 *                                 credentials.
 * @returns {TransactionDto} - The transaction data transfer object.
 *
 * @method getRecalculatedAmount - Recalculates the amount based on currency
 *         exchange rates.
 * @param {String} fromCurrency - The original currency.
 * @param {String} toCurrency - The target currency.
 * @param {float}  amount - The amount to be recalculated.
 * @returns {float} - The recalculated amount.
 *
 * @method getTransactionsListResponse - Retrieves a list of transactions for
 *         the specified accounts and cards.
 * @param {List<Account>} accountList - The list of accounts.
 * @param {List<Card>}    cardList - The list of cards.
 * @returns {ResponseEntity<?>} - A ResponseEntity containing the transactions
 *          or an error status.
 *
 *          * @method getAllAccountTransactions - Retrieves all transactions for
 *          the specified accounts.
 * @param {List<Account>} accountList - The list of accounts.
 * @returns {List<Transaction>} - The list of transactions.
 *
 * @method getAllCardTransactions - Retrieves all transactions for the specified
 *         cards.
 * @param {List<Card>} cardList - The list of cards.
 * @returns {List<Transaction>} - The list of transactions.
 *
 * @method deleteTransaction - Deletes the saved transaction.
 *
 * @method getExchangeRate - Retrieves the exchange rate for the specified
 *         currency.
 * @param {String} currency - The currency code.
 * @returns {float} - The exchange rate.
 */
@Service
@EnableScheduling
public class TransactionService {
    private Transaction savedTransaction;

    private final CardService cardService;
    private final CryptoService cryptoService;
    private final AccountService accountService;
    private final TransactionMapper transactionMapper;
    private final TransactionRepository transactionRepository;

    private static final Map<String, Float> exchangeRates = new HashMap<>();

    static {
        exchangeRates.put("PLN", 1.0f);
        exchangeRates.put("EUR", 4.2883f);
        exchangeRates.put("USD", 3.8659f);
        exchangeRates.put("GBP", 5.0812f);
        exchangeRates.put("CHF", 4.5574f);
        exchangeRates.put("JPY", 0.027475f);
        exchangeRates.put("AUD", 2.596f);
        exchangeRates.put("CAD", 2.8475f);
    }

    @Autowired
    public TransactionService(@Lazy CardService cardService, AccountService accountService,
            CryptoService cryptoService,
            TransactionMapper transactionMapper,
            TransactionRepository transactionRepository) {
        this.cardService = cardService;
        this.accountService = accountService;
        this.cryptoService = cryptoService;
        this.transactionMapper = transactionMapper;
        this.transactionRepository = transactionRepository;
    }

    @Scheduled(cron = "0 * * * * *")
    @Transactional
    public void checkTransactionStatuses() {
        try {
            List<Transaction> transactions = this.transactionRepository.findAll();
            LocalDate today = LocalDate.now();
            for (Transaction transaction : transactions) {
                LocalDate transactionDate = LocalDate.parse(transaction.getDate());
                String transactionStatus = transaction.getStatus();
                if (transactionDate.isAfter(today.plusDays(2L)) && transactionStatus.equals("blockade")) {
                    transaction.setStatus("settled");
                    this.transactionRepository.save(transaction);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public ResponseEntity<?> getAllUserTransactions(HttpServletRequest httpServletRequest) {
        try {
            List<Account> userAccounts = this.accountService.retrieveAccountsFromUserId(httpServletRequest);
            List<Card> userCards = this.cardService.getAllUserCards(httpServletRequest);
            return userAccounts.isEmpty() && userCards.isEmpty() ? ResponseEntity.status(HttpStatus.NOT_FOUND).build()
                    : this.getTransactionsListResponse(userAccounts, userCards);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public boolean saveNewTransaction(TransactionDto transactionDto) {
        try {
            Transaction transaction = this.transactionMapper.convertToTransaction(transactionDto);
            this.savedTransaction = this.transactionRepository.save(transaction);
            return true;
        } catch (IllegalArgumentException e) {
            this.deleteTransaction();
            e.printStackTrace();
            return false;
        }
    }

    public TransactionDto getTransactionDto(Account account, TransactionCredentials transactionCredentials) {
        return TransactionDto
                .builder()
                .account(account)
                .accountAmountAfter(transactionCredentials.getAccountAmountAfter())
                .accountCurrency(account.getCurrency())
                .amount(transactionCredentials.getAmount())
                .category(transactionCredentials.getCategory())
                .currency(account.getCurrency())
                .date(LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")))
                .hour(LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm")))
                .status(transactionCredentials.getStatus())
                .title(transactionCredentials.getTitle())
                .type(transactionCredentials.getType())
                .build();
    }

    public float getRecalculatedAmount(String fromCurrency, String toCurrency, float amount) {
        float fromRate = this.getExchangeRate(fromCurrency);
        float toRate = this.getExchangeRate(toCurrency);
        float rate = fromRate / toRate;
        return amount * rate;
    }

    private ResponseEntity<?> getTransactionsListResponse(List<Account> accountList, List<Card> cardList)
            throws Exception {
        List<TransactionDto> accountTransactions = this.getAllAccountTransactions(accountList).stream()
                .map(transactionMapper::convertToTransactionDto).collect(Collectors.toList());
        List<TransactionDto> cardTransactions = this.getAllCardTransactions(cardList).stream()
                .map(transactionMapper::convertToTransactionDto).collect(Collectors.toList());
        List<TransactionDto> userTransactions = new ArrayList<>();
        if (!accountTransactions.isEmpty()) {
            userTransactions.addAll(accountTransactions);
        }
        if (!cardTransactions.isEmpty()) {
            userTransactions.addAll(cardTransactions);
        }
        String encryptedUserTransactions = this.cryptoService.encryptData(userTransactions);
        EncryptedDto encryptedDto = new EncryptedDto(encryptedUserTransactions);
        return userTransactions.isEmpty()
                ? ResponseEntity.status(HttpStatus.NOT_FOUND).build()
                : ResponseEntity.status(HttpStatus.OK).body(encryptedDto);
    }

    private List<Transaction> getAllAccountTransactions(List<Account> accountList) throws Exception {
        List<Transaction> accountTransactions = new ArrayList<>();
        for (Account account : accountList) {
            accountTransactions
                    .addAll(this.transactionRepository
                            .findAllTransactionsByAccount(account));
        }
        return accountTransactions;
    }

    private List<Transaction> getAllCardTransactions(List<Card> cardList) throws Exception {
        List<Transaction> cardTransactions = new ArrayList<>();
        for (Card card : cardList) {
            cardTransactions
                    .addAll(this.transactionRepository
                            .findAllTransactionsByCard(card));
        }
        return cardTransactions;
    }

    private void deleteTransaction() {
        try {
            this.transactionRepository.delete(savedTransaction);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private float getExchangeRate(String currency) {
        return exchangeRates.getOrDefault(currency, 1.0f);
    }
}
