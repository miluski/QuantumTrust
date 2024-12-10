package com.quantum.trust.backend.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * @class Limits
 * @description Class representing the limits associated with an account or
 *              card.
 *
 * @field {Float[]} internetTransactions - The limits for internet transactions.
 * @field {Float[]} cashTransactions - The limits for cash transactions.
 */
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Limits {
    private Float[] internetTransactions;
    private Float[] cashTransactions;
}
