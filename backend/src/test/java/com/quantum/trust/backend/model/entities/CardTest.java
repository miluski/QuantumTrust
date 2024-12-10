package com.quantum.trust.backend.model.entities;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.time.LocalDate;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class CardTest {

    private Card card;
    private Account account;

    @BeforeEach
    public void setUp() {
        account = new Account();
        account.setId("accountId");
        card = Card.builder()
                .id("cardId")
                .account(account)
                .type("Credit")
                .publisher("Bank")
                .image("image.png")
                .limits("1000")
                .pin("1234")
                .cvcCode("567")
                .expirationDate("12/25")
                .creationDate(LocalDate.now())
                .showingCardSite("site.com")
                .backImage("backImage.png")
                .fees("10")
                .status("Active")
                .build();
    }

    @Test
    public void testCardNotNull() {
        assertNotNull(card);
    }

    @Test
    public void testCardFields() {
        assertEquals("cardId", card.getId());
        assertEquals(account, card.getAccount());
        assertEquals("Credit", card.getType());
        assertEquals("Bank", card.getPublisher());
        assertEquals("image.png", card.getImage());
        assertEquals("1000", card.getLimits());
        assertEquals("1234", card.getPin());
        assertEquals("567", card.getCvcCode());
        assertEquals("12/25", card.getExpirationDate());
        assertEquals(LocalDate.now(), card.getCreationDate());
        assertEquals("site.com", card.getShowingCardSite());
        assertEquals("backImage.png", card.getBackImage());
        assertEquals("10", card.getFees());
        assertEquals("Active", card.getStatus());
    }
}