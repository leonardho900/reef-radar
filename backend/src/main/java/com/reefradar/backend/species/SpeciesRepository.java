package com.reefradar.backend.species;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SpeciesRepository extends JpaRepository<Species, Long> {

    @Query("""
            SELECT species
            FROM Species species
            WHERE LOWER(species.commonName) LIKE LOWER(CONCAT('%', :query, '%'))
               OR LOWER(species.scientificName) LIKE LOWER(CONCAT('%', :query, '%'))
            ORDER BY species.commonName ASC
            """)
    List<Species> search(@Param("query") String query);
}
