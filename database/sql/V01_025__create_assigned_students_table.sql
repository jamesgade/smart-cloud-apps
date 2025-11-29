-- V01_025__create_assigned_students_table.sql
-- Create assigned_students table for assigning students to counsellors/admins

CREATE TABLE IF NOT EXISTS common.assigned_students (
    assignment_id uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    student_id uuid NOT NULL,
    assigned_to uuid NOT NULL, -- User ID (counsellor/admin)
    assignment_status varchar(50) DEFAULT 'ACTIVE' NOT NULL,
    assigned_by uuid NOT NULL, -- Admin who made the assignment
    assigned_date timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    notes text,
    created_by varchar(150) NOT NULL,
    updated_by varchar(150) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- Constraints
    CONSTRAINT fk_assigned_student FOREIGN KEY (student_id)
        REFERENCES student.student(student_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_assigned_to_user FOREIGN KEY (assigned_to)
        REFERENCES auth."user"(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_assigned_by_user FOREIGN KEY (assigned_by)
        REFERENCES auth."user"(user_id)
        ON DELETE SET NULL,

    CONSTRAINT chk_assignment_status CHECK (assignment_status IN ('ACTIVE', 'INACTIVE', 'COMPLETED', 'TRANSFERRED'))
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assigned_students_student_id ON common.assigned_students(student_id);
CREATE INDEX IF NOT EXISTS idx_assigned_students_assigned_to ON common.assigned_students(assigned_to);
CREATE INDEX IF NOT EXISTS idx_assigned_students_assigned_by ON common.assigned_students(assigned_by);
CREATE INDEX IF NOT EXISTS idx_assigned_students_status ON common.assigned_students(assignment_status);

-- Create unique partial index: Only one ACTIVE assignment per student
-- This allows reassignment by deactivating previous assignment
CREATE UNIQUE INDEX IF NOT EXISTS uq_student_active_assignment 
    ON common.assigned_students(student_id) 
    WHERE assignment_status = 'ACTIVE';

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION common.update_assigned_students_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trg_assigned_students_updated_at
    BEFORE UPDATE ON common.assigned_students
    FOR EACH ROW
    EXECUTE FUNCTION common.update_assigned_students_updated_at_column();

-- Note: Permissions are typically managed through application-level authentication
-- If you need to grant specific database role permissions, adjust the role name below:
-- GRANT SELECT, INSERT, UPDATE, DELETE ON common.assigned_students TO <your_role_name>;

