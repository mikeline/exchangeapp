package com.example.exchangeapp;

import com.example.exchangeapp.model.Security;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.Transactional;

@SpringBootApplication
public class ExchangeAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(ExchangeAppApplication.class, args);
    }


}
