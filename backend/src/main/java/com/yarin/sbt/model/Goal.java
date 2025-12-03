package com.yarin.sbt.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "goals")
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private Double targetAmount;
    private Double currentAmount = 0.0 ;

    private LocalDate deadline;       // YYYY-MM-DD
    private Double monthlyAmount;     // deposit each month
    private Integer monthlyDay;       // 1–28

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
