package com.quantum.trust.backend.model.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * @dto UserDto
 * @description Data Transfer Object for User entities.
 *
 * @class UserDto
 *
 * @field {Long} id - The unique identifier of the user.
 * @field {String} emailAddress - The email address of the user.
 * @field {String} phoneNumber - The phone number of the user.
 * @field {String} firstName - The first name of the user.
 * @field {String} lastName - The last name of the user.
 * @field {Long} peselNumber - The PESEL number of the user.
 * @field {String} documentType - The type of the user's document.
 * @field {String} documentSerie - The series of the user's document.
 * @field {String} address - The address of the user.
 * @field {String} password - The password of the user.
 * @field {String} avatarPath - The avatar path of the user.
 */
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
