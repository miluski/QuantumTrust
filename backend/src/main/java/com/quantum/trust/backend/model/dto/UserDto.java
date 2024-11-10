package com.quantum.trust.backend.model.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@ToString
@AllArgsConstructor
public class UserDto implements Serializable {
    private Long id;
    private String emailAddress;
    private String phoneNumber;
    private String firstName;
    private String lastName;
    private Long peselNumber;
    private String documentType;
    private String documentSerie;
    private String address;
    private String password;
    private String avatarPath;
}
