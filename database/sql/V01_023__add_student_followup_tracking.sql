-- V01_023__add_student_followup_tracking.sql
-- Add student followup tracking table for managing student followups (hot calling, cold, warm, etc.)

CREATE TABLE IF NOT EXISTS student.student_followup (
    followup_id uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    student_id uuid NOT NULL,
    followup_type varchar(50) NOT NULL, -- 'HOT_CALLING', 'COLD', 'WARM', 'FOLLOWUP', 'CLOSED'
    followup_date timestamp NOT NULL,
    notes text,
    counsellor_id uuid, -- Admin/Counsellor who conducted the followup
    next_followup_date timestamp,
    status varchar(50) DEFAULT 'SCHEDULED', -- 'SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED'
    created_by varchar(150) NOT NULL,
    updated_by varchar(150) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- Constraints
    CONSTRAINT fk_followup_student FOREIGN KEY (student_id)
        REFERENCES student.student(student_id)
        ON DELETE CASCADE,
    
    CONSTRAINT fk_followup_counsellor FOREIGN KEY (counsellor_id)
        REFERENCES auth."user"(user_id)
        ON DELETE SET NULL,
    
    CONSTRAINT chk_followup_type CHECK (followup_type IN ('HOT', 'COLD', 'WARM', 'FOLLOWUP', 'CLOSED')),
    CONSTRAINT chk_followup_status CHECK (status IN ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED'))
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_followup_student_id ON student.student_followup(student_id);
CREATE INDEX IF NOT EXISTS idx_followup_counsellor_id ON student.student_followup(counsellor_id);
CREATE INDEX IF NOT EXISTS idx_followup_date ON student.student_followup(followup_date);
CREATE INDEX IF NOT EXISTS idx_followup_type ON student.student_followup(followup_type);
CREATE INDEX IF NOT EXISTS idx_followup_status ON student.student_followup(status);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION student.update_student_followup_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trg_student_followup_updated_at
    BEFORE UPDATE ON student.student_followup
    FOR EACH ROW
    EXECUTE FUNCTION student.update_student_followup_updated_at();

-- Add comment to document the table
COMMENT ON TABLE student.student_followup IS 'Tracks student followups including hot calling, cold calling, warm leads, and followup activities';

