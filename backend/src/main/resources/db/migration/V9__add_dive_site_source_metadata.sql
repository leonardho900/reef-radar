ALTER TABLE dive_sites
    ADD COLUMN source_provider VARCHAR(40),
    ADD COLUMN source_id VARCHAR(120),
    ADD COLUMN source_url VARCHAR(500);

CREATE UNIQUE INDEX uq_dive_sites_source
    ON dive_sites(source_provider, source_id)
    WHERE source_provider IS NOT NULL
      AND source_id IS NOT NULL;

CREATE INDEX idx_dive_sites_source_provider
    ON dive_sites(source_provider);
