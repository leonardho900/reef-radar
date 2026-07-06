package com.reefradar.backend.species;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SpeciesControllerTests {

    @Mock
    private SpeciesService speciesService;

    @InjectMocks
    private SpeciesController controller;

    @Test
    void passesSearchQueryToService() {
        when(speciesService.getSpecies("manta")).thenReturn(List.of());

        assertEquals(List.of(), controller.getSpecies("manta"));
        verify(speciesService).getSpecies("manta");
    }

    @Test
    void returnsReportedDiveSites() {
        when(speciesService.getReportedDiveSites(2L)).thenReturn(List.of());

        assertEquals(List.of(), controller.getReportedDiveSites(2L));
        verify(speciesService).getReportedDiveSites(2L);
    }
}
