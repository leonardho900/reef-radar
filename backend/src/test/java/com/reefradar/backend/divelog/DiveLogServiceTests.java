package com.reefradar.backend.divelog;

import com.reefradar.backend.divesite.DiveSite;
import com.reefradar.backend.divesite.DiveSiteNotFoundException;
import com.reefradar.backend.divesite.DiveSiteRepository;
import com.reefradar.backend.user.User;
import com.reefradar.backend.user.UserNotFoundException;
import com.reefradar.backend.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DiveLogServiceTests {

    @Mock
    private DiveLogRepository diveLogRepository;

    @Mock
    private DiveSiteRepository diveSiteRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private DiveSite diveSite;

    @Mock
    private User user;

    @InjectMocks
    private DiveLogService diveLogService;

    @Test
    void createsDiveLogForExistingDiveSite() {
        CreateDiveLogRequest request = new CreateDiveLogRequest(
                1L,
                LocalDate.of(2026, 7, 5),
                new BigDecimal("24.50"),
                48,
                new BigDecimal("28.0"),
                20,
                "Saw several turtles"
        );
        when(userRepository.findById(7L)).thenReturn(Optional.of(user));
        when(diveSiteRepository.findById(1L)).thenReturn(Optional.of(diveSite));
        when(diveLogRepository.save(any(DiveLog.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        DiveLogResponse response = diveLogService.createDiveLog(request, 7L);

        ArgumentCaptor<DiveLog> captor = ArgumentCaptor.forClass(DiveLog.class);
        verify(diveLogRepository).save(captor.capture());
        DiveLog savedDiveLog = captor.getValue();
        assertSame(user, savedDiveLog.getUser());
        assertSame(diveSite, savedDiveLog.getDiveSite());
        assertEquals(request.diveDate(), savedDiveLog.getDiveDate());
        assertEquals(request.maxDepthMeters(), response.maxDepthMeters());
        assertEquals(request.durationMinutes(), response.durationMinutes());
        assertEquals(request.notes(), response.notes());
    }

    @Test
    void rejectsDiveLogWhenDiveSiteDoesNotExist() {
        CreateDiveLogRequest request = new CreateDiveLogRequest(
                99L,
                LocalDate.of(2026, 7, 5),
                new BigDecimal("12.00"),
                30,
                null,
                null,
                null
        );
        when(userRepository.findById(7L)).thenReturn(Optional.of(user));
        when(diveSiteRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(
                DiveSiteNotFoundException.class,
                () -> diveLogService.createDiveLog(request, 7L)
        );
        verify(diveLogRepository, never()).save(any());
    }

    @Test
    void rejectsDiveLogWhenUserDoesNotExist() {
        CreateDiveLogRequest request = new CreateDiveLogRequest(
                1L,
                LocalDate.of(2026, 7, 5),
                new BigDecimal("12.00"),
                30,
                null,
                null,
                null
        );
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(
                UserNotFoundException.class,
                () -> diveLogService.createDiveLog(request, 99L)
        );
        verify(diveSiteRepository, never()).findById(any());
        verify(diveLogRepository, never()).save(any());
    }
}
