package com.reefradar.backend.divelog;

public class DiveLogNotFoundException extends RuntimeException {

    public DiveLogNotFoundException(Long id) {
        super("Dive log not found with id: " + id);
    }
}
