package com.reefradar.backend.sighting;

import com.reefradar.backend.divelog.DiveLog;
import com.reefradar.backend.divelog.DiveLogNotFoundException;
import com.reefradar.backend.divelog.DiveLogRepository;
import com.reefradar.backend.species.Species;
import com.reefradar.backend.species.SpeciesNotFoundException;
import com.reefradar.backend.species.SpeciesRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SightingServiceTests {

    @Mock
    private SightingRepository sightingRepository;

    @Mock
    private DiveLogRepository diveLogRepository;

    @Mock
    private SpeciesRepository speciesRepository;

    @Mock
    private DiveLog diveLog;

    @Mock
    private Species species;

    @InjectMocks
    private SightingService sightingService;

    @Test
    void createsSightingWhenRelatedResourcesExist() {
        CreateSightingRequest request = new CreateSightingRequest(10L, 2L, 3, "Near the reef wall");
        when(diveLogRepository.findById(10L)).thenReturn(Optional.of(diveLog));
        when(speciesRepository.findById(2L)).thenReturn(Optional.of(species));
        when(sightingRepository.save(any(Sighting.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        SightingResponse response = sightingService.createSighting(request);

        assertEquals(3, response.quantity());
        assertEquals("Near the reef wall", response.notes());
        verify(sightingRepository).save(any(Sighting.class));
    }

    @Test
    void rejectsSightingWhenDiveLogDoesNotExist() {
        CreateSightingRequest request = new CreateSightingRequest(99L, 2L, 1, null);
        when(diveLogRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(DiveLogNotFoundException.class, () -> sightingService.createSighting(request));
        verify(speciesRepository, never()).findById(any());
        verify(sightingRepository, never()).save(any());
    }

    @Test
    void rejectsSightingWhenSpeciesDoesNotExist() {
        CreateSightingRequest request = new CreateSightingRequest(10L, 99L, 1, null);
        when(diveLogRepository.findById(10L)).thenReturn(Optional.of(diveLog));
        when(speciesRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(SpeciesNotFoundException.class, () -> sightingService.createSighting(request));
        verify(sightingRepository, never()).save(any());
    }
}
