package com.reefradar.backend.species;

import java.time.Instant;

public record SpeciesDiveSiteResponse(
        Long diveSiteId,
        String diveSiteName,
        String countryCode,
        String countryName,
        String region,
        String island,
        Long sightingCount,
        Instant mostRecentSightingTime
) {
}
