package com.example.exchangeapp.model;


import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

@NoArgsConstructor
@Data
@Entity
public class Security {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    private long id;

    @Column(name = "instrument", nullable = false)
    private String instrument;

    @JsonFormat(pattern="yyyy-MM-dd")
    private LocalDate date;

    @Column(name = "price", nullable = false)
    private int price;

}
