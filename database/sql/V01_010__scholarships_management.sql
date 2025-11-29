-- Ensure the schema exists
CREATE SCHEMA IF NOT EXISTS common;

-- Drop existing scholarships table if it exists (to recreate with correct structure)
DROP TABLE IF EXISTS common.scholarships CASCADE;

-- Create scholarships table with correct structure
CREATE TABLE common.scholarships (
    scholarship_id uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    scholarship_name varchar(255) NOT NULL, -- Name of the scholarship
    provider varchar(255) NOT NULL, -- Organization providing the scholarship
    eligibility_criteria text, -- Academic merit, income limits, category, or course-specific requirements
    applicable_courses varchar(100), -- Which courses are eligible
    education_level varchar(50), -- UG, PG, PhD, Abroad, etc.
    scholarship_amount decimal(15,2), -- Total monetary aid amount
    benefits_description text, -- Tuition fee, living allowance, stipend details
    application_process text, -- How to apply
    portal_link varchar(500), -- Application portal link
    application_start_date date, -- When applications open
    application_end_date date, -- When applications close
    renewal_schedule text, -- Renewal schedule and process
    overall_remarks text, -- Brief note on ease of application, competition level, or reliability
    is_active boolean DEFAULT true NOT NULL,
    created_by varchar(150) NOT NULL,
    updated_by varchar(150) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_scholarships_name ON common.scholarships(scholarship_name);
CREATE INDEX IF NOT EXISTS idx_scholarships_provider ON common.scholarships(provider);
CREATE INDEX IF NOT EXISTS idx_scholarships_education_level ON common.scholarships(education_level);
CREATE INDEX IF NOT EXISTS idx_scholarships_is_active ON common.scholarships(is_active);
CREATE INDEX IF NOT EXISTS idx_scholarships_amount ON common.scholarships(scholarship_amount);
CREATE INDEX IF NOT EXISTS idx_scholarships_scholarship_id ON common.scholarships(scholarship_id);
CREATE INDEX IF NOT EXISTS idx_scholarships_created_at ON common.scholarships(created_at);
CREATE INDEX IF NOT EXISTS idx_scholarships_updated_at ON common.scholarships(updated_at);

-- Insert sample scholarship records
INSERT INTO common.scholarships (
    scholarship_id, scholarship_name, provider, eligibility_criteria, applicable_courses,
    education_level, scholarship_amount, benefits_description, application_process,
    portal_link, application_start_date, application_end_date, renewal_schedule,
    overall_remarks, is_active, created_by, updated_by
) VALUES
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'National Scholarship Portal (NSP)', 'Government of India', 
 'Indian citizen, family income below ₹8 lakhs, minimum 60% marks in previous exam',
 'All courses', 'UG/PG', 50000.00, 'Tuition fee reimbursement, maintenance allowance',
 'Online application through NSP portal', 'https://scholarships.gov.in', 
 '2024-01-01', '2024-03-31', 'Annual renewal based on academic performance',
 'Highly reliable, easy application process', true, 'ADMIN', 'ADMIN'),

('b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Tata Trusts Scholarship', 'Tata Trusts', 
 'Merit-based, family income below ₹6 lakhs, admission to premier institutes',
 'Engineering, Medicine, Management', 'UG/PG', 100000.00, 'Full tuition fee, living expenses, laptop',
 'Direct application to Tata Trusts', 'https://tatatrusts.org/scholarships',
 '2024-02-01', '2024-04-30', 'Annual renewal with academic excellence',
 'Competitive but highly prestigious', true, 'ADMIN', 'ADMIN'),

('b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'UGC NET Fellowship', 'University Grants Commission', 
 'Masters degree with 55% marks, age limit 30 years, NET qualified',
 'All subjects', 'PhD', 31000.00, 'Monthly stipend, contingency grant',
 'Through UGC NET examination', 'https://ugcnet.nta.nic.in',
 '2024-03-01', '2024-05-31', 'Annual renewal for 5 years',
 'Research-oriented, highly competitive', true, 'ADMIN', 'ADMIN'),

('b4eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Chevening Scholarship', 'UK Government', 
 'Indian citizen, 2+ years work experience, leadership qualities',
 'All subjects', 'Masters', 0.00, 'Full tuition fee, living allowance, travel costs',
 'Online application through Chevening portal', 'https://chevening.org',
 '2024-08-01', '2024-11-01', 'One-time award, no renewal',
 'International exposure, highly prestigious', true, 'ADMIN', 'ADMIN'),

('b5eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'Fulbright Scholarship', 'US Government', 
 'Indian citizen, Masters degree, English proficiency, research proposal',
 'All subjects', 'PhD/Research', 0.00, 'Full funding, health insurance, travel',
 'Through USIEF application', 'https://usief.org.in',
 '2024-04-01', '2024-07-15', 'One-time award, no renewal',
 'International research opportunity', true, 'ADMIN', 'ADMIN');

-- Permissions for Scholarships Management
INSERT INTO auth.permissions (permission_id, name, created_by, updated_by, description, action, condition, object_id, request_method, override_object_url, path)
VALUES
('e1a2b3c4-d5e6-4789-a1b2-c3d4e5f6a7b8', 'Create Scholarship', 'ADMIN', 'ADMIN', 'Create Scholarship', 'CREATE_SCHOLARSHIP', NULL, 'a1bbb4f9-ad0e-4600-881d-b59db667c956', 'POST', false, '/api/scholarships'),
('e2a3b4c5-d6e7-4789-a2b3-c4d5e6f7a8b9', 'Update Scholarship', 'ADMIN', 'ADMIN', 'Update Scholarship', 'UPDATE_SCHOLARSHIP', NULL, 'a1bbb4f9-ad0e-4600-881d-b59db667c956', 'PUT', false, '/api/scholarships'),
('e3a4b5c6-d7e8-4789-a3b4-c5d6e7f8a9b0', 'Delete Scholarship', 'ADMIN', 'ADMIN', 'Delete Scholarship', 'DELETE_SCHOLARSHIP', NULL, 'a1bbb4f9-ad0e-4600-881d-b59db667c956', 'DELETE', false, '/api/scholarships'),
('e4a5b6c7-d8e9-4789-a4b5-c6d7e8f9a0b1', 'Scholarships Management Menu', 'ADMIN', 'ADMIN', 'Scholarships Management Menu', 'SCHOLARSHIPS_MANAGEMENT_MENU', NULL, 'a1bbb4f9-ad0e-4600-881d-b59db667c956', 'GET', false, '/scholarships-management');

-- Assign permissions to Admin role
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES
('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'e1a2b3c4-d5e6-4789-a1b2-c3d4e5f6a7b8', 'ADMIN', 'ADMIN'), -- Create Scholarship
('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'e2a3b4c5-d6e7-4789-a2b3-c4d5e6f7a8b9', 'ADMIN', 'ADMIN'), -- Update Scholarship
('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'e3a4b5c6-d7e8-4789-a3b4-c5d6e7f8a9b0', 'ADMIN', 'ADMIN'), -- Delete Scholarship
('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'e4a5b6c7-d8e9-4789-a4b5-c6d7e8f9a0b1', 'ADMIN', 'ADMIN'); -- Scholarships Management Menu
