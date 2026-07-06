package com.reefradar.backend.divelog;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

import com.reefradar.backend.divesite.DiveSite;
import com.reefradar.backend.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "dive_logs")
public class DiveLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "dive_site_id", nullable = false)
    private DiveSite diveSite;

    @Column(name = "dive_date", nullable = false)
    private LocalDate diveDate;

    @Column(name = "max_depth_meters", nullable = false, precision = 5, scale = 2)
    private BigDecimal maxDepthMeters;

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes;

    @Column(name = "water_temperature_celsius", precision = 4, scale = 1)
    private BigDecimal waterTemperatureCelsius;

    @Column(name = "visibility_meters")
    private Integer visibilityMeters;

    private String notes;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected DiveLog() {
    }

    public DiveLog(
            User user,
            DiveSite diveSite,
            LocalDate diveDate,
            BigDecimal maxDepthMeters,
            Integer durationMinutes,
            BigDecimal waterTemperatureCelsius,
            Integer visibilityMeters,
            String notes) {
        this.user = user;
        this.diveSite = diveSite;
        this.diveDate = diveDate;
        this.maxDepthMeters = maxDepthMeters;
        this.durationMinutes = durationMinutes;
        this.waterTemperatureCelsius = waterTemperatureCelsius;
        this.visibilityMeters = visibilityMeters;
        this.notes = notes;
        this.createdAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public DiveSite getDiveSite() {
        return diveSite;
    }

    public LocalDate getDiveDate() {
        return diveDate;
    }

    public BigDecimal getMaxDepthMeters() {
        return maxDepthMeters;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public BigDecimal getWaterTemperatureCelsius() {
        return waterTemperatureCelsius;
    }

    public Integer getVisibilityMeters() {
        return visibilityMeters;
    }

    public String getNotes() {
        return notes;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}