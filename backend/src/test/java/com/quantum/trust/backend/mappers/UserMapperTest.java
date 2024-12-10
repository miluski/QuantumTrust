package com.quantum.trust.backend.mappers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.quantum.trust.backend.model.dto.UserDto;
import com.quantum.trust.backend.model.entities.User;
import com.quantum.trust.backend.services.CryptoService;

public class UserMapperTest {

    @Mock
    private CryptoService cryptoService;

    @InjectMocks
    private UserMapper userMapper;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testConvertToUserDto() {
        User user = User.builder()
                .avatarPath("avatarPath")
                .firstName("John")
                .lastName("Doe")
                .emailAddress("john.doe@example.com")
                .phoneNumber("123456789")
                .address("123 Main St")
                .build();
        UserDto userDto = userMapper.convertToUserDto(user);
        assertEquals(user.getAvatarPath(), userDto.getAvatarPath());
        assertEquals(user.getFirstName(), userDto.getFirstName());
        assertEquals(user.getLastName(), userDto.getLastName());
        assertEquals(user.getEmailAddress(), userDto.getEmailAddress());
        assertEquals(user.getPhoneNumber(), userDto.getPhoneNumber());
        assertEquals(user.getAddress(), userDto.getAddress());
    }

    @Test
    public void testConvertToUser() throws Exception {
        UserDto userDto = UserDto.builder()
                .id(1L)
                .avatarPath("avatarPath")
                .documentSerie("documentSerie")
                .documentType("documentType")
                .emailAddress("john.doe@example.com")
                .firstName("John")
                .lastName("Doe")
                .password("password")
                .peselNumber(12345678901L)
                .phoneNumber("123456789")
                .address("123 Main St")
                .build();
        when(cryptoService.encryptData(12345678901L)).thenReturn("encryptedPeselNumber");
        User user = userMapper.convertToUser(userDto);
        assertEquals(userDto.getId(), user.getId());
        assertEquals(userDto.getAvatarPath(), user.getAvatarPath());
        assertEquals(userDto.getDocumentSerie(), user.getDocumentSerie());
        assertEquals(userDto.getDocumentType(), user.getDocumentType());
        assertEquals(userDto.getEmailAddress(), user.getEmailAddress());
        assertEquals(userDto.getFirstName(), user.getFirstName());
        assertEquals(userDto.getLastName(), user.getLastName());
        assertEquals(userDto.getPassword(), user.getPassword());
        assertEquals("encryptedPeselNumber", user.getPeselNumber());
        assertEquals(userDto.getPhoneNumber(), user.getPhoneNumber());
        assertEquals(userDto.getAddress(), user.getAddress());
    }
}