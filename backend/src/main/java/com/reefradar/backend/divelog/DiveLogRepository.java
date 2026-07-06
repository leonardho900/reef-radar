package com.reefradar.backend.divelog;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DiveLogRepository extends JpaRepository<DiveLog, Long> {

    List<DiveLog> findByUserIdOrderByDiveDateDescCreatedAtDesc(
            Long userId
    );
}