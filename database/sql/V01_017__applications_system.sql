-- Create applications schema
CREATE SCHEMA IF NOT EXISTS applications;

-- Create applications table
CREATE TABLE IF NOT EXISTS applications.applications (
    application_id uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    student_id uuid NOT NULL,
    student_name varchar(255) NOT NULL,
    application_type varchar(50) NOT NULL, -- 'LOAN' or 'SCHOLARSHIP'
    application_title varchar(255) NOT NULL, -- Bank name for loans, Scholarship name for scholarships
    application_details text, -- Additional details like loan amount, scholarship amount, etc.
    status varchar(50) DEFAULT 'PENDING' NOT NULL, -- 'PENDING', 'APPROVED', 'REJECTED', 'UNDER_REVIEW'
    applied_date timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    reviewed_by uuid, -- Admin/Counsellor who reviewed
    reviewed_date timestamp,
    review_notes text,
    created_by varchar(150) NOT NULL,
    updated_by varchar(150) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- Constraints
    CONSTRAINT fk_application_student FOREIGN KEY (student_id)
        REFERENCES student.student(student_id)
        ON DELETE CASCADE,
    
    CONSTRAINT fk_application_reviewer FOREIGN KEY (reviewed_by)
        REFERENCES auth."user"(user_id)
        ON DELETE SET NULL,
    
    CONSTRAINT chk_application_type CHECK (application_type IN ('LOAN', 'SCHOLARSHIP')),
    CONSTRAINT chk_application_status CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'UNDER_REVIEW'))
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_applications_student_id ON applications.applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_type ON applications.applications(application_type);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications.applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_applied_date ON applications.applications(applied_date);

-- Create permission object for applications
INSERT INTO auth.permission_objects
            (permission_object_id,
             NAME,
             request_url,
             created_by,
             updated_by)
VALUES      ('a1b2c3d4-e5f6-7890-abcd-ef1234567890',
             'Applications',
             '/portal-api/applications',
             'system',
             'system');

-- Insert permissions for applications
INSERT INTO auth.permissions
          (permission_id,
           NAME,
           created_by,
           updated_by,
           description,
           action,
           condition,
           object_id,
           request_method,
           override_object_url,
           path)
VALUES    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890',
           'APPLICATIONS_MENU',
           'system',
           'system',
           'Access to Applications menu',
           'read',
           NULL,
           'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
           'GET',
           false,
           '/applications'),
          ('b2c3d4e5-f6a7-8901-bcde-f23456789012',
           'APPLICATIONS_CREATE',
           'system',
           'system',
           'Create new applications',
           'create',
           NULL,
           'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
           'POST',
           false,
           '/applications'),
          ('c3d4e5f6-a7b8-9012-cdef-345678901234',
           'APPLICATIONS_READ',
           'system',
           'system',
           'Read applications',
           'read',
           NULL,
           'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
           'GET',
           false,
           '/applications'),
          ('d4e5f6a7-b8c9-0123-defa-456789012345',
           'APPLICATIONS_UPDATE',
           'system',
           'system',
           'Update applications',
           'update',
           NULL,
           'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
           'PUT',
           false,
           '/applications'),
          ('e5f6a7b8-c9d0-1234-efab-567890123456',
           'APPLICATIONS_DELETE',
           'system',
           'system',
           'Delete applications',
           'delete',
           NULL,
           'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
           'DELETE',
           false,
           '/applications');

-- Assign permissions to roles
-- Admin role gets all permissions
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES 
    ('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'system', 'system'),
    ('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'b2c3d4e5-f6a7-8901-bcde-f23456789012', 'system', 'system'),
    ('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'c3d4e5f6-a7b8-9012-cdef-345678901234', 'system', 'system'),
    ('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'd4e5f6a7-b8c9-0123-defa-456789012345', 'system', 'system'),
    ('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'e5f6a7b8-c9d0-1234-efab-567890123456', 'system', 'system');

-- Manager role gets all permissions
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES 
    ('4ccb49d7-359b-45bd-b24b-1a337c7bd458', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'system', 'system'),
    ('4ccb49d7-359b-45bd-b24b-1a337c7bd458', 'b2c3d4e5-f6a7-8901-bcde-f23456789012', 'system', 'system'),
    ('4ccb49d7-359b-45bd-b24b-1a337c7bd458', 'c3d4e5f6-a7b8-9012-cdef-345678901234', 'system', 'system'),
    ('4ccb49d7-359b-45bd-b24b-1a337c7bd458', 'd4e5f6a7-b8c9-0123-defa-456789012345', 'system', 'system'),
    ('4ccb49d7-359b-45bd-b24b-1a337c7bd458', 'e5f6a7b8-c9d0-1234-efab-567890123456', 'system', 'system');

-- Senior Counsellor role gets all permissions
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES 
    ('6563c720-a750-44cc-b3a4-79c1aaa2abe4', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'system', 'system'),
    ('6563c720-a750-44cc-b3a4-79c1aaa2abe4', 'b2c3d4e5-f6a7-8901-bcde-f23456789012', 'system', 'system'),
    ('6563c720-a750-44cc-b3a4-79c1aaa2abe4', 'c3d4e5f6-a7b8-9012-cdef-345678901234', 'system', 'system'),
    ('6563c720-a750-44cc-b3a4-79c1aaa2abe4', 'd4e5f6a7-b8c9-0123-defa-456789012345', 'system', 'system'),
    ('6563c720-a750-44cc-b3a4-79c1aaa2abe4', 'e5f6a7b8-c9d0-1234-efab-567890123456', 'system', 'system');

-- Counsellor role gets all permissions
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES 
    ('5d415ea6-84dd-490a-b790-b8f5a314c47e', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'system', 'system'),
    ('5d415ea6-84dd-490a-b790-b8f5a314c47e', 'b2c3d4e5-f6a7-8901-bcde-f23456789012', 'system', 'system'),
    ('5d415ea6-84dd-490a-b790-b8f5a314c47e', 'c3d4e5f6-a7b8-9012-cdef-345678901234', 'system', 'system'),
    ('5d415ea6-84dd-490a-b790-b8f5a314c47e', 'd4e5f6a7-b8c9-0123-defa-456789012345', 'system', 'system'),
    ('5d415ea6-84dd-490a-b790-b8f5a314c47e', 'e5f6a7b8-c9d0-1234-efab-567890123456', 'system', 'system');

-- Student role gets only create and read permissions
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES 
    ('85396e7c-1bf2-40cf-a03c-744fb6b9fa9f', 'b2c3d4e5-f6a7-8901-bcde-f23456789012', 'system', 'system'),
    ('85396e7c-1bf2-40cf-a03c-744fb6b9fa9f', 'c3d4e5f6-a7b8-9012-cdef-345678901234', 'system', 'system');

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION applications.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trg_applications_updated_at
    BEFORE UPDATE ON applications.applications
    FOR EACH ROW
    EXECUTE FUNCTION applications.update_updated_at_column();
