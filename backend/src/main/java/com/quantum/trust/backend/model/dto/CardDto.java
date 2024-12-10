package com.quantum.trust.backend.model.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * @dto CardDto
 * @description Data Transfer Object for Card entities.
 *
 * @class CardDto
 *
 * @field {String} id - The unique identifier of the card.
 * @field {String} assignedAccountNumber - The account number assigned to the
 *        card.
 * @field {String} type - The type of the card.
 * @field {String} publisher - The publisher of the card.
 * @field {String} image - The image associated with the card.
 * @field {String} limits - The limits of the card.
 * @field {String} pin - The PIN code of the card.
 * @field {String} cvcCode - The CVC code of the card.
 * @field {String} expirationDate - The expiration date of the card.
 * @field {String} showingCardSite - The site where the card is shown.
 * @field {String} backImage - The back image of the card.
 * @field {String} fees - The fees associated with the card.
 * @field {String} status - The status of the card.
 */
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
    private String pin;
    private String cvcCode;
    private String expirationDate;
    private String showingCardSite;
    private String backImage;
    private String fees;
    private String status;
}
