package com.quantum.trust.backend.model.dto;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;

public class UserDtoTest {

    @Test
    public void testUserDtoBuilder() {
        UserDto userDto = UserDto.builder()
                .id(1L)
                .emailAddress("test@example.com")
                .phoneNumber("123456789")
                .firstName("John")
                .lastName("Doe")
                .peselNumber(12345678901L)
                .documentType("ID")
                .documentSerie("AB123456")
                .address("123 Main St")
                .password("password")
                .avatarPath("/path/to/avatar")
                .build();
        assertNotNull(userDto);
        assertEquals(1L, userDto.getId());
        assertEquals("test@example.com", userDto.getEmailAddress());
        assertEquals("123456789", userDto.getPhoneNumber());
        assertEquals("John", userDto.getFirstName());
        assertEquals("Doe", userDto.getLastName());
        assertEquals(12345678901L, userDto.getPeselNumber());
        assertEquals("ID", userDto.getDocumentType());
        assertEquals("AB123456", userDto.getDocumentSerie());
        assertEquals("123 Main St", userDto.getAddress());
        assertEquals("password", userDto.getPassword());
        assertEquals("/path/to/avatar", userDto.getAvatarPath());
    }

    @Test
    public void testUserDtoSettersAndGetters() {
        UserDto userDto = new UserDto(1L, "test@example.com", "123456789", "John", "Doe", 12345678901L, "ID",
                "AB123456", "123 Main St", "password", "/path/to/avatar");
        userDto.setId(2L);
        userDto.setEmailAddress("new@example.com");
        userDto.setPhoneNumber("987654321");
        userDto.setFirstName("Jane");
        userDto.setLastName("Smith");
        userDto.setPeselNumber(10987654321L);
        userDto.setDocumentType("Passport");
        userDto.setDocumentSerie("CD789012");
        userDto.setAddress("456 Elm St");
        userDto.setPassword("newpassword");
        userDto.setAvatarPath("/new/path/to/avatar");
        assertEquals(2L, userDto.getId());
        assertEquals("new@example.com", userDto.getEmailAddress());
        assertEquals("987654321", userDto.getPhoneNumber());
        assertEquals("Jane", userDto.getFirstName());
        assertEquals("Smith", userDto.getLastName());
        assertEquals(10987654321L, userDto.getPeselNumber());
        assertEquals("Passport", userDto.getDocumentType());
        assertEquals("CD789012", userDto.getDocumentSerie());
        assertEquals("456 Elm St", userDto.getAddress());
        assertEquals("newpassword", userDto.getPassword());
        assertEquals("/new/path/to/avatar", userDto.getAvatarPath());
    }

    @Test
    public void testUserDtoToString() {
        UserDto userDto = new UserDto(1L, "test@example.com", "123456789", "John", "Doe", 12345678901L, "ID",
                "AB123456", "123 Main St", "password", "/path/to/avatar");
        String expected = "UserDto(id=1, emailAddress=test@example.com, phoneNumber=123456789, firstName=John, lastName=Doe, peselNumber=12345678901, documentType=ID, documentSerie=AB123456, address=123 Main St, password=password, avatarPath=/path/to/avatar)";
        assertEquals(expected, userDto.toString());
    }
}