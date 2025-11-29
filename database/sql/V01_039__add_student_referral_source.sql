-- V01_039__add_student_referral_source.sql
-- Add referral_source column to student table to track how students found the website

-- Add referral_source column to student table
ALTER TABLE student.student ADD COLUMN IF NOT EXISTS referral_source varchar(100) NULL;

-- Add comment to document the new column
COMMENT ON COLUMN student.student.referral_source IS 'How the student found out about the website (e.g., Google Search, Facebook, Friend Referral, etc.)';

