package com.seguros.controller;

import com.seguros.service.RiskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/riesgos")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://frontend-xi-olive-tg7f1f8b2d.vercel.app",
    "https://*.vercel.app"
})
@RequiredArgsConstructor
public class RiskController {

    private final RiskService riskService;

    @PostMapping("/{id}/cancelar")
    public ResponseEntity<Void> cancelRisk(@PathVariable UUID id) {
        riskService.cancelRisk(id);
        return ResponseEntity.noContent().build();
    }
}
