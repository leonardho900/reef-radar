package com.reefradar.backend.sighting;

import java.util.List;

import com.reefradar.backend.divesite.DiveSiteLastSeen;
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
                MAX(diveLog.diveDate)
            )
            FROM Sighting sighting
            JOIN sighting.diveLog diveLog
            JOIN diveLog.diveSite diveSite
            WHERE sighting.species.id = :speciesId
            GROUP BY diveSite.id, diveSite.name, diveSite.countryCode,
                     diveSite.countryName, diveSite.region, diveSite.island
            ORDER BY MAX(diveLog.diveDate) DESC, COUNT(sighting.id) DESC
            """)
    List<SpeciesDiveSiteResponse> findDiveSitesReportedForSpecies(
            @Param("speciesId") Long speciesId
    );

    @Query("""
            SELECT new com.reefradar.backend.divesite.DiveSiteLastSeen(
                diveLog.diveSite.id,
                MAX(diveLog.diveDate)
            )
            FROM Sighting sighting
            JOIN sighting.diveLog diveLog
            WHERE sighting.species.id = :speciesId
            GROUP BY diveLog.diveSite.id
            """)
    List<DiveSiteLastSeen> findLastSeenDatesForSpecies(
            @Param("speciesId") Long speciesId
    );
}
