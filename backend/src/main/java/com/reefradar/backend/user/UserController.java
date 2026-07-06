package com.reefradar.backend.user;

import java.util.List;

import com.reefradar.backend.divelog.DiveLogResponse;
import com.reefradar.backend.divelog.DiveLogService;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final DiveLogService diveLogService;

    public UserController(
            UserService userService,
            DiveLogService diveLogService
    ) {
        this.userService = userService;
        this.diveLogService = diveLogService;
    }

    @GetMapping("/me")
    public UserResponse getCurrentUser(
            @AuthenticationPrincipal Jwt jwt
    ) {
        Long userId = Long.valueOf(jwt.getSubject());

        return userService.getUser(userId);
    }

    @GetMapping("/me/dive-logs")
    public List<DiveLogResponse> getCurrentUserDiveLogs(
            @AuthenticationPrincipal Jwt jwt
    ) {
        Long userId = Long.valueOf(jwt.getSubject());

        return diveLogService.getDiveLogsForUser(userId);
    }
}