package com.reefradar.backend.divesite;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DiveSiteServiceTests {

    @Mock
    private DiveSiteRepository diveSiteRepository;

    @Mock
    private DiveSite diveSite;

    @InjectMocks
    private DiveSiteService diveSiteService;

    @Test
    void returnsDiveSitesAsResponsesSortedByName() {
        Sort nameAscending = Sort.by(Sort.Direction.ASC, "name");
        when(diveSiteRepository.findAll(nameAscending)).thenReturn(List.of(diveSite));
        when(diveSite.getId()).thenReturn(1L);
        when(diveSite.getName()).thenReturn("Mabul Island");
        when(diveSite.getDescription()).thenReturn("Macro-diving site");
        when(diveSite.getLatitude()).thenReturn(new BigDecimal("4.245000"));
        when(diveSite.getLongitude()).thenReturn(new BigDecimal("118.631000"));
        when(diveSite.getDifficulty()).thenReturn(Difficulty.BEGINNER);
        when(diveSite.getAverageVisibilityMeters()).thenReturn(15);

        List<DiveSiteResponse> result = diveSiteService.getDiveSites();

        assertEquals(1, result.size());
        assertEquals("Mabul Island", result.getFirst().name());
        assertEquals(Difficulty.BEGINNER, result.getFirst().difficulty());
        verify(diveSiteRepository).findAll(nameAscending);
    }

    @Test
    void throwsWhenDiveSiteDoesNotExist() {
        when(diveSiteRepository.findById(99L)).thenReturn(Optional.empty());

        DiveSiteNotFoundException exception = assertThrows(
                DiveSiteNotFoundException.class,
                () -> diveSiteService.getDiveSite(99L)
        );

        assertEquals("Dive site not found with id: 99", exception.getMessage());
        verify(diveSiteRepository).findById(99L);
    }
}
