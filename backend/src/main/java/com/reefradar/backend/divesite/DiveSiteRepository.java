package com.reefradar.backend.divesite;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface DiveSiteRepository extends
        JpaRepository<DiveSite, Long>,
        JpaSpecificationExecutor<DiveSite> {

    boolean existsBySourceProviderAndSourceId(
            String sourceProvider,
            String sourceId
    );
}
