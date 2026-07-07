package com.reefradar.backend.species;

import com.reefradar.backend.sighting.SightingRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SpeciesServiceTests {

    @Mock
    private SpeciesRepository speciesRepository;

    @Mock
    private SightingRepository sightingRepository;

    @Mock
    private Species species;

    @InjectMocks
    private SpeciesService speciesService;

    @Test
    void searchesByNormalizedName() {
        when(speciesRepository.search("turtle")).thenReturn(List.of(species));
        when(species.getCommonName()).thenReturn("Green Sea Turtle");
        when(species.getScientificName()).thenReturn("Chelonia mydas");
        when(species.getCategory()).thenReturn(SpeciesCategory.TURTLE);

        List<SpeciesResponse> result = speciesService.getSpecies(" turtle ");

        assertEquals(1, result.size());
        assertEquals("Green Sea Turtle", result.getFirst().commonName());
        verify(speciesRepository).search("turtle");
    }

    @Test
    void listsAllSpeciesWithoutBindingANullSearchParameter() {
        Sort commonNameAscending = Sort.by(Sort.Direction.ASC, "commonName");
        when(speciesRepository.findAll(commonNameAscending)).thenReturn(List.of(species));
        when(species.getCommonName()).thenReturn("Green Sea Turtle");
        when(species.getScientificName()).thenReturn("Chelonia mydas");
        when(species.getCategory()).thenReturn(SpeciesCategory.TURTLE);

        List<SpeciesResponse> result = speciesService.getSpecies((String) null);

        assertEquals(1, result.size());
        verify(speciesRepository).findAll(commonNameAscending);
    }

    @Test
    void returnsReportedDiveSitesFromAggregateQuery() {
        SpeciesDiveSiteResponse site = new SpeciesDiveSiteResponse(
                1L, "Sipadan Island", "MY", "Malaysia", "Sabah",
                "Sipadan Island", 4L, LocalDate.of(2026, 7, 1)
        );
        when(speciesRepository.existsById(1L)).thenReturn(true);
        when(sightingRepository.findDiveSitesReportedForSpecies(1L))
                .thenReturn(List.of(site));

        List<SpeciesDiveSiteResponse> result = speciesService.getReportedDiveSites(1L);

        assertEquals(site, result.getFirst());
        verify(sightingRepository).findDiveSitesReportedForSpecies(1L);
    }

    @Test
    void rejectsUnknownSpeciesForReportedSites() {
        when(speciesRepository.existsById(99L)).thenReturn(false);

        assertThrows(
                SpeciesNotFoundException.class,
                () -> speciesService.getReportedDiveSites(99L)
        );
    }
}
