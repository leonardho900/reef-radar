ALTER TABLE dive_logs
    ADD COLUMN user_id BIGINT;

ALTER TABLE dive_logs
    ADD CONSTRAINT fk_dive_logs_user
    FOREIGN KEY (user_id)
    REFERENCES users(id);

CREATE INDEX idx_dive_logs_user
    ON dive_logs(user_id);