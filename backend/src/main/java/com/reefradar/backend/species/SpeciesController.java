package com.reefradar.backend.species;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/species")
public class SpeciesController {

    private final SpeciesService speciesService;

    public SpeciesController(SpeciesService speciesService) {
        this.speciesService = speciesService;
    }

    @GetMapping
    public List<SpeciesResponse> getSpecies(
            @RequestParam(name = "q", required = false) String query
    ) {
        return speciesService.getSpecies(query);
    }

    @GetMapping("/{speciesId}")
    public SpeciesResponse getSpecies(@PathVariable Long speciesId) {
        return speciesService.getSpecies(speciesId);
    }

    @GetMapping("/{speciesId}/dive-sites")
    public List<SpeciesDiveSiteResponse> getReportedDiveSites(
            @PathVariable Long speciesId
    ) {
        return speciesService.getReportedDiveSites(speciesId);
    }
}
