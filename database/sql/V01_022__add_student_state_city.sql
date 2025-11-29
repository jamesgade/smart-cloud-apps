-- V01_022__add_student_state_city.sql
-- Add state and city columns to student table for registration

-- Add state column to student table
ALTER TABLE student.student ADD COLUMN IF NOT EXISTS state varchar(100) NULL;

-- Add city column to student table
ALTER TABLE student.student ADD COLUMN IF NOT EXISTS city varchar(100) NULL;

-- Add comments to document the new columns
COMMENT ON COLUMN student.student.state IS 'State where the student is located';
COMMENT ON COLUMN student.student.city IS 'City where the student is located';

