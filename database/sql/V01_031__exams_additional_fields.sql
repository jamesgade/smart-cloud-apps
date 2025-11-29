-- Add more detailed fields to common.exams

ALTER TABLE common.exams
  ADD COLUMN IF NOT EXISTS application_start_date date NULL,
  ADD COLUMN IF NOT EXISTS application_end_date date NULL,
  ADD COLUMN IF NOT EXISTS registration_url varchar(500) NULL,
  ADD COLUMN IF NOT EXISTS official_website varchar(500) NULL,
  ADD COLUMN IF NOT EXISTS eligibility text NULL,
  ADD COLUMN IF NOT EXISTS exam_mode varchar(50) NULL, -- ONLINE/OFFLINE/HYBRID
  ADD COLUMN IF NOT EXISTS exam_level varchar(50) NULL, -- NATIONAL/STATE/INSTITUTE
  ADD COLUMN IF NOT EXISTS subjects text[] NULL,
  ADD COLUMN IF NOT EXISTS application_fee decimal(10,2) NULL,
  ADD COLUMN IF NOT EXISTS conducting_body varchar(255) NULL;

CREATE INDEX IF NOT EXISTS idx_exams_level ON common.exams(exam_level);
CREATE INDEX IF NOT EXISTS idx_exams_mode ON common.exams(exam_mode);

