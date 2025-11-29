-- Student academic profile details

CREATE TABLE IF NOT EXISTS student.student_academic_profile (
    student_id uuid PRIMARY KEY REFERENCES student.student(student_id) ON DELETE CASCADE,
    tenth_marks_percent numeric(5,2) NULL,
    inter_first_year_percent numeric(5,2) NULL,
    inter_second_year_percent numeric(5,2) NULL,
    competitive_exams text[] NULL,
    created_by varchar(150) NOT NULL DEFAULT 'SYSTEM',
    updated_by varchar(150) NOT NULL DEFAULT 'SYSTEM',
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_student_academic_profile_student ON student.student_academic_profile(student_id);

