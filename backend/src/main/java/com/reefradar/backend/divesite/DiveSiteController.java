package com.reefradar.backend.divesite;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dive-sites")
public class DiveSiteController {

    private final DiveSiteService diveSiteService;

    public DiveSiteController(DiveSiteService diveSiteService) {
        this.diveSiteService = diveSiteService;
    }

    @GetMapping
    public List<DiveSiteResponse> getDiveSites() {
        return diveSiteService.getDiveSites();
    }

    @GetMapping("/{id}")
    public DiveSiteResponse getDiveSite(@PathVariable Long id) {
        return diveSiteService.getDiveSite(id);
    }
}
