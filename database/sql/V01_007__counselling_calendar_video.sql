CREATE SCHEMA IF NOT EXISTS counselling;

-- =====================================================
-- 1. APPOINTMENT STATUS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS counselling.appointment_status (
    status_id UUID PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    status_code VARCHAR(50) UNIQUE NOT NULL,
    status_name VARCHAR(100) NOT NULL,
    description TEXT DEFAULT NULL,
    display_order INTEGER NOT NULL,
    
    created_by VARCHAR(150) NOT NULL,
    updated_by VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Insert status values
INSERT INTO counselling.appointment_status (status_code, status_name, description, display_order, created_by, updated_by)
VALUES 
    ('PENDING', 'Pending', 'Appointment created by student, awaiting counsellor confirmation', 1, 'SYSTEM', 'SYSTEM'),
    ('CONFIRMED', 'Confirmed', 'Counsellor confirmed the appointment', 2, 'SYSTEM', 'SYSTEM'),
    ('REJECTED', 'Rejected', 'Counsellor rejected the appointment', 3, 'SYSTEM', 'SYSTEM'),
    ('CANCELLED', 'Cancelled', 'Appointment cancelled by student or counsellor', 4, 'SYSTEM', 'SYSTEM'),
    ('COMPLETED', 'Completed', 'Appointment session completed', 5, 'SYSTEM', 'SYSTEM'),
    ('NO_SHOW', 'No Show', 'Student did not attend', 6, 'SYSTEM', 'SYSTEM');

-- =====================================================
-- 2. APPOINTMENTS TABLE
-- =====================================================
-- Students create appointments with counsellors
CREATE TABLE IF NOT EXISTS counselling.appointments (
    appointment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    
    -- Participants
    student_id UUID NOT NULL,
    counsellor_id UUID NOT NULL,
    
    -- Appointment details
    title VARCHAR(255) NOT NULL,
    description TEXT DEFAULT NULL,
    
    -- Scheduling
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    
    -- Status
    status_id UUID NOT NULL,
    
    -- Additional info
    student_notes TEXT DEFAULT NULL,
    counsellor_notes TEXT DEFAULT NULL,
    
    -- Confirmation/Rejection
    confirmed_at TIMESTAMP DEFAULT NULL,
    rejection_reason TEXT DEFAULT NULL,
    
    -- Cancellation
    cancelled_by UUID DEFAULT NULL,
    cancelled_at TIMESTAMP DEFAULT NULL,
    cancellation_reason TEXT DEFAULT NULL,
    
    -- Audit fields
    created_by VARCHAR(150) NOT NULL,
    updated_by VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    CONSTRAINT fk_appointments_student FOREIGN KEY (student_id)
        REFERENCES student.student(student_id) ON DELETE CASCADE,
    CONSTRAINT fk_appointments_counsellor FOREIGN KEY (counsellor_id)
        REFERENCES auth."user"(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_appointments_status FOREIGN KEY (status_id)
        REFERENCES counselling.appointment_status(status_id),
    CONSTRAINT check_appointment_time CHECK (end_time > start_time)
);

CREATE INDEX idx_appointments_student ON counselling.appointments(student_id);
CREATE INDEX idx_appointments_counsellor ON counselling.appointments(counsellor_id);
CREATE INDEX idx_appointments_date ON counselling.appointments(appointment_date);
CREATE INDEX idx_appointments_status ON counselling.appointments(status_id);

-- =====================================================
-- 3. SESSION STATUS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS counselling.session_status (
    status_id UUID PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    status_code VARCHAR(50) UNIQUE NOT NULL,
    status_name VARCHAR(100) NOT NULL,
    description TEXT DEFAULT NULL,
    display_order INTEGER NOT NULL,
    
    created_by VARCHAR(150) NOT NULL,
    updated_by VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Insert session status values
INSERT INTO counselling.session_status (status_code, status_name, description, display_order, created_by, updated_by)
VALUES 
    ('CREATED', 'Created', 'Video room created, waiting to start', 1, 'SYSTEM', 'SYSTEM'),
    ('ACTIVE', 'Active', 'Video call in progress', 2, 'SYSTEM', 'SYSTEM'),
    ('COMPLETED', 'Completed', 'Session ended successfully', 3, 'SYSTEM', 'SYSTEM'),
    ('FAILED', 'Failed', 'Technical failure or error', 4, 'SYSTEM', 'SYSTEM');

-- =====================================================
-- 4. SESSIONS TABLE
-- =====================================================
-- Counsellors launch video sessions from appointments
CREATE TABLE IF NOT EXISTS counselling.sessions (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    appointment_id UUID NOT NULL,
    
    -- Session timing
    launched_at TIMESTAMP DEFAULT NULL,
    started_at TIMESTAMP DEFAULT NULL,
    ended_at TIMESTAMP DEFAULT NULL,
    duration_minutes INTEGER DEFAULT NULL,
    
    -- Status
    status_id UUID NOT NULL,
    
    -- Participants joined tracking
    counsellor_joined BOOLEAN DEFAULT false,
    counsellor_joined_at TIMESTAMP DEFAULT NULL,
    student_joined BOOLEAN DEFAULT false,
    student_joined_at TIMESTAMP DEFAULT NULL,
    
    -- Session outcome
    session_notes TEXT DEFAULT NULL,
    
    -- Audit fields
    created_by VARCHAR(150) NOT NULL,
    updated_by VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    CONSTRAINT fk_sessions_appointment FOREIGN KEY (appointment_id)
        REFERENCES counselling.appointments(appointment_id) ON DELETE CASCADE,
    CONSTRAINT fk_sessions_status FOREIGN KEY (status_id)
        REFERENCES counselling.session_status(status_id)
);

CREATE INDEX idx_sessions_appointment ON counselling.sessions(appointment_id);
CREATE INDEX idx_sessions_status ON counselling.sessions(status_id);
CREATE INDEX idx_sessions_launched ON counselling.sessions(launched_at);

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE counselling.appointment_status IS 'Status values for appointments';
COMMENT ON TABLE counselling.appointments IS 'Student-created counselling appointments';
COMMENT ON TABLE counselling.session_status IS 'Status values for video sessions';
COMMENT ON TABLE counselling.sessions IS 'Counsellor-launched video call sessions';
