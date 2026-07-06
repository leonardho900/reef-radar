package com.reefradar.backend.sighting;

import java.time.Instant;

public record SightingResponse(
        Long id,
        Long diveLogId,
        Long speciesId,
        String speciesCommonName,
        String speciesScientificName,
        Integer quantity,
        String notes,
        Instant createdAt
) {
    public static SightingResponse from(Sighting sighting) {
        return new SightingResponse(
                sighting.getId(),
                sighting.getDiveLog().getId(),
                sighting.getSpecies().getId(),
                sighting.getSpecies().getCommonName(),
                sighting.getSpecies().getScientificName(),
                sighting.getQuantity(),
                sighting.getNotes(),
                sighting.getCreatedAt()
        );
    }
}
