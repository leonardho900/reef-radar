package com.reefradar.backend.divelog;

import java.util.List;

import com.reefradar.backend.divesite.DiveSiteDiveCount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DiveLogRepository extends JpaRepository<DiveLog, Long> {

    List<DiveLog> findByUserIdOrderByDiveDateDescCreatedAtDesc(
            Long userId
    );

    @Query("""
            SELECT new com.reefradar.backend.divesite.DiveSiteDiveCount(
                diveLog.diveSite.id,
                COUNT(diveLog.id)
            )
            FROM DiveLog diveLog
            GROUP BY diveLog.diveSite.id
            """)
    List<DiveSiteDiveCount> countDivesByDiveSite();
}
