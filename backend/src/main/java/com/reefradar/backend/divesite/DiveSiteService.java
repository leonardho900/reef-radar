package com.reefradar.backend.divesite;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import com.reefradar.backend.sighting.Sighting;
import com.reefradar.backend.sighting.SightingRepository;
import com.reefradar.backend.divelog.DiveLogRepository;
import com.reefradar.backend.user.User;
import com.reefradar.backend.user.UserNotFoundException;
import com.reefradar.backend.user.UserRepository;

import java.util.Comparator;
import java.util.Map;
import java.util.List;
import java.util.Locale;
import java.util.function.Function;
import java.util.stream.Collectors;

import jakarta.persistence.criteria.Subquery;

@Service
public class DiveSiteService {

    private final DiveSiteRepository diveSiteRepository;
    private final UserRepository userRepository;
    private final SightingRepository sightingRepository;
    private final DiveLogRepository diveLogRepository;

    public DiveSiteService(
            DiveSiteRepository diveSiteRepository,
            UserRepository userRepository,
            SightingRepository sightingRepository,
            DiveLogRepository diveLogRepository
    ) {
        this.diveSiteRepository = diveSiteRepository;
        this.userRepository = userRepository;
        this.sightingRepository = sightingRepository;
        this.diveLogRepository = diveLogRepository;
    }

    @Transactional(readOnly = true)
    public List<DiveSiteResponse> getDiveSites(
            String country,
            String region,
            String island,
            Long speciesId
    ) {
        Specification<DiveSite> filters = buildFilters(
                normalize(country),
                normalize(region),
                normalize(island),
                speciesId
        );

        List<DiveSite> diveSites = diveSiteRepository.findAll(
                        filters,
                        Sort.by(Sort.Direction.ASC, "name")
                );

        Map<Long, Long> diveCountsBySite = diveLogRepository
                .countDivesByDiveSite()
                .stream()
                .collect(Collectors.toMap(
                        DiveSiteDiveCount::diveSiteId,
                        DiveSiteDiveCount::diveCount
                ));

        if (speciesId == null) {
            return diveSites.stream()
                    .map(diveSite -> DiveSiteResponse.from(
                            diveSite,
                            null,
                            diveCountsBySite.getOrDefault(diveSite.getId(), 0L)
                    ))
                    .sorted(Comparator
                            .comparing(
                                    DiveSiteResponse::diveCount,
                                    Comparator.reverseOrder()
                            )
                            .thenComparing(
                                    DiveSiteResponse::name,
                                    String.CASE_INSENSITIVE_ORDER
                            ))
                    .toList();
        }

        Map<Long, DiveSiteLastSeen> lastSeenBySite = sightingRepository
                .findLastSeenDatesForSpecies(speciesId)
                .stream()
                .collect(Collectors.toMap(
                        DiveSiteLastSeen::diveSiteId,
                        Function.identity()
                ));

        return diveSites.stream()
                .map(diveSite -> DiveSiteResponse.from(
                        diveSite,
                        lastSeenBySite.containsKey(diveSite.getId())
                                ? lastSeenBySite.get(diveSite.getId()).lastSeenDate()
                                : null,
                        diveCountsBySite.getOrDefault(diveSite.getId(), 0L)
                ))
                .sorted(Comparator
                        .comparing(
                                DiveSiteResponse::lastSeenDate,
                                Comparator.nullsLast(Comparator.reverseOrder())
                        )
                        .thenComparing(
                                DiveSiteResponse::name,
                                String.CASE_INSENSITIVE_ORDER
                        ))
                .toList();
    }

    @Transactional
    public DiveSiteResponse createDiveSite(
            CreateDiveSiteRequest request,
            Long userId
    ) {
        User creator = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        DiveSite diveSite = new DiveSite(
                request.name().trim(),
                normalizeOptional(request.description()),
                request.countryCode().trim().toUpperCase(Locale.ROOT),
                request.countryName().trim(),
                request.region().trim(),
                normalizeOptional(request.island()),
                request.latitude(),
                request.longitude(),
                request.difficulty(),
                request.averageVisibilityMeters(),
                creator
        );

        return DiveSiteResponse.from(diveSiteRepository.save(diveSite));
    }

    @Transactional(readOnly = true)
    public DiveSiteResponse getDiveSite(Long id) {
        return diveSiteRepository.findById(id)
                .map(DiveSiteResponse::from)
                .orElseThrow(() -> new DiveSiteNotFoundException(id));
    }

    private String normalize(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }

    private String normalizeOptional(String value) {
        return normalize(value);
    }

    private Specification<DiveSite> buildFilters(
            String country,
            String region,
            String island,
            Long speciesId
    ) {
        return (root, query, criteriaBuilder) -> {
            var predicate = criteriaBuilder.conjunction();

            if (country != null) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.equal(
                                criteriaBuilder.upper(root.get("countryCode")),
                                country.toUpperCase(Locale.ROOT)
                        )
                );
            }
            if (region != null) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.equal(
                                criteriaBuilder.lower(root.get("region")),
                                region.toLowerCase(Locale.ROOT)
                        )
                );
            }
            if (island != null) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.equal(
                                criteriaBuilder.lower(root.get("island")),
                                island.toLowerCase(Locale.ROOT)
                        )
                );
            }
            if (speciesId != null) {
                Subquery<Long> sightingExists = query.subquery(Long.class);
                var sighting = sightingExists.from(Sighting.class);
                sightingExists.select(criteriaBuilder.literal(1L));
                sightingExists.where(
                        criteriaBuilder.equal(
                                sighting.get("diveLog").get("diveSite").get("id"),
                                root.get("id")
                        ),
                        criteriaBuilder.equal(
                                sighting.get("species").get("id"),
                                speciesId
                        )
                );
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.exists(sightingExists)
                );
            }

            query.distinct(true);
            return predicate;
        };
    }
}
