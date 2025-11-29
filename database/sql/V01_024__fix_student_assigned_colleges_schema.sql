-- Fix student_assigned_colleges table schema and structure
-- Move from student schema to common schema and add missing columns

-- Drop the old table if it exists in student schema
DROP TABLE IF EXISTS student.student_assigned_colleges;

-- Create the table in common schema with all required fields
CREATE TABLE IF NOT EXISTS common.student_assigned_colleges (
    assignment_id uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    student_id uuid NOT NULL,
    college_id uuid NOT NULL,
    assignment_type varchar(50) DEFAULT 'INTERESTED' NOT NULL,
    assignment_status varchar(50) DEFAULT 'ACTIVE' NOT NULL,
    priority_order integer,
    application_date date,
    admission_date date,
    enrollment_date date,
    course_name varchar(255),
    specialization varchar(255),
    semester varchar(10),
    student_notes text,
    counsellor_notes text,
    assigned_by uuid,
    assigned_date timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by varchar(150) NOT NULL,
    updated_by varchar(150) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- Constraints
    CONSTRAINT fk_assignment_student FOREIGN KEY (student_id)
        REFERENCES student.student(student_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_assignment_college FOREIGN KEY (college_id)
        REFERENCES common.colleges(college_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_assignment_user FOREIGN KEY (assigned_by)
        REFERENCES auth."user"(user_id)
        ON DELETE SET NULL,

    CONSTRAINT chk_assignment_type CHECK (assignment_type IN ('INTERESTED', 'APPLIED', 'ADMITTED', 'ENROLLED', 'REJECTED', 'WAITLISTED')),
    CONSTRAINT chk_assignment_status CHECK (assignment_status IN ('ACTIVE', 'INACTIVE', 'COMPLETED', 'CANCELLED'))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_student_assigned_colleges_student_id ON common.student_assigned_colleges(student_id);
CREATE INDEX IF NOT EXISTS idx_student_assigned_colleges_college_id ON common.student_assigned_colleges(college_id);
CREATE INDEX IF NOT EXISTS idx_student_assigned_colleges_assignment_type ON common.student_assigned_colleges(assignment_type);
CREATE INDEX IF NOT EXISTS idx_student_assigned_colleges_assignment_status ON common.student_assigned_colleges(assignment_status);

-- Create unique partial index: Only one ACTIVE assignment per student-college pair
-- This allows multiple assignments with different statuses (e.g., INTERESTED -> APPLIED -> ADMITTED)
-- but prevents duplicate active assignments
CREATE UNIQUE INDEX IF NOT EXISTS uq_student_college_active 
    ON common.student_assigned_colleges(student_id, college_id) 
    WHERE assignment_status = 'ACTIVE';

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION common.update_student_assigned_colleges_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trg_student_assigned_colleges_updated_at
    BEFORE UPDATE ON common.student_assigned_colleges
    FOR EACH ROW
    EXECUTE FUNCTION common.update_student_assigned_colleges_updated_at_column();

