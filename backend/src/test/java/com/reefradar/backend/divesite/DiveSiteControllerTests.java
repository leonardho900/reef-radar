package com.reefradar.backend.divesite;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DiveSiteControllerTests {

    @Mock
    private DiveSiteService diveSiteService;

    @InjectMocks
    private DiveSiteController controller;

    @Test
    void passesCombinedFiltersToService() {
        when(diveSiteService.getDiveSites("MY", "Sabah", null, 1L))
                .thenReturn(List.of());

        List<DiveSiteResponse> response = controller.getDiveSites(
                "MY", "Sabah", null, 1L
        );

        assertEquals(List.of(), response);
        verify(diveSiteService).getDiveSites("MY", "Sabah", null, 1L);
    }

    @Test
    void obtainsCreatorIdFromJwt() {
        CreateDiveSiteRequest request = new CreateDiveSiteRequest(
                "Barracuda Point", null, "MY", "Malaysia", "Sabah",
                "Sipadan Island", new BigDecimal("4.115"),
                new BigDecimal("118.629"), Difficulty.ADVANCED, 25
        );
        DiveSiteResponse created = new DiveSiteResponse(
                3L, "Barracuda Point", null,
                new BigDecimal("4.115"), new BigDecimal("118.629"),
                Difficulty.ADVANCED, 25, "MY", "Malaysia", "Sabah",
                "Sipadan Island", 7L, null, null, null, 0L
        );
        Jwt jwt = Jwt.withTokenValue("token")
                .header("alg", "HS256")
                .subject("7")
                .build();
        when(diveSiteService.createDiveSite(request, 7L)).thenReturn(created);

        ResponseEntity<DiveSiteResponse> response = controller.createDiveSite(request, jwt);

        assertEquals(201, response.getStatusCode().value());
        assertEquals(created, response.getBody());
        verify(diveSiteService).createDiveSite(request, 7L);
    }
}
