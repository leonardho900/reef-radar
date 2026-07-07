package com.reefradar.backend.divesite;

import com.reefradar.backend.user.User;
import com.reefradar.backend.user.UserRepository;
import com.reefradar.backend.sighting.SightingRepository;
import com.reefradar.backend.divelog.DiveLogRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DiveSiteServiceTests {

    @Mock
    private DiveSiteRepository diveSiteRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SightingRepository sightingRepository;

    @Mock
    private DiveLogRepository diveLogRepository;

    @Mock
    private DiveSite diveSite;

    @Mock
    private DiveSite olderDiveSite;

    @Mock
    private User user;

    @InjectMocks
    private DiveSiteService diveSiteService;

    @Test
    void returnsDiveSitesUsingCombinedFilters() {
        Sort nameAscending = Sort.by(Sort.Direction.ASC, "name");
        when(diveSiteRepository.findAll(
                any(Specification.class),
                eq(nameAscending)
        ))
                .thenReturn(List.of(olderDiveSite, diveSite));
        when(diveSite.getName()).thenReturn("Barracuda Point");
        when(diveSite.getId()).thenReturn(8L);
        when(diveSite.getCountryCode()).thenReturn("MY");
        when(diveSite.getCountryName()).thenReturn("Malaysia");
        when(diveSite.getRegion()).thenReturn("Sabah");
        when(diveSite.getIsland()).thenReturn("Sipadan Island");
        when(olderDiveSite.getName()).thenReturn("Apo Reef");
        when(olderDiveSite.getId()).thenReturn(9L);
        when(olderDiveSite.getCountryCode()).thenReturn("MY");
        when(olderDiveSite.getCountryName()).thenReturn("Malaysia");
        when(olderDiveSite.getRegion()).thenReturn("Sabah");
        when(olderDiveSite.getIsland()).thenReturn("Sipadan Island");
        when(sightingRepository.findLastSeenDatesForSpecies(1L))
                .thenReturn(List.of(
                        new DiveSiteLastSeen(
                                8L,
                                LocalDate.of(2026, 6, 28)
                        ),
                        new DiveSiteLastSeen(
                                9L,
                                LocalDate.of(2026, 5, 10)
                        )
                ));
        when(diveLogRepository.countDivesByDiveSite()).thenReturn(List.of(
                new DiveSiteDiveCount(8L, 12L),
                new DiveSiteDiveCount(9L, 20L)
        ));

        List<DiveSiteResponse> result = diveSiteService.getDiveSites(
                " MY ", "Sabah", " ", 1L
        );

        assertEquals(2, result.size());
        assertEquals("Barracuda Point", result.getFirst().name());
        assertEquals("Sipadan Island", result.getFirst().island());
        assertEquals(
                LocalDate.of(2026, 6, 28),
                result.getFirst().lastSeenDate()
        );
        assertEquals(12L, result.getFirst().diveCount());
        verify(diveSiteRepository).findAll(
                any(Specification.class),
                eq(nameAscending)
        );
        verify(sightingRepository).findLastSeenDatesForSpecies(1L);
        verify(diveLogRepository).countDivesByDiveSite();
    }

    @Test
    void sortsDiveSitesByMostDivedWhenSpeciesIsNotFiltered() {
        Sort nameAscending = Sort.by(Sort.Direction.ASC, "name");
        when(diveSiteRepository.findAll(
                any(Specification.class),
                eq(nameAscending)
        )).thenReturn(List.of(olderDiveSite, diveSite));
        when(olderDiveSite.getId()).thenReturn(9L);
        when(olderDiveSite.getName()).thenReturn("Apo Reef");
        when(diveSite.getId()).thenReturn(8L);
        when(diveSite.getName()).thenReturn("Barracuda Point");
        when(diveLogRepository.countDivesByDiveSite()).thenReturn(List.of(
                new DiveSiteDiveCount(8L, 12L),
                new DiveSiteDiveCount(9L, 3L)
        ));

        List<DiveSiteResponse> result = diveSiteService.getDiveSites(
                null, null, null, null
        );

        assertEquals("Barracuda Point", result.getFirst().name());
        assertEquals(12L, result.getFirst().diveCount());
        assertEquals("Apo Reef", result.getLast().name());
    }

    @Test
    void createsDiveSiteForAuthenticatedUser() {
        CreateDiveSiteRequest request = new CreateDiveSiteRequest(
                " Barracuda Point ",
                " Strong currents ",
                "my",
                " Malaysia ",
                " Sabah ",
                " Sipadan Island ",
                new BigDecimal("4.115000"),
                new BigDecimal("118.629000"),
                Difficulty.ADVANCED,
                25
        );
        when(userRepository.findById(7L)).thenReturn(Optional.of(user));
        when(user.getId()).thenReturn(7L);
        when(diveSiteRepository.save(any(DiveSite.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        DiveSiteResponse response = diveSiteService.createDiveSite(request, 7L);

        ArgumentCaptor<DiveSite> captor = ArgumentCaptor.forClass(DiveSite.class);
        verify(diveSiteRepository).save(captor.capture());
        DiveSite saved = captor.getValue();
        assertEquals("Barracuda Point", saved.getName());
        assertEquals("MY", saved.getCountryCode());
        assertEquals("Sipadan Island", saved.getIsland());
        assertSame(user, saved.getCreatedByUser());
        assertEquals(7L, response.createdByUserId());
    }

    @Test
    void throwsWhenDiveSiteDoesNotExist() {
        when(diveSiteRepository.findById(99L)).thenReturn(Optional.empty());

        DiveSiteNotFoundException exception = assertThrows(
                DiveSiteNotFoundException.class,
                () -> diveSiteService.getDiveSite(99L)
        );

        assertEquals("Dive site not found with id: 99", exception.getMessage());
    }
}
