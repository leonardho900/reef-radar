package com.reefradar.backend.sighting;

import java.util.List;

import com.reefradar.backend.species.SpeciesDiveSiteResponse;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SightingRepository extends JpaRepository<Sighting, Long> {

    List<Sighting> findByDiveLogDiveSiteIdOrderByDiveLogDiveDateDescCreatedAtDesc(
            Long diveSiteId
    );

    @Query("""
            SELECT new com.reefradar.backend.species.SpeciesDiveSiteResponse(
                diveSite.id,
                diveSite.name,
                diveSite.countryCode,
                diveSite.countryName,
                diveSite.region,
                diveSite.island,
                COUNT(sighting.id),
                MAX(sighting.createdAt)
            )
            FROM Sighting sighting
            JOIN sighting.diveLog diveLog
            JOIN diveLog.diveSite diveSite
            WHERE sighting.species.id = :speciesId
            GROUP BY diveSite.id, diveSite.name, diveSite.countryCode,
                     diveSite.countryName, diveSite.region, diveSite.island
            ORDER BY MAX(sighting.createdAt) DESC, COUNT(sighting.id) DESC
            """)
    List<SpeciesDiveSiteResponse> findDiveSitesReportedForSpecies(
            @Param("speciesId") Long speciesId
    );
}
