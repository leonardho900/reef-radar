package com.reefradar.backend.divesite;

import com.reefradar.backend.user.User;
import com.reefradar.backend.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
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
    private DiveSite diveSite;

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
                .thenReturn(List.of(diveSite));
        when(diveSite.getName()).thenReturn("Barracuda Point");
        when(diveSite.getCountryCode()).thenReturn("MY");
        when(diveSite.getCountryName()).thenReturn("Malaysia");
        when(diveSite.getRegion()).thenReturn("Sabah");
        when(diveSite.getIsland()).thenReturn("Sipadan Island");

        List<DiveSiteResponse> result = diveSiteService.getDiveSites(
                " MY ", "Sabah", " ", 1L
        );

        assertEquals(1, result.size());
        assertEquals("Barracuda Point", result.getFirst().name());
        assertEquals("Sipadan Island", result.getFirst().island());
        verify(diveSiteRepository).findAll(
                any(Specification.class),
                eq(nameAscending)
        );
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
