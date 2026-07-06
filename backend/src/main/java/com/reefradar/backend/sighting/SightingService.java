package com.reefradar.backend.sighting;

import java.util.List;

import com.reefradar.backend.divelog.DiveLog;
import com.reefradar.backend.divelog.DiveLogNotFoundException;
import com.reefradar.backend.divelog.DiveLogRepository;
import com.reefradar.backend.divesite.DiveSiteNotFoundException;
import com.reefradar.backend.divesite.DiveSiteRepository;
import com.reefradar.backend.species.Species;
import com.reefradar.backend.species.SpeciesNotFoundException;
import com.reefradar.backend.species.SpeciesRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SightingService {

    private final SightingRepository sightingRepository;
    private final DiveLogRepository diveLogRepository;
    private final SpeciesRepository speciesRepository;
    private final DiveSiteRepository diveSiteRepository;

    public SightingService(
            SightingRepository sightingRepository,
            DiveLogRepository diveLogRepository,
            SpeciesRepository speciesRepository,
            DiveSiteRepository diveSiteRepository) {
        this.sightingRepository = sightingRepository;
        this.diveLogRepository = diveLogRepository;
        this.speciesRepository = speciesRepository;
        this.diveSiteRepository = diveSiteRepository;
    }

    @Transactional
    public SightingResponse createSighting(CreateSightingRequest request) {
        DiveLog diveLog = diveLogRepository.findById(request.diveLogId())
                .orElseThrow(() ->
                        new DiveLogNotFoundException(request.diveLogId())
                );

        Species species = speciesRepository.findById(request.speciesId())
                .orElseThrow(() ->
                        new SpeciesNotFoundException(request.speciesId())
                );

        Sighting sighting = new Sighting(
                diveLog,
                species,
                request.quantity(),
                request.notes()
        );

        return SightingResponse.from(sightingRepository.save(sighting));
    }

    @Transactional(readOnly = true)
    public List<SightingResponse> getSightingsByDiveSite(Long diveSiteId) {
        if (!diveSiteRepository.existsById(diveSiteId)) {
            throw new DiveSiteNotFoundException(diveSiteId);
        }

        return sightingRepository
                .findByDiveLogDiveSiteIdOrderByDiveLogDiveDateDescCreatedAtDesc(
                        diveSiteId
                )
                .stream()
                .map(SightingResponse::from)
                .toList();
    }
}