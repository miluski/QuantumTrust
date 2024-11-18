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
public class AccountDto implements Serializable {
    private String id;
    private String image;
    private String type;
    private Float balance;
    private String currency;
}
