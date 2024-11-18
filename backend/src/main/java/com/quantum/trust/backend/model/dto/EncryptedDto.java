package com.quantum.trust.backend.model.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class EncryptedDto implements Serializable {
    private String encryptedAccountDto;
    private String encryptedUserDto;
}
