-- =====================================================
-- ADD COUNSELLORS LIST PERMISSION FOR STUDENTS
-- =====================================================
-- Allow students to view list of counsellors for booking appointments

-- Insert permission for viewing counsellors list
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
VALUES    ('b9f2c3d1-4e5f-6a7b-8c9d-0e1f2a3b4c5d',
           'View Counsellors List',
           'ADMIN',
           'ADMIN',
           'View list of available counsellors for booking',
           'VIEW_COUNSELLORS',
           NULL,
           'a1bbb4f9-ad0e-4600-881d-b59db667c956',
           'GET',
           false,
           '/appointments/counsellors');

-- Assign permission to Student role
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('85396e7c-1bf2-40cf-a03c-744fb6b9fa9f', 'b9f2c3d1-4e5f-6a7b-8c9d-0e1f2a3b4c5d', 'ADMIN', 'ADMIN'); -- Student role

-- Assign permission to Counsellor roles (so they can see other counsellors if needed)
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('6563c720-a750-44cc-b3a4-79c1aaa2abe4', 'b9f2c3d1-4e5f-6a7b-8c9d-0e1f2a3b4c5d', 'ADMIN', 'ADMIN'); -- Senior Counsellor

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('5d415ea6-84dd-490a-b790-b8f5a314c47e', 'b9f2c3d1-4e5f-6a7b-8c9d-0e1f2a3b4c5d', 'ADMIN', 'ADMIN'); -- Counsellor

-- Assign permission to Admin and Manager roles
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'b9f2c3d1-4e5f-6a7b-8c9d-0e1f2a3b4c5d', 'ADMIN', 'ADMIN'); -- Admin

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('4ccb49d7-359b-45bd-b24b-1a337c7bd458', 'b9f2c3d1-4e5f-6a7b-8c9d-0e1f2a3b4c5d', 'ADMIN', 'ADMIN'); -- Manager

COMMENT ON COLUMN auth.permissions.action IS 'Permission action name used in frontend';

