-- Set default values for exam_level and exam_mode

ALTER TABLE common.exams
  ALTER COLUMN exam_level SET DEFAULT 'NATIONAL';

ALTER TABLE common.exams
  ALTER COLUMN exam_mode SET DEFAULT 'ONLINE';

-- Optionally backfill existing NULLs to defaults for consistency
UPDATE common.exams SET exam_level = 'NATIONAL' WHERE exam_level IS NULL;
UPDATE common.exams SET exam_mode = 'ONLINE' WHERE exam_mode IS NULL;


