package com.reefradar.backend.species;

import com.reefradar.backend.sighting.SightingRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SpeciesService {

    private final SpeciesRepository speciesRepository;
    private final SightingRepository sightingRepository;

    public SpeciesService(
            SpeciesRepository speciesRepository,
            SightingRepository sightingRepository
    ) {
        this.speciesRepository = speciesRepository;
        this.sightingRepository = sightingRepository;
    }

    @Transactional(readOnly = true)
    public List<SpeciesResponse> getSpecies(String query) {
        String normalizedQuery = normalize(query);
        List<Species> species = normalizedQuery == null
                ? speciesRepository.findAll(Sort.by(Sort.Direction.ASC, "commonName"))
                : speciesRepository.search(normalizedQuery);

        return species
                .stream()
                .map(SpeciesResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public SpeciesResponse getSpecies(Long speciesId) {
        return speciesRepository.findById(speciesId)
                .map(SpeciesResponse::from)
                .orElseThrow(() -> new SpeciesNotFoundException(speciesId));
    }

    @Transactional(readOnly = true)
    public List<SpeciesDiveSiteResponse> getReportedDiveSites(Long speciesId) {
        if (!speciesRepository.existsById(speciesId)) {
            throw new SpeciesNotFoundException(speciesId);
        }
        return sightingRepository.findDiveSitesReportedForSpecies(speciesId);
    }

    private String normalize(String query) {
        if (query == null || query.isBlank()) {
            return null;
        }
        return query.trim();
    }
}
