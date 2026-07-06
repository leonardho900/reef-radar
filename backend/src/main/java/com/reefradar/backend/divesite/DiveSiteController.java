package com.reefradar.backend.divesite;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
    public List<DiveSiteResponse> getDiveSites(
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) String island,
            @RequestParam(required = false) Long speciesId
    ) {
        return diveSiteService.getDiveSites(country, region, island, speciesId);
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DiveSiteResponse> createDiveSite(
            @Valid @RequestBody CreateDiveSiteRequest request,
            @AuthenticationPrincipal Jwt jwt
    ) {
        Long userId = Long.valueOf(jwt.getSubject());
        DiveSiteResponse response = diveSiteService.createDiveSite(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public DiveSiteResponse getDiveSite(@PathVariable Long id) {
        return diveSiteService.getDiveSite(id);
    }
}
