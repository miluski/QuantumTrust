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
public class DepositDto implements Serializable {
    private String id;
    private String type;
    private Float percent;
    private Float balance;
    private String currency;
    private String endDate;
    private String assignedAccountNumber;
    private Integer duration;
}
