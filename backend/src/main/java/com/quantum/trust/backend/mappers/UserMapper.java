package com.quantum.trust.backend.mappers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.quantum.trust.backend.model.dto.UserDto;
import com.quantum.trust.backend.model.entities.User;
import com.quantum.trust.backend.services.CryptoService;

@Component
public class UserMapper {
    private final CryptoService cryptoService;

    @Autowired
    public UserMapper(CryptoService cryptoService) {
        this.cryptoService = cryptoService;
    }

    public UserDto convertToUserDto(User user) {
        return UserDto
                .builder()
                .avatarPath(user.getAvatarPath())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .emailAddress(user.getEmailAddress())
                .phoneNumber(user.getPhoneNumber())
                .address(user.getAddress())
                .build();
    }

    public User convertToUser(UserDto userDto) throws Exception {
        return User
                .builder()
                .id(userDto.getId())
                .address(userDto.getAddress())
                .avatarPath(userDto.getAvatarPath())
                .documentSerie(userDto.getDocumentSerie())
                .documentType(userDto.getDocumentType())
                .emailAddress(userDto.getEmailAddress())
                .firstName(userDto.getFirstName())
                .lastName(userDto.getLastName())
                .password(userDto.getPassword())
                .peselNumber(this.cryptoService.encryptData(userDto.getPeselNumber()))
                .phoneNumber(userDto.getPhoneNumber())
                .build();
    }
}
