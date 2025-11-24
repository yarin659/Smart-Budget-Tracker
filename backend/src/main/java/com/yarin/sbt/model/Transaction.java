package com.yarin.sbt.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String date;
    @Column(name = "description")
    private String description;
    private String category;
    private Double amount;
    private String type; // expense / income
}
