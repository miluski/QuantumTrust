package com.quantum.trust.backend.model.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class CardDto implements Serializable {
    private String id;
    private String assignedAccountNumber;
    private String type;
    private String publisher;
    private String image;
    private String limits;
    private Integer pin;
    private Integer cvcCode;
    private String expirationDate;
    private String showingCardSite;
    private String backImage;
    private String fees;
    private String status;
}
