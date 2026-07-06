package com.reefradar.backend.sighting;

import java.time.Instant;

import com.reefradar.backend.divelog.DiveLog;
import com.reefradar.backend.species.Species;

import jakarta.persistence.*;

@Entity
@Table(name = "sightings")
public class Sighting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "dive_log_id", nullable = false)
    private DiveLog diveLog;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "species_id", nullable = false)
    private Species species;

    @Column(nullable = false)
    private Integer quantity;

    private String notes;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected Sighting() {
    }

    public Sighting(
            DiveLog diveLog,
            Species species,
            Integer quantity,
            String notes) {
        this.diveLog = diveLog;
        this.species = species;
        this.quantity = quantity;
        this.notes = notes;
        this.createdAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public DiveLog getDiveLog() {
        return diveLog;
    }

    public Species getSpecies() {
        return species;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public String getNotes() {
        return notes;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}