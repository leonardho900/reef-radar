package com.reefradar.backend.sighting;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SightingRepository extends JpaRepository<Sighting, Long> {

    List<Sighting> findByDiveLogDiveSiteIdOrderByDiveLogDiveDateDescCreatedAtDesc(
            Long diveSiteId
    );
}