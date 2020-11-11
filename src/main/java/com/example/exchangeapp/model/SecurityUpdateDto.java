package com.example.exchangeapp.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class SecurityUpdateDto {

    private String instrument;

    private LocalDate date;

    private int price;

}
