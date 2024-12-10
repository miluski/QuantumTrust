package com.quantum.trust.backend.model.dto;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;


public class CardDtoTest {

    @Test
    public void testCardDtoBuilder() {
        CardDto cardDto = CardDto.builder()
                .id("1")
                .assignedAccountNumber("123456789")
                .type("Credit")
                .publisher("Bank")
                .image("image.png")
                .limits("1000")
                .pin("1234")
                .cvcCode("123")
                .expirationDate("12/23")
                .showingCardSite("front")
                .backImage("backImage.png")
                .fees("10")
                .status("active")
                .build();
        assertEquals("1", cardDto.getId());
        assertEquals("123456789", cardDto.getAssignedAccountNumber());
        assertEquals("Credit", cardDto.getType());
        assertEquals("Bank", cardDto.getPublisher());
        assertEquals("image.png", cardDto.getImage());
        assertEquals("1000", cardDto.getLimits());
        assertEquals("1234", cardDto.getPin());
        assertEquals("123", cardDto.getCvcCode());
        assertEquals("12/23", cardDto.getExpirationDate());
        assertEquals("front", cardDto.getShowingCardSite());
        assertEquals("backImage.png", cardDto.getBackImage());
        assertEquals("10", cardDto.getFees());
        assertEquals("active", cardDto.getStatus());
    }

    @Test
    public void testCardDtoNoArgsConstructor() {
        CardDto cardDto = new CardDto();
        assertNotNull(cardDto);
    }

    @Test
    public void testCardDtoAllArgsConstructor() {
        CardDto cardDto = new CardDto("1", "123456789", "Credit", "Bank", "image.png", "1000", "1234", "123", "12/23",
                "front", "backImage.png", "10", "active");
        assertEquals("1", cardDto.getId());
        assertEquals("123456789", cardDto.getAssignedAccountNumber());
        assertEquals("Credit", cardDto.getType());
        assertEquals("Bank", cardDto.getPublisher());
        assertEquals("image.png", cardDto.getImage());
        assertEquals("1000", cardDto.getLimits());
        assertEquals("1234", cardDto.getPin());
        assertEquals("123", cardDto.getCvcCode());
        assertEquals("12/23", cardDto.getExpirationDate());
        assertEquals("front", cardDto.getShowingCardSite());
        assertEquals("backImage.png", cardDto.getBackImage());
        assertEquals("10", cardDto.getFees());
        assertEquals("active", cardDto.getStatus());
    }

    @Test
    public void testCardDtoSettersAndGetters() {
        CardDto cardDto = new CardDto();
        cardDto.setId("1");
        cardDto.setAssignedAccountNumber("123456789");
        cardDto.setType("Credit");
        cardDto.setPublisher("Bank");
        cardDto.setImage("image.png");
        cardDto.setLimits("1000");
        cardDto.setPin("1234");
        cardDto.setCvcCode("123");
        cardDto.setExpirationDate("12/23");
        cardDto.setShowingCardSite("front");
        cardDto.setBackImage("backImage.png");
        cardDto.setFees("10");
        cardDto.setStatus("active");
        assertEquals("1", cardDto.getId());
        assertEquals("123456789", cardDto.getAssignedAccountNumber());
        assertEquals("Credit", cardDto.getType());
        assertEquals("Bank", cardDto.getPublisher());
        assertEquals("image.png", cardDto.getImage());
        assertEquals("1000", cardDto.getLimits());
        assertEquals("1234", cardDto.getPin());
        assertEquals("123", cardDto.getCvcCode());
        assertEquals("12/23", cardDto.getExpirationDate());
        assertEquals("front", cardDto.getShowingCardSite());
        assertEquals("backImage.png", cardDto.getBackImage());
        assertEquals("10", cardDto.getFees());
        assertEquals("active", cardDto.getStatus());
    }
}