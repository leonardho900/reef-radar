package com.reefradar.backend.auth;

import com.reefradar.backend.user.UserResponse;

public record AuthResponse(
        String accessToken,
        String tokenType,
        long expiresInSeconds,
        UserResponse user
) {
}