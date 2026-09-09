package com.seguros.controller;

import com.seguros.dto.CoreEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/core-mock")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
@Slf4j
public class CoreMockController {

    @PostMapping("/evento")
    public ResponseEntity<Void> receiveEvent(@RequestBody CoreEvent event) {
        log.info("========================================");
        log.info("EVENTO RECIBIDO EN EL MOCK DEL CORE");
        log.info("========================================");
        log.info("Evento: {}", event.getEvento());
        log.info("Póliza ID: {}", event.getPolizaId());
        log.info("Estado: PROCESADO EXITOSAMENTE");
        log.info("========================================");
        return ResponseEntity.ok().build();
    }
}
