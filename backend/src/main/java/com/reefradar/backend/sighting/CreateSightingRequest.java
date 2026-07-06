package com.reefradar.backend.sighting;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record CreateSightingRequest(
        @NotNull @Positive Long diveLogId,
        @NotNull @Positive Long speciesId,
        @NotNull @Positive Integer quantity,
        @Size(max = 2000) String notes
) {
}
