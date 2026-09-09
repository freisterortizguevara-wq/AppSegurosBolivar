package com.seguros.service;

import com.seguros.dto.CoreEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CoreIntegrationService {

    private final RestTemplate restTemplate;

    @Value("${api.key}")
    private String apiKey;

    private static final String CORE_MOCK_URL = "http://localhost:8080/core-mock/evento";

    public void sendEvent(String eventType, UUID policyId) {
        try {
            CoreEvent event = CoreEvent.builder()
                    .evento(eventType)
                    .polizaId(policyId)
                    .build();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-api-key", apiKey);

            HttpEntity<CoreEvent> request = new HttpEntity<>(event, headers);

            restTemplate.postForEntity(CORE_MOCK_URL, request, Void.class);

            log.info("Evento enviado al CORE: {} - Póliza: {}", eventType, policyId);

        } catch (Exception e) {
            log.error("Error enviando evento al CORE: {}", e.getMessage());
        }
    }
}