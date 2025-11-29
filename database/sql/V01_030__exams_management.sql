-- Create exams table and add permissions for management and public listing

CREATE SCHEMA IF NOT EXISTS common;

CREATE TABLE IF NOT EXISTS common.exams (
    exam_id uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    name varchar(255) NOT NULL,
    category varchar(100) NOT NULL, -- Engineering, Medical, Management, Law, etc.
    description text NULL,
    exam_date date NULL,
    start_date date NULL,
    end_date date NULL,
    status varchar(50) DEFAULT 'UPCOMING' NOT NULL, -- UPCOMING | CURRENT | COMPLETED
    is_active boolean DEFAULT true NOT NULL,
    created_by varchar(150) NOT NULL,
    updated_by varchar(150) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_exams_category ON common.exams(category);
CREATE INDEX IF NOT EXISTS idx_exams_is_active ON common.exams(is_active);
CREATE INDEX IF NOT EXISTS idx_exams_status ON common.exams(status);
CREATE INDEX IF NOT EXISTS idx_exams_dates ON common.exams(exam_date, start_date, end_date);

-- Permissions
-- Reuse existing permission object id for Users/API routing used elsewhere
-- Or create a new object if needed. Using existing 'Users' object: a1bbb4f9-ad0e-4600-881d-b59db667c956

-- Exams Management Menu (for admin/manager/counsellor)
INSERT INTO auth.permissions (
  permission_id, name, created_by, updated_by, description, action, condition, object_id, request_method, override_object_url, path
) VALUES (
  'b9f5f9c8-2f1e-4e6a-9a8b-2a2f5c9b0e7a',
  'Exams Management Menu',
  'ADMIN',
  'ADMIN',
  'exams management menu',
  'EXAMS_MANAGEMENT_MENU',
  NULL,
  'a1bbb4f9-ad0e-4600-881d-b59db667c956',
  'GET',
  false,
  '/examinations'
)
ON CONFLICT DO NOTHING;

-- Assign to Admin, Manager, Counsellor
-- Admin role id: 589900b3-0413-4328-8859-e8c0ff3cc9b8
-- Manager role id: 4ccb49d7-359b-45bd-b24b-1a337c7bd458
-- Senior Counsellor role id: 6563c720-a750-44cc-b3a4-79c1aaa2abe4
-- Counsellor role id: 5d415ea6-84dd-490a-b790-b8f5a314c47e

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
SELECT '589900b3-0413-4328-8859-e8c0ff3cc9b8', 'b9f5f9c8-2f1e-4e6a-9a8b-2a2f5c9b0e7a', 'ADMIN', 'ADMIN'
WHERE NOT EXISTS (
  SELECT 1 FROM auth.role_permissions WHERE role_id = '589900b3-0413-4328-8859-e8c0ff3cc9b8' AND permission_id = 'b9f5f9c8-2f1e-4e6a-9a8b-2a2f5c9b0e7a'
);

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
SELECT '4ccb49d7-359b-45bd-b24b-1a337c7bd458', 'b9f5f9c8-2f1e-4e6a-9a8b-2a2f5c9b0e7a', 'ADMIN', 'ADMIN'
WHERE NOT EXISTS (
  SELECT 1 FROM auth.role_permissions WHERE role_id = '4ccb49d7-359b-45bd-b24b-1a337c7bd458' AND permission_id = 'b9f5f9c8-2f1e-4e6a-9a8b-2a2f5c9b0e7a'
);

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
SELECT '6563c720-a750-44cc-b3a4-79c1aaa2abe4', 'b9f5f9c8-2f1e-4e6a-9a8b-2a2f5c9b0e7a', 'ADMIN', 'ADMIN'
WHERE NOT EXISTS (
  SELECT 1 FROM auth.role_permissions WHERE role_id = '6563c720-a750-44cc-b3a4-79c1aaa2abe4' AND permission_id = 'b9f5f9c8-2f1e-4e6a-9a8b-2a2f5c9b0e7a'
);

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
SELECT '5d415ea6-84dd-490a-b790-b8f5a314c47e', 'b9f5f9c8-2f1e-4e6a-9a8b-2a2f5c9b0e7a', 'ADMIN', 'ADMIN'
WHERE NOT EXISTS (
  SELECT 1 FROM auth.role_permissions WHERE role_id = '5d415ea6-84dd-490a-b790-b8f5a314c47e' AND permission_id = 'b9f5f9c8-2f1e-4e6a-9a8b-2a2f5c9b0e7a'
);


