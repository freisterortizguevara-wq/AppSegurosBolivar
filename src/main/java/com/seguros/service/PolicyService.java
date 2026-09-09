package com.seguros.service;

import com.seguros.dto.PolicyRequest;
import com.seguros.dto.PolicyResponse;
import com.seguros.dto.RiskRequest;
import com.seguros.dto.RiskResponse;
import com.seguros.entity.*;
import com.seguros.repository.ClientRepository;
import com.seguros.repository.PolicyRepository;
import com.seguros.repository.RiskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PolicyService {

    private final PolicyRepository policyRepository;
    private final RiskRepository riskRepository;
    private final ClientRepository clientRepository;
    private final CoreIntegrationService coreService;
    private final NotificationService notificationService;

    // ============================================
    // 1. LISTAR PÓLIZAS POR TIPO Y ESTADO
    // ============================================
    public List<PolicyResponse> listByTypeAndStatus(String type, String status) {
        PolicyType policyType = null;
        PolicyStatus policyStatus = null;

        if (type != null && !type.isEmpty()) {
            policyType = PolicyType.valueOf(type.toUpperCase());
        }

        if (status != null && !status.isEmpty()) {
            policyStatus = PolicyStatus.valueOf(status.toUpperCase());
        }

        List<Policy> policies;

        if (policyType != null && policyStatus != null) {
            policies = policyRepository.findByTypeAndStatus(policyType, policyStatus);
        } else if (policyType != null) {
            // Usamos una variable final para la lambda
            final PolicyType finalPolicyType = policyType;
            policies = policyRepository.findAll().stream()
                    .filter(p -> p.getType() == finalPolicyType)
                    .collect(Collectors.toList());
        } else if (policyStatus != null) {
            policies = policyRepository.findByStatus(policyStatus);
        } else {
            policies = policyRepository.findAll();
        }

        return policies.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ============================================
    // 2. OBTENER RIESGOS DE UNA PÓLIZA
    // ============================================
    public List<RiskResponse> getRisksByPolicyId(UUID policyId) {
        findPolicyById(policyId);
        List<Risk> risks = riskRepository.findByPolicyId(policyId);
        return risks.stream()
                .map(this::mapToRiskResponse)
                .collect(Collectors.toList());
    }

    // ============================================
    // 3. RENOVAR PÓLIZA
    // ============================================
    @Transactional
    public PolicyResponse renewPolicy(UUID policyId, BigDecimal ipc) {
        Policy policy = findPolicyById(policyId);

        // REGLA: No renovar póliza cancelada
        if (policy.getStatus() == PolicyStatus.CANCELLED) {
            throw new RuntimeException("No se puede renovar una póliza cancelada");
        }

        // Calcular nuevo canon y prima con IPC
        BigDecimal ipcFactor = BigDecimal.ONE.add(ipc.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP));
        BigDecimal newCanon = policy.getCanonAmount().multiply(ipcFactor).setScale(2, RoundingMode.HALF_UP);
        BigDecimal newPremium = newCanon.multiply(BigDecimal.valueOf(12));

        // Actualizar póliza
        policy.setCanonAmount(newCanon);
        policy.setPremiumAmount(newPremium);
        policy.setStatus(PolicyStatus.RENOVADA);
        policy.setIpc(ipc);

        // Actualizar fechas (renovar por 12 meses)
        LocalDate newStartDate = policy.getEndDate().plusDays(1);
        LocalDate newEndDate = newStartDate.plusMonths(12).minusDays(1);
        policy.setStartDate(newStartDate);
        policy.setEndDate(newEndDate);

        Policy saved = policyRepository.save(policy);

        // Enviar evento al CORE
        coreService.sendEvent("RENOVACION", policyId);

        // Enviar notificaciones
        notificationService.notifyPolicyRenewed(policyId, saved.getClient().getEmail(), saved.getClient().getPhone());

        log.info("Póliza renovada: {} con IPC: {}%", policyId, ipc);

        return mapToResponse(saved);
    }

    // ============================================
    // 4. CANCELAR PÓLIZA
    // ============================================
    @Transactional
    public void cancelPolicy(UUID policyId) {
        Policy policy = findPolicyById(policyId);

        // REGLA: Cancelar póliza cancela todos sus riesgos
        policy.setStatus(PolicyStatus.CANCELLED);
        policyRepository.save(policy);

        // Cancelar todos los riesgos asociados
        riskRepository.updateStatusByPolicyId(policyId, RiskStatus.CANCELLED);

        // Enviar evento al CORE
        coreService.sendEvent("CANCELACION", policyId);

        // Enviar notificaciones
        notificationService.notifyPolicyCancelled(policyId, policy.getClient().getEmail(), policy.getClient().getPhone());

        log.info("Póliza cancelada: {}", policyId);
    }

    // ============================================
    // 5. AGREGAR RIESGO A PÓLIZA
    // ============================================
    @Transactional
    public RiskResponse addRiskToPolicy(UUID policyId, RiskRequest request) {
        Policy policy = findPolicyById(policyId);

        // REGLA: Individual solo 1 riesgo
        if (policy.getType() == PolicyType.INDIVIDUAL) {
            long activeRisks = riskRepository.countByPolicyIdAndStatus(policyId, RiskStatus.ACTIVE);
            if (activeRisks >= 1) {
                throw new RuntimeException("Una póliza individual solo puede tener 1 riesgo");
            }
        }

        Risk risk = Risk.builder()
                .policy(policy)
                .description(request.getDescription())
                .amount(request.getAmount())
                .status(RiskStatus.ACTIVE)
                .build();

        Risk saved = riskRepository.save(risk);

        // Enviar evento al CORE
        coreService.sendEvent("ACTUALIZACION", policyId);

        log.info("Riesgo agregado a póliza {}: {}", policyId, request.getDescription());

        return mapToRiskResponse(saved);
    }

    // ============================================
    // MÉTODOS AUXILIARES
    // ============================================

    private Policy findPolicyById(UUID id) {
        return policyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Póliza no encontrada con ID: " + id));
    }

    private PolicyResponse mapToResponse(Policy policy) {
        return PolicyResponse.builder()
                .id(policy.getId())
                .clientId(policy.getClient().getId())
                .clientName(policy.getClient().getName())
                .type(policy.getType().name())
                .status(policy.getStatus().name())
                .canonAmount(policy.getCanonAmount())
                .premiumAmount(policy.getPremiumAmount())
                .startDate(policy.getStartDate())
                .endDate(policy.getEndDate())
                .ipc(policy.getIpc())
                .createdAt(policy.getCreatedAt())
                .updatedAt(policy.getUpdatedAt())
                .build();
    }

    private RiskResponse mapToRiskResponse(Risk risk) {
        return RiskResponse.builder()
                .id(risk.getId())
                .policyId(risk.getPolicy().getId())
                .description(risk.getDescription())
                .status(risk.getStatus().name())
                .amount(risk.getAmount())
                .createdAt(risk.getCreatedAt())
                .updatedAt(risk.getUpdatedAt())
                .build();
    }
}