package com.seguros.service;

import com.seguros.entity.Risk;
import com.seguros.entity.RiskStatus;
import com.seguros.repository.RiskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RiskService {

    private final RiskRepository riskRepository;
    private final CoreIntegrationService coreService;

    @Transactional
    public void cancelRisk(UUID riskId) {
        Risk risk = riskRepository.findById(riskId)
                .orElseThrow(() -> new RuntimeException("Riesgo no encontrado con ID: " + riskId));

        risk.setStatus(RiskStatus.CANCELLED);
        riskRepository.save(risk);

        coreService.sendEvent("ACTUALIZACION", risk.getPolicy().getId());

        log.info("Riesgo cancelado: {}", riskId);
    }
}