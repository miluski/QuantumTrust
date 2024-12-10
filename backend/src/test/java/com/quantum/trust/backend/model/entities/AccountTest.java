package com.quantum.trust.backend.model.entities;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class AccountTest {

    private Account account;
    private User user;

    @BeforeEach
    public void setUp() {
        user = new User();
        user.setId(1L);
        user.setFirstName("Test User");
        account = Account.builder()
                .id("DE89370400440532013000")
                .image("image.png")
                .type("Savings")
                .balance(1000.0f)
                .currency("EUR")
                .user(user)
                .build();
    }

    @Test
    public void testAccountCreation() {
        assertNotNull(account);
        assertEquals("DE89370400440532013000", account.getId());
        assertEquals("image.png", account.getImage());
        assertEquals("Savings", account.getType());
        assertEquals(1000.0f, account.getBalance());
        assertEquals("EUR", account.getCurrency());
        assertEquals(user, account.getUser());
    }

    @Test
    public void testSettersAndGetters() {
        account.setId("GB29NWBK60161331926819");
        account.setImage("new_image.png");
        account.setType("Checking");
        account.setBalance(2000.0f);
        account.setCurrency("USD");
        assertEquals("GB29NWBK60161331926819", account.getId());
        assertEquals("new_image.png", account.getImage());
        assertEquals("Checking", account.getType());
        assertEquals(2000.0f, account.getBalance());
        assertEquals("USD", account.getCurrency());
    }

    @Test
    public void testToString() {
        String expected = "Account(id=DE89370400440532013000, image=image.png, type=Savings, balance=1000.0, currency=EUR, user=User(id=1, emailAddress=null, phoneNumber=null, firstName=Test User, lastName=null, peselNumber=null, documentType=null, documentSerie=null, address=null, password=null, avatarPath=null))";
        assertEquals(expected, account.toString());
    }
}