

-- Add EDIT_COLLEGE permission
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
VALUES    ('a1b2c3d4-e5f6-7890-abcd-ef1234567891',
           'Edit College',
           'ADMIN',
           'ADMIN',
           'Edit College',
           'EDIT_COLLEGE',
           NULL,
           'a1bbb4f9-ad0e-4600-881d-b59db667c956',
           '',
           false,
           '');

-- Add DELETE_COLLEGE permission
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
VALUES    ('b2c3d4e5-f6a7-8901-bcde-f23456789013',
           'Delete College',
           'ADMIN',
           'ADMIN',
           'Delete College',
           'DELETE_COLLEGE',
           NULL,
           'a1bbb4f9-ad0e-4600-881d-b59db667c956',
           '',
           false,
           '');

-- Assign EDIT_COLLEGE permission to Admin role only
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'a1b2c3d4-e5f6-7890-abcd-ef1234567891', 'ADMIN', 'ADMIN'); -- Admin role

-- Assign DELETE_COLLEGE permission to Admin role only
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'b2c3d4e5-f6a7-8901-bcde-f23456789013', 'ADMIN', 'ADMIN'); -- Admin role

-- Note: Student role ('85396e7c-1bf2-40cf-a03c-744fb6b9fa9f') is intentionally excluded
-- Students only have COLLEGES_MENU permission for view-only access
