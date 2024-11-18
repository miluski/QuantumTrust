package com.quantum.trust.backend.mappers;

import org.springframework.stereotype.Component;

import com.quantum.trust.backend.model.dto.UserDto;
import com.quantum.trust.backend.model.entities.User;

@Component
public class UserMapper {

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

    public User convertToUser(UserDto userDto) {
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
                .peselNumber(userDto.getPeselNumber())
                .phoneNumber(userDto.getPhoneNumber())
                .build();
    }

}
