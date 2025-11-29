-- Add family details to student academic profile

ALTER TABLE student.student_academic_profile
  ADD COLUMN IF NOT EXISTS father_name varchar(150) NULL,
  ADD COLUMN IF NOT EXISTS father_mobile varchar(20) NULL,
  ADD COLUMN IF NOT EXISTS father_occupation varchar(150) NULL,
  ADD COLUMN IF NOT EXISTS mother_name varchar(150) NULL,
  ADD COLUMN IF NOT EXISTS mother_mobile varchar(20) NULL,
  ADD COLUMN IF NOT EXISTS mother_occupation varchar(150) NULL;


