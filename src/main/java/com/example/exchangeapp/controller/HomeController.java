package com.example.exchangeapp.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@SuppressWarnings("unused")
@Controller
public class HomeController {

    @GetMapping("/")
    public String index() {
        return "index";
    }

}
