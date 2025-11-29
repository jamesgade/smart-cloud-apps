-- Add intermediate (+12) stream to student academic profile

ALTER TABLE student.student_academic_profile
  ADD COLUMN IF NOT EXISTS inter_stream varchar(50) NULL;


