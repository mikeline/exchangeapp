package com.example.exchangeapp.repo;

import com.example.exchangeapp.model.Security;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SecurityRepo extends JpaRepository<Security, Long> {

}
