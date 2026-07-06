package com.reefradar.backend.species;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SpeciesServiceTests {

    @Mock
    private SpeciesRepository speciesRepository;

    @Mock
    private Species species;

    @InjectMocks
    private SpeciesService speciesService;

    @Test
    void returnsSpeciesAsResponsesSortedByCommonName() {
        Sort commonNameAscending = Sort.by(Sort.Direction.ASC, "commonName");
        when(speciesRepository.findAll(commonNameAscending)).thenReturn(List.of(species));
        when(species.getId()).thenReturn(1L);
        when(species.getCommonName()).thenReturn("Green Sea Turtle");
        when(species.getScientificName()).thenReturn("Chelonia mydas");
        when(species.getCategory()).thenReturn(SpeciesCategory.TURTLE);
        when(species.getDescription()).thenReturn("Commonly observed around tropical reefs.");

        List<SpeciesResponse> result = speciesService.getSpecies();

        assertEquals(1, result.size());
        assertEquals("Green Sea Turtle", result.getFirst().commonName());
        assertEquals(SpeciesCategory.TURTLE, result.getFirst().category());
        verify(speciesRepository).findAll(commonNameAscending);
    }
}
