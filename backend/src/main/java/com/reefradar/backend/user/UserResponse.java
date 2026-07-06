package com.reefradar.backend.user;

import java.time.Instant;

public record UserResponse(
        Long id,
        String email,
        String displayName,
        String bio,
        Instant createdAt
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getDisplayName(),
                user.getBio(),
                user.getCreatedAt()
        );
    }
}