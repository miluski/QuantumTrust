package com.quantum.trust.backend.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * @class Fees
 * @description Class representing the fees associated with an account or card.
 *
 * @field {float} release - The release fee.
 * @field {float} monthly - The monthly fee.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Fees {
    private float release;
    private float monthly;
}
