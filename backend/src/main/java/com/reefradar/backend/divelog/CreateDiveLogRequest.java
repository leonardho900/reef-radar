package com.reefradar.backend.divelog;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record CreateDiveLogRequest(

        @NotNull @Positive Long diveSiteId,

        @NotNull @PastOrPresent LocalDate diveDate,

        @NotNull @DecimalMin("0.1") BigDecimal maxDepthMeters,

        @NotNull @Positive Integer durationMinutes,

        @DecimalMin("-10.0") @DecimalMax("50.0") BigDecimal waterTemperatureCelsius,

        @Positive Integer visibilityMeters,

        @Size(max = 2000) String notes) {
}