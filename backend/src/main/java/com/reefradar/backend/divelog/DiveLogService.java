package com.reefradar.backend.divelog;

import java.util.List;

import com.reefradar.backend.divesite.DiveSite;
import com.reefradar.backend.divesite.DiveSiteNotFoundException;
import com.reefradar.backend.divesite.DiveSiteRepository;
import com.reefradar.backend.user.User;
import com.reefradar.backend.user.UserNotFoundException;
import com.reefradar.backend.user.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DiveLogService {

    private final DiveLogRepository diveLogRepository;
    private final DiveSiteRepository diveSiteRepository;
    private final UserRepository userRepository;

    public DiveLogService(
            DiveLogRepository diveLogRepository,
            DiveSiteRepository diveSiteRepository,
            UserRepository userRepository
    ) {
        this.diveLogRepository = diveLogRepository;
        this.diveSiteRepository = diveSiteRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public DiveLogResponse createDiveLog(
            CreateDiveLogRequest request,
            Long userId
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new UserNotFoundException(userId)
                );

        DiveSite diveSite = diveSiteRepository
                .findById(request.diveSiteId())
                .orElseThrow(() ->
                        new DiveSiteNotFoundException(request.diveSiteId())
                );

        DiveLog diveLog = new DiveLog(
                user,
                diveSite,
                request.diveDate(),
                request.maxDepthMeters(),
                request.durationMinutes(),
                request.waterTemperatureCelsius(),
                request.visibilityMeters(),
                request.notes()
        );

        DiveLog savedDiveLog = diveLogRepository.save(diveLog);

        return DiveLogResponse.from(savedDiveLog);
    }

    @Transactional(readOnly = true)
    public List<DiveLogResponse> getDiveLogsForUser(Long userId) {
        return diveLogRepository
                .findByUserIdOrderByDiveDateDescCreatedAtDesc(userId)
                .stream()
                .map(DiveLogResponse::from)
                .toList();
    }
}