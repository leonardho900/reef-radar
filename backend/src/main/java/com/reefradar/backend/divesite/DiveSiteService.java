package com.reefradar.backend.divesite;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DiveSiteService {

    private final DiveSiteRepository diveSiteRepository;

    public DiveSiteService(DiveSiteRepository diveSiteRepository) {
        this.diveSiteRepository = diveSiteRepository;
    }

    @Transactional(readOnly = true)
    public List<DiveSiteResponse> getDiveSites() {
        return diveSiteRepository.findAll(Sort.by(Sort.Direction.ASC, "name"))
                .stream()
                .map(DiveSiteResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public DiveSiteResponse getDiveSite(Long id) {
        return diveSiteRepository.findById(id)
                .map(DiveSiteResponse::from)
                .orElseThrow(() -> new DiveSiteNotFoundException(id));
    }
}
