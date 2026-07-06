package com.reefradar.backend.species;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SpeciesService {

    private final SpeciesRepository speciesRepository;

    public SpeciesService(SpeciesRepository speciesRepository) {
        this.speciesRepository = speciesRepository;
    }

    @Transactional(readOnly = true)
    public List<SpeciesResponse> getSpecies() {
        return speciesRepository.findAll(Sort.by(Sort.Direction.ASC, "commonName"))
                .stream()
                .map(SpeciesResponse::from)
                .toList();
    }
}
