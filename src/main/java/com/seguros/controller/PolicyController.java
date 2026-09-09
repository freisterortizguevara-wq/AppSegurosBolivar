package com.seguros.controller;

import com.seguros.dto.PolicyResponse;
import com.seguros.dto.RenewalRequest;
import com.seguros.dto.RiskRequest;
import com.seguros.dto.RiskResponse;
import com.seguros.service.PolicyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/polizas")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
@RequiredArgsConstructor
public class PolicyController {

    private final PolicyService policyService;

    @GetMapping
    public ResponseEntity<List<PolicyResponse>> listByTypeAndStatus(
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) String estado) {
        return ResponseEntity.ok(policyService.listByTypeAndStatus(tipo, estado));
    }

    @GetMapping("/{id}/riesgos")
    public ResponseEntity<List<RiskResponse>> getRisks(@PathVariable UUID id) {
        return ResponseEntity.ok(policyService.getRisksByPolicyId(id));
    }

    @PostMapping("/{id}/renovar")
    public ResponseEntity<PolicyResponse> renew(
            @PathVariable UUID id,
            @RequestBody RenewalRequest request) {
        return ResponseEntity.ok(policyService.renewPolicy(id, request.getIpc()));
    }

    @PostMapping("/{id}/cancelar")
    public ResponseEntity<Void> cancel(@PathVariable UUID id) {
        policyService.cancelPolicy(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/riesgos")
    public ResponseEntity<RiskResponse> addRisk(
            @PathVariable UUID id,
            @RequestBody RiskRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(policyService.addRiskToPolicy(id, request));
    }
}