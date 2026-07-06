package com.reefradar.backend.divelog;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dive-logs")
public class DiveLogController {

    private final DiveLogService diveLogService;

    public DiveLogController(DiveLogService diveLogService) {
        this.diveLogService = diveLogService;
    }

    @PostMapping
    public ResponseEntity<DiveLogResponse> createDiveLog(
            @Valid @RequestBody CreateDiveLogRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        Long userId = Long.valueOf(jwt.getSubject());

        DiveLogResponse response = diveLogService.createDiveLog(
                request,
                userId);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
}