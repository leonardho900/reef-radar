package com.reefradar.backend.sighting;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dive-sites/{diveSiteId}/sightings")
public class DiveSiteSightingController {

    private final SightingService sightingService;

    public DiveSiteSightingController(SightingService sightingService) {
        this.sightingService = sightingService;
    }

    @GetMapping
    public List<SightingResponse> getSightings(
            @PathVariable Long diveSiteId
    ) {
        return sightingService.getSightingsByDiveSite(diveSiteId);
    }
}