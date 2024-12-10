package com.quantum.trust.backend.model.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * @entity User
 * @description Entity class representing a user.
 *
 * @class User
 *
 * @field {Long} id - The unique identifier of the user.
 * @field {String} emailAddress - The email address of the user.
 * @field {String} phoneNumber - The phone number of the user.
 * @field {String} firstName - The first name of the user.
 * @field {String} lastName - The last name of the user.
 * @field {String} peselNumber - The PESEL number of the user.
 * @field {String} documentType - The type of the user's document.
 * @field {String} documentSerie - The series of the user's document.
 * @field {String} address - The address of the user.
 * @field {String} password - The password of the user.
 * @field {String} avatarPath - The avatar path of the user.
 */
@Getter
@Setter
@Builder
@Entity
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq")
    @SequenceGenerator(name = "user_seq", sequenceName = "user_sequence", initialValue = 10000000, allocationSize = 1)
    private Long id;

    @Column(name = "email_address", nullable = false)
    private String emailAddress;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "pesel_number", nullable = false)
    private String peselNumber;

    @Column(name = "document_type", nullable = false)
    private String documentType;

    @Column(name = "document_serie", nullable = false)
    private String documentSerie;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "avatar_path", nullable = true)
    private String avatarPath;
}