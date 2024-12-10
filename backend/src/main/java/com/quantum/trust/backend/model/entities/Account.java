package com.quantum.trust.backend.model.entities;

import com.quantum.trust.backend.annotations.IbanId;

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
 * @entity Account
 * @description Entity class representing an account.
 *
 * @class Account
 *
 * @field {String} id - The unique identifier of the account.
 * @field {String} image - The image associated with the account.
 * @field {String} type - The type of the account.
 * @field {Float} balance - The balance of the account.
 * @field {String} currency - The currency of the account.
 * @field {User} user - The user associated with the account.
 */
@Getter
@Setter
@Builder
@Entity
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "accounts")
public class Account {
    @Id
    @IbanId
    private String id;

    @Column(name = "image", nullable = false)
    private String image;

    @Column(name = "type", nullable = false)
    private String type;

    @Column(name = "balance", nullable = false)
    private Float balance;

    @Column(name = "currency", nullable = false)
    private String currency;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
