package com.example.exchangeapp.controller;

import com.example.exchangeapp.model.Security;
import com.example.exchangeapp.model.SecurityUpdateDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import com.example.exchangeapp.service.SecurityService;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.springframework.http.HttpStatus.*;

@RequiredArgsConstructor
@SuppressWarnings("unused")
@RestController
@RequestMapping("/security")
public class SecurityController {

    private final SecurityService securityService;

    @Transactional
    @PostMapping(value = "/create")
    @ResponseBody
    public ResponseEntity<Security> create(@RequestBody Security security) {
        Optional<Security> res = Optional.ofNullable(securityService.createSecurity(security));
        return res.map(value -> new ResponseEntity<>(value, CREATED)).orElseGet(() -> new ResponseEntity<>(CONFLICT));
    }

    @Transactional
    @PatchMapping(value = "/update/{id}")
    @ResponseBody
    public ResponseEntity<Security> update(@PathVariable("id") long id, @RequestBody SecurityUpdateDto securityDto) {
        Optional<Security> res = Optional.ofNullable(securityService.updateSecurity(id, securityDto));
        return res.map(value -> new ResponseEntity<>(value, CREATED)).orElseGet(() -> new ResponseEntity<>(CONFLICT));
    }

    @GetMapping(value = "/")
    @ResponseBody
    public ResponseEntity<List<Security>> getAll() {
        return new ResponseEntity<>(securityService.getAllSecurities(), OK);
    }

    @GetMapping(value = "/{id}")
    @ResponseBody
    public ResponseEntity<Security> getById(@PathVariable long id) {
        return new ResponseEntity<>(securityService.getSecurityById(id), OK);
    }

}
