package com.reefradar.backend.divesite;

public class DiveSiteNotFoundException extends RuntimeException {

    public DiveSiteNotFoundException(Long id) {
        super("Dive site not found with id: " + id);
    }
}