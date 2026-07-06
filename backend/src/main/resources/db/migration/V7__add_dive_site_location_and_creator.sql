ALTER TABLE dive_sites
    ADD COLUMN country_code VARCHAR(2),
    ADD COLUMN country_name VARCHAR(100),
    ADD COLUMN region VARCHAR(120),
    ADD COLUMN island VARCHAR(120),
    ADD COLUMN created_by_user_id BIGINT;

UPDATE dive_sites
SET country_code = 'MY',
    country_name = 'Malaysia',
    region = 'Sabah',
    island = 'Sipadan Island'
WHERE name = 'Sipadan Island';

UPDATE dive_sites
SET country_code = 'MY',
    country_name = 'Malaysia',
    region = 'Sabah',
    island = 'Mabul Island'
WHERE name = 'Mabul Island';

-- Preserve any manually-added pre-V7 rows whose location is unknown.
UPDATE dive_sites
SET country_code = COALESCE(country_code, 'ZZ'),
    country_name = COALESCE(country_name, 'Unknown'),
    region = COALESCE(region, 'Unknown')
WHERE country_code IS NULL
   OR country_name IS NULL
   OR region IS NULL;

ALTER TABLE dive_sites
    ALTER COLUMN country_code SET NOT NULL,
    ALTER COLUMN country_name SET NOT NULL,
    ALTER COLUMN region SET NOT NULL,
    ADD CONSTRAINT chk_dive_sites_country_code
        CHECK (country_code ~ '^[A-Z]{2}$'),
    ADD CONSTRAINT fk_dive_sites_created_by_user
        FOREIGN KEY (created_by_user_id)
        REFERENCES users(id)
        ON DELETE SET NULL;

CREATE INDEX idx_dive_sites_country_code
    ON dive_sites(country_code);

CREATE INDEX idx_dive_sites_region
    ON dive_sites(region);

CREATE INDEX idx_dive_sites_island
    ON dive_sites(island);

CREATE INDEX idx_dive_sites_created_by_user
    ON dive_sites(created_by_user_id);
