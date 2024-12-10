package com.quantum.trust.backend.mappers;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.quantum.trust.backend.model.dto.CardDto;
import com.quantum.trust.backend.model.entities.Account;
import com.quantum.trust.backend.model.entities.Card;

public class CardMapperTest {

    private CardMapper cardMapper;

    @BeforeEach
    public void setUp() {
        cardMapper = new CardMapper();
    }

    @Test
    public void testConvertToCardDto() {
        Card card = new Card();
        card.setId("1");
        Account account = new Account();
        account.setId("2");
        card.setAccount(account);
        card.setBackImage("backImage");
        card.setCvcCode("123");
        card.setExpirationDate("15-12-2025");
        card.setFees("10.0f");
        card.setImage("image");
        card.setLimits("1000.0f");
        card.setPin("1234");
        card.setPublisher("publisher");
        card.setShowingCardSite("showingCardSite");
        card.setStatus("active");
        card.setType("type");
        CardDto cardDto = cardMapper.convertToCardDto(card);
        assertEquals(card.getId(), cardDto.getId());
        assertEquals(card.getAccount().getId(), cardDto.getAssignedAccountNumber());
        assertEquals(card.getBackImage(), cardDto.getBackImage());
        assertEquals(card.getCvcCode(), cardDto.getCvcCode());
        assertEquals("12/25", cardDto.getExpirationDate());
        assertEquals(card.getFees(), cardDto.getFees());
        assertEquals(card.getImage(), cardDto.getImage());
        assertEquals(card.getLimits(), cardDto.getLimits());
        assertEquals(card.getPin(), cardDto.getPin());
        assertEquals(card.getPublisher(), cardDto.getPublisher());
        assertEquals(card.getShowingCardSite(), cardDto.getShowingCardSite());
        assertEquals(card.getStatus(), cardDto.getStatus());
        assertEquals(card.getType(), cardDto.getType());
    }

    @Test
    public void testConvertToCard() {
        CardDto cardDto = CardDto.builder()
                .id("1")
                .assignedAccountNumber("2")
                .backImage("backImage")
                .cvcCode("123")
                .expirationDate("12/25")
                .fees("10.0f")
                .image("image")
                .limits("1000.0f")
                .pin("1234")
                .publisher("publisher")
                .showingCardSite("showingCardSite")
                .status("active")
                .type("type")
                .build();
        Card card = cardMapper.convertToCard(cardDto);
        assertEquals(cardDto.getBackImage(), card.getBackImage());
        assertEquals(cardDto.getCvcCode(), card.getCvcCode());
        assertEquals(cardDto.getExpirationDate(), card.getExpirationDate());
        assertEquals(cardDto.getFees(), card.getFees());
        assertEquals(cardDto.getImage(), card.getImage());
        assertEquals(cardDto.getLimits(), card.getLimits());
        assertEquals(cardDto.getPin(), card.getPin());
        assertEquals(cardDto.getPublisher(), card.getPublisher());
        assertEquals(cardDto.getShowingCardSite(), card.getShowingCardSite());
        assertEquals(cardDto.getStatus(), card.getStatus());
        assertEquals(cardDto.getType(), card.getType());
    }
}