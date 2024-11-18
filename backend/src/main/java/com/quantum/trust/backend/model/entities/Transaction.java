package com.quantum.trust.backend.model.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "date", nullable = false)
    private String date;

    @Column(name = "hour", nullable = false)
    private String hour;

    @Column(name = "title", nullable = false)
    private String title;

    @ManyToOne
    @JoinColumn(name = "assignedAccountId", referencedColumnName = "id")
    private Account account;

    @Column(name = "type", nullable = false)
    private String type;

    @Column(name = "amount", nullable = false)
    private Float amount;

    @Column(name = "currency", nullable = false)
    private String currency;

    @Column(name = "accountAmountAfter", nullable = false)
    private Float accountAmountAfter;

    @Column(name = "category", nullable = false)
    private String category;

    @Column(name = "accountCurrency", nullable = false)
    private String accountCurrency;

    @Column(name = "status", nullable = false)
    private String status;
}
