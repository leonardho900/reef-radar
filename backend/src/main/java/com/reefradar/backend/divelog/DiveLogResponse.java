package com.reefradar.backend.divelog;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record DiveLogResponse(
        Long id,
        Long diveSiteId,
        String diveSiteName,
        LocalDate diveDate,
        BigDecimal maxDepthMeters,
        Integer durationMinutes,
        BigDecimal waterTemperatureCelsius,
        Integer visibilityMeters,
        String notes,
        Instant createdAt
) {
    public static DiveLogResponse from(DiveLog diveLog) {
        return new DiveLogResponse(
                diveLog.getId(),
                diveLog.getDiveSite().getId(),
                diveLog.getDiveSite().getName(),
                diveLog.getDiveDate(),
                diveLog.getMaxDepthMeters(),
                diveLog.getDurationMinutes(),
                diveLog.getWaterTemperatureCelsius(),
                diveLog.getVisibilityMeters(),
                diveLog.getNotes(),
                diveLog.getCreatedAt()
        );
    }
}