package com.seguros.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Slf4j
public class NotificationService {

    public void notifyPolicyRenewed(UUID policyId, String email, String phone) {
        log.info("=== NOTIFICACIÓN: PÓLIZA RENOVADA ===");
        log.info("Email: {}", email);
        log.info("Teléfono: {}", phone);
        log.info("Mensaje: Póliza {} renovada exitosamente", policyId);
        log.info("====================================");
    }

    public void notifyPolicyCancelled(UUID policyId, String email, String phone) {
        log.info("=== NOTIFICACIÓN: PÓLIZA CANCELADA ===");
        log.info("Email: {}", email);
        log.info("Teléfono: {}", phone);
        log.info("Mensaje: Póliza {} cancelada", policyId);
        log.info("=====================================");
    }
}