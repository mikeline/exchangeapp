package com.example.exchangeapp.service;

import com.example.exchangeapp.model.Security;
import com.example.exchangeapp.model.SecurityUpdateDto;
import com.example.exchangeapp.repo.SecurityRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class SecurityService {

    private final SecurityRepo securityRepo;

    public List<Security> getAllSecurities() {
        return securityRepo.findAll();
    }

    public Security getSecurityById(long id) {
        return securityRepo.getOne(id);
    }

    public Security createSecurity(Security security) {
        return securityRepo.save(security);
    }

    public Security updateSecurity(long id, SecurityUpdateDto securityDto) {
        Optional<Security> securityOptional = Optional.ofNullable(getSecurityById(id));
        if(securityOptional.isPresent()) {
            Security security = securityOptional.get();
            if(securityDto.getInstrument() != null) {
                security.setInstrument(securityDto.getInstrument());
            }
            if(securityDto.getDate() != null) {
                security.setDate(securityDto.getDate());
            }
            if(securityDto.getPrice() != 0) {
                security.setPrice(securityDto.getPrice());
            }
            return securityRepo.save(security);
        } else {
            return null;
        }
    }

}
