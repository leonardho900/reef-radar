package com.reefradar.backend.divesite;

import java.math.BigDecimal;

public record DiveSiteResponse(
        Long id,
        String name,
        String description,
        BigDecimal latitude,
        BigDecimal longitude,
        Difficulty difficulty,
        Integer averageVisibilityMeters
) {
    public static DiveSiteResponse from(DiveSite diveSite) {
        return new DiveSiteResponse(
                diveSite.getId(),
                diveSite.getName(),
                diveSite.getDescription(),
                diveSite.getLatitude(),
                diveSite.getLongitude(),
                diveSite.getDifficulty(),
                diveSite.getAverageVisibilityMeters()
        );
    }
}
