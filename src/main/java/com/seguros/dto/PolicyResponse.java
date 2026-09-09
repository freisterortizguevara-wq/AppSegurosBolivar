package com.seguros.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PolicyResponse {
    private UUID id;
    private UUID clientId;
    private String clientName;
    private String type;
    private String status;
    private BigDecimal canonAmount;
    private BigDecimal premiumAmount;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal ipc;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}