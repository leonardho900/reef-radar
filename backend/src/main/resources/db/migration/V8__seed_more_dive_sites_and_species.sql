INSERT INTO dive_sites (
    name,
    description,
    country_code,
    country_name,
    region,
    island,
    latitude,
    longitude,
    difficulty,
    average_visibility_meters
)
SELECT
    seed.name,
    seed.description,
    seed.country_code,
    seed.country_name,
    seed.region,
    seed.island,
    seed.latitude,
    seed.longitude,
    seed.difficulty,
    seed.average_visibility_meters
FROM (VALUES
    (
        'Barracuda Point',
        'A current-swept wall dive known for schooling barracuda, turtles and reef sharks.',
        'MY', 'Malaysia', 'Sabah', 'Sipadan Island',
        4.114900, 118.628300, 'ADVANCED', 30
    ),
    (
        'Turtle Cavern',
        'A dramatic cavern entrance and wall where turtles are frequently reported by divers.',
        'MY', 'Malaysia', 'Sabah', 'Sipadan Island',
        4.113900, 118.627700, 'ADVANCED', 25
    ),
    (
        'Mabul House Reef',
        'A shallow macro-diving site with sandy slopes, artificial structures and small reef life.',
        'MY', 'Malaysia', 'Sabah', 'Mabul Island',
        4.245300, 118.630700, 'BEGINNER', 15
    ),
    (
        'Kapalai House Reef',
        'A relaxed macro site around sandy flats and structures, suitable for long observation dives.',
        'MY', 'Malaysia', 'Sabah', 'Kapalai',
        4.186900, 118.576900, 'BEGINNER', 18
    ),
    (
        'USAT Liberty Wreck',
        'A shore-accessible wreck covered with marine growth and visited by a wide variety of reef species.',
        'ID', 'Indonesia', 'Bali', 'Bali',
        -8.274100, 115.593000, 'INTERMEDIATE', 20
    ),
    (
        'Monad Shoal',
        'A submerged shoal where thresher sharks have been reported around early-morning cleaning stations.',
        'PH', 'Philippines', 'Central Visayas', 'Malapascua Island',
        11.330000, 124.209000, 'ADVANCED', 20
    ),
    (
        'Richelieu Rock',
        'A remote limestone pinnacle with colorful soft corals, schooling fish and seasonal pelagic sightings.',
        'TH', 'Thailand', 'Phang Nga', NULL,
        9.361700, 98.021700, 'ADVANCED', 25
    ),
    (
        'Blue Corner',
        'A current-exposed reef corner known for strong drift conditions and reported shark activity.',
        'PW', 'Palau', 'Koror', 'Ngemelis Island',
        7.135000, 134.221000, 'ADVANCED', 35
    )
) AS seed(
    name,
    description,
    country_code,
    country_name,
    region,
    island,
    latitude,
    longitude,
    difficulty,
    average_visibility_meters
)
WHERE NOT EXISTS (
    SELECT 1
    FROM dive_sites existing
    WHERE LOWER(existing.name) = LOWER(seed.name)
      AND existing.country_code = seed.country_code
);

INSERT INTO species (
    common_name,
    scientific_name,
    category,
    description
)
VALUES
    (
        'Whale Shark',
        'Rhincodon typus',
        'SHARK',
        'A large filter-feeding shark reported in tropical and warm-temperate waters.'
    ),
    (
        'Whitetip Reef Shark',
        'Triaenodon obesus',
        'SHARK',
        'A reef-associated shark often reported resting in caves or beneath coral ledges.'
    ),
    (
        'Blacktip Reef Shark',
        'Carcharhinus melanopterus',
        'SHARK',
        'A shallow-water reef shark recognizable by the dark tips on its fins.'
    ),
    (
        'Hawksbill Sea Turtle',
        'Eretmochelys imbricata',
        'TURTLE',
        'A reef-associated sea turtle with a narrow beak and overlapping shell plates.'
    ),
    (
        'Pygmy Seahorse',
        'Hippocampus bargibanti',
        'FISH',
        'A tiny, highly camouflaged seahorse associated with particular sea fans.'
    ),
    (
        'Mandarinfish',
        'Synchiropus splendidus',
        'FISH',
        'A small, brightly patterned reef fish often reported around branching coral at dusk.'
    ),
    (
        'Clown Frogfish',
        'Antennarius maculatus',
        'FISH',
        'A camouflaged ambush predator popular with macro photographers.'
    ),
    (
        'Peacock Mantis Shrimp',
        'Odontodactylus scyllarus',
        'CRUSTACEAN',
        'A colorful stomatopod commonly found in burrows on tropical reefs.'
    ),
    (
        'Blue-ringed Octopus',
        'Hapalochlaena lunulata',
        'MOLLUSK',
        'A small, venomous octopus whose blue rings become vivid when it is disturbed.'
    ),
    (
        'Giant Clam',
        'Tridacna gigas',
        'MOLLUSK',
        'A very large reef-dwelling bivalve with colorful photosynthetic mantle tissue.'
    ),
    (
        'Willan''s Chromodoris',
        'Chromodoris willani',
        'MOLLUSK',
        'A nudibranch recognized by dark longitudinal lines and pale spots on its gills and rhinophores.'
    ),
    (
        'Broadclub Cuttlefish',
        'Sepia latimanus',
        'MOLLUSK',
        'A large reef cuttlefish capable of rapidly changing color and skin pattern.'
    )
ON CONFLICT (scientific_name) DO NOTHING;
