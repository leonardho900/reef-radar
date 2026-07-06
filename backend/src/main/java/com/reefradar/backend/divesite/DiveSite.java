package com.reefradar.backend.divesite;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import com.reefradar.backend.user.User;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "dive_sites")
public class DiveSite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 9, scale = 6)
    private BigDecimal latitude;

    @Column(nullable = false, precision = 9, scale = 6)
    private BigDecimal longitude;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Difficulty difficulty;

    @Column(name = "average_visibility_meters")
    private Integer averageVisibilityMeters;

    @Column(name = "country_code", nullable = false, length = 2)
    private String countryCode;

    @Column(name = "country_name", nullable = false, length = 100)
    private String countryName;

    @Column(nullable = false, length = 120)
    private String region;

    @Column(length = 120)
    private String island;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_user_id")
    private User createdByUser;

    @Column(name = "source_provider", length = 40)
    private String sourceProvider;

    @Column(name = "source_id", length = 120)
    private String sourceId;

    @Column(name = "source_url", length = 500)
    private String sourceUrl;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private Instant createdAt;

    protected DiveSite() {
    }

    public DiveSite(
            String name,
            String description,
            String countryCode,
            String countryName,
            String region,
            String island,
            BigDecimal latitude,
            BigDecimal longitude,
            Difficulty difficulty,
            Integer averageVisibilityMeters,
            User createdByUser
    ) {
        this.name = name;
        this.description = description;
        this.countryCode = countryCode;
        this.countryName = countryName;
        this.region = region;
        this.island = island;
        this.latitude = latitude;
        this.longitude = longitude;
        this.difficulty = difficulty;
        this.averageVisibilityMeters = averageVisibilityMeters;
        this.createdByUser = createdByUser;
    }

    public DiveSite(
            String name,
            String description,
            String countryCode,
            String countryName,
            String region,
            String island,
            BigDecimal latitude,
            BigDecimal longitude,
            Difficulty difficulty,
            Integer averageVisibilityMeters,
            User createdByUser,
            String sourceProvider,
            String sourceId,
            String sourceUrl
    ) {
        this(
                name, description, countryCode, countryName, region, island,
                latitude, longitude, difficulty, averageVisibilityMeters,
                createdByUser
        );
        this.sourceProvider = sourceProvider;
        this.sourceId = sourceId;
        this.sourceUrl = sourceUrl;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public BigDecimal getLatitude() {
        return latitude;
    }

    public BigDecimal getLongitude() {
        return longitude;
    }

    public Difficulty getDifficulty() {
        return difficulty;
    }

    public Integer getAverageVisibilityMeters() {
        return averageVisibilityMeters;
    }

    public String getCountryCode() {
        return countryCode;
    }

    public String getCountryName() {
        return countryName;
    }

    public String getRegion() {
        return region;
    }

    public String getIsland() {
        return island;
    }

    public User getCreatedByUser() {
        return createdByUser;
    }

    public String getSourceProvider() {
        return sourceProvider;
    }

    public String getSourceId() {
        return sourceId;
    }

    public String getSourceUrl() {
        return sourceUrl;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
