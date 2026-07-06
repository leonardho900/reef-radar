package com.reefradar.backend.divesite;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record CreateDiveSiteRequest(
        @NotBlank @Size(max = 150) String name,
        @Size(max = 5000) String description,
        @NotBlank @Pattern(regexp = "(?i)^[A-Z]{2}$", message = "must be a two-letter code") String countryCode,
        @NotBlank @Size(max = 100) String countryName,
        @NotBlank @Size(max = 120) String region,
        @Size(max = 120) String island,
        @NotNull @DecimalMin("-90.0") @DecimalMax("90.0") BigDecimal latitude,
        @NotNull @DecimalMin("-180.0") @DecimalMax("180.0") BigDecimal longitude,
        @NotNull Difficulty difficulty,
        @Positive @Max(300) Integer averageVisibilityMeters
) {
}
