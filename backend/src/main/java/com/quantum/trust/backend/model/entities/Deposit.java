package com.quantum.trust.backend.model.entities;

import com.quantum.trust.backend.annotations.IbanId;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "deposits")
public class Deposit {
    @Id
    @IbanId
    private String id;

    @Column(name = "type", nullable = false)
    private String type;

    @Column(name = "percent", nullable = false)
    private Float percent;

    @Column(name = "balance", nullable = false)
    private Float balance;

    @Column(name = "currency", nullable = false)
    private String currency;

    @Column(name = "endDate", nullable = false)
    private String endDate;

    @ManyToOne
    @JoinColumn(name = "assignedAccountId", referencedColumnName = "id")
    private Account account;

    @Column(name = "duration", nullable = false)
    private Integer duration;
}
