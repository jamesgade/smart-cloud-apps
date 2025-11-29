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
VALUES    ('4dda28a8-4a72-4c69-b97b-244c5e6b88fa',
           'Calendar Menu',
           'ADMIN',
           'ADMIN',
           'calendar menu',
           'CALENDAR_MENU',
           NULL,
           'a1bbb4f9-ad0e-4600-881d-b59db667c956',
           '',
           false,
           '');


INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('589900b3-0413-4328-8859-e8c0ff3cc9b8', '4dda28a8-4a72-4c69-b97b-244c5e6b88fa', 'ADMIN', 'ADMIN'); -- Calendar Menu

-- Manager Role Permissions
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('4ccb49d7-359b-45bd-b24b-1a337c7bd458', '4dda28a8-4a72-4c69-b97b-244c5e6b88fa', 'ADMIN', 'ADMIN'); -- Calendar Menu

-- Senior Counsellor Role Permissions
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('6563c720-a750-44cc-b3a4-79c1aaa2abe4', '4dda28a8-4a72-4c69-b97b-244c5e6b88fa', 'ADMIN', 'ADMIN'); -- Calendar Menu

-- Counsellor Role Permissions

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('5d415ea6-84dd-490a-b790-b8f5a314c47e', '4dda28a8-4a72-4c69-b97b-244c5e6b88fa', 'ADMIN', 'ADMIN'); -- Calendar Menu

-- Student Role Permissions
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('85396e7c-1bf2-40cf-a03c-744fb6b9fa9f', '4dda28a8-4a72-4c69-b97b-244c5e6b88fa', 'ADMIN', 'ADMIN'); -- Calendar Menu