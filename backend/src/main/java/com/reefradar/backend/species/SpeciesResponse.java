package com.reefradar.backend.species;

public record SpeciesResponse(
        Long id,
        String commonName,
        String scientificName,
        SpeciesCategory category,
        String description
) {
    public static SpeciesResponse from(Species species) {
        return new SpeciesResponse(
                species.getId(),
                species.getCommonName(),
                species.getScientificName(),
                species.getCategory(),
                species.getDescription()
        );
    }
}
