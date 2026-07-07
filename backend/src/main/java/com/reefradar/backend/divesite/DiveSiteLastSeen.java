package com.reefradar.backend.divesite;

import java.time.LocalDate;

public record DiveSiteLastSeen(
        Long diveSiteId,
        LocalDate lastSeenDate
) {
}
