package com.reefradar.backend.species;

import java.time.LocalDate;

public record SpeciesDiveSiteResponse(
        Long diveSiteId,
        String diveSiteName,
        String countryCode,
        String countryName,
        String region,
        String island,
        Long sightingCount,
        LocalDate mostRecentSightingDate
) {
}
