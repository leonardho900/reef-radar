package com.reefradar.backend.divesite;

import java.math.BigDecimal;

public record DiveSiteResponse(
        Long id,
        String name,
        String description,
        BigDecimal latitude,
        BigDecimal longitude,
        Difficulty difficulty,
        Integer averageVisibilityMeters,
        String countryCode,
        String countryName,
        String region,
        String island,
        Long createdByUserId,
        String sourceProvider,
        String sourceUrl
) {
    public static DiveSiteResponse from(DiveSite diveSite) {
        return new DiveSiteResponse(
                diveSite.getId(),
                diveSite.getName(),
                diveSite.getDescription(),
                diveSite.getLatitude(),
                diveSite.getLongitude(),
                diveSite.getDifficulty(),
                diveSite.getAverageVisibilityMeters(),
                diveSite.getCountryCode(),
                diveSite.getCountryName(),
                diveSite.getRegion(),
                diveSite.getIsland(),
                diveSite.getCreatedByUser() == null
                        ? null
                        : diveSite.getCreatedByUser().getId(),
                diveSite.getSourceProvider(),
                diveSite.getSourceUrl()
        );
    }
}
