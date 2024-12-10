package com.quantum.trust.backend.model.entities;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;

public class UserTest {

    @Test
    public void testUserBuilder() {
        User user = User.builder()
                .emailAddress("test@example.com")
                .phoneNumber("123456789")
                .firstName("John")
                .lastName("Doe")
                .peselNumber("12345678901")
                .documentType("ID")
                .documentSerie("AB123456")
                .address("123 Main St")
                .password("password")
                .avatarPath("/path/to/avatar")
                .build();
        assertNotNull(user);
        assertEquals("test@example.com", user.getEmailAddress());
        assertEquals("123456789", user.getPhoneNumber());
        assertEquals("John", user.getFirstName());
        assertEquals("Doe", user.getLastName());
        assertEquals("12345678901", user.getPeselNumber());
        assertEquals("ID", user.getDocumentType());
        assertEquals("AB123456", user.getDocumentSerie());
        assertEquals("123 Main St", user.getAddress());
        assertEquals("password", user.getPassword());
        assertEquals("/path/to/avatar", user.getAvatarPath());
    }

    @Test
    public void testUserSettersAndGetters() {
        User user = new User();
        user.setEmailAddress("test@example.com");
        user.setPhoneNumber("123456789");
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setPeselNumber("12345678901");
        user.setDocumentType("ID");
        user.setDocumentSerie("AB123456");
        user.setAddress("123 Main St");
        user.setPassword("password");
        user.setAvatarPath("/path/to/avatar");
        assertEquals("test@example.com", user.getEmailAddress());
        assertEquals("123456789", user.getPhoneNumber());
        assertEquals("John", user.getFirstName());
        assertEquals("Doe", user.getLastName());
        assertEquals("12345678901", user.getPeselNumber());
        assertEquals("ID", user.getDocumentType());
        assertEquals("AB123456", user.getDocumentSerie());
        assertEquals("123 Main St", user.getAddress());
        assertEquals("password", user.getPassword());
        assertEquals("/path/to/avatar", user.getAvatarPath());
    }

    @Test
    public void testUserToString() {
        User user = User.builder()
                .emailAddress("test@example.com")
                .phoneNumber("123456789")
                .firstName("John")
                .lastName("Doe")
                .peselNumber("12345678901")
                .documentType("ID")
                .documentSerie("AB123456")
                .address("123 Main St")
                .password("password")
                .avatarPath("/path/to/avatar")
                .build();
        String expected = "User(id=null, emailAddress=test@example.com, phoneNumber=123456789, firstName=John, lastName=Doe, peselNumber=12345678901, documentType=ID, documentSerie=AB123456, address=123 Main St, password=password, avatarPath=/path/to/avatar)";
        assertEquals(expected, user.toString());
    }
}