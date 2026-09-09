package com.seguros.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PolicyRequest {
    private UUID clientId;
    private String type;
    private BigDecimal canonAmount;
    private LocalDate startDate;
    private LocalDate endDate;
}