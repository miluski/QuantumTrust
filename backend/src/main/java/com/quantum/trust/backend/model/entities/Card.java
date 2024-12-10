package com.quantum.trust.backend.model.entities;

import java.time.LocalDate;

import com.quantum.trust.backend.annotations.CardId;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * @entity Card
 * @description Entity class representing a card.
 *
 * @class Card
 *
 * @field {String} id - The unique identifier of the card.
 * @field {Account} account - The account associated with the card.
 * @field {String} type - The type of the card.
 * @field {String} publisher - The publisher of the card.
 * @field {String} image - The image associated with the card.
 * @field {String} limits - The limits of the card.
 * @field {String} pin - The PIN code of the card.
 * @field {String} cvcCode - The CVC code of the card.
 * @field {String} expirationDate - The expiration date of the card.
 * @field {LocalDate} creationDate - The creation date of the card.
 * @field {String} showingCardSite - The site where the card is shown.
 * @field {String} backImage - The back image of the card.
 * @field {String} fees - The fees associated with the card.
 * @field {String} status - The status of the card.
 */
@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "cards")
public class Card {

    @Id
    @CardId
    private String id;

    @ManyToOne
    @JoinColumn(name = "assignedAccountId", referencedColumnName = "id")
    private Account account;

    @Column(name = "type", nullable = false)
    private String type;

    @Column(name = "publisher", nullable = false)
    private String publisher;

    @Column(name = "image", nullable = false)
    private String image;

    @Column(name = "limits", nullable = false)
    private String limits;

    @Column(name = "pin", nullable = false)
    private String pin;

    @Column(name = "cvcCode", nullable = false)
    private String cvcCode;

    @Column(name = "expirationDate", nullable = false)
    private String expirationDate;

    @Column(name = "creationDate", nullable = false)
    private LocalDate creationDate;

    @Column(name = "showingCardSite", nullable = false)
    private String showingCardSite;

    @Column(name = "backImage", nullable = false)
    private String backImage;

    @Column(name = "fees", nullable = false)
    private String fees;

    @Column(name = "status", nullable = false)
    private String status;
}