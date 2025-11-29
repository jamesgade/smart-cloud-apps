-- V01_026__add_followup_menu_permissions.sql
-- Add FOLLOWUP_MENU permission and assign it to Admin, Manager, Senior Counsellor, and Counsellor roles

-- Insert FOLLOWUP_MENU permission (only if it doesn't exist)
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
SELECT    gen_random_uuid(),
           'Followup Menu',
           'ADMIN',
           'ADMIN',
           'followup menu',
           'FOLLOWUP_MENU',
           NULL,
           'a1bbb4f9-ad0e-4600-881d-b59db667c956',
           '',
           false,
           ''
WHERE NOT EXISTS (
    SELECT 1 FROM auth.permissions WHERE action = 'FOLLOWUP_MENU'
);

-- Add FOLLOWUP_MENU permission to Admin role
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
SELECT '589900b3-0413-4328-8859-e8c0ff3cc9b8', permission_id, 'ADMIN', 'ADMIN'
FROM auth.permissions 
WHERE action = 'FOLLOWUP_MENU'
AND NOT EXISTS (
    SELECT 1 FROM auth.role_permissions rp 
    WHERE rp.role_id = '589900b3-0413-4328-8859-e8c0ff3cc9b8' 
    AND rp.permission_id = (SELECT permission_id FROM auth.permissions WHERE action = 'FOLLOWUP_MENU')
);

-- Add FOLLOWUP_MENU permission to Manager role
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
SELECT '4ccb49d7-359b-45bd-b24b-1a337c7bd458', permission_id, 'ADMIN', 'ADMIN'
FROM auth.permissions 
WHERE action = 'FOLLOWUP_MENU'
AND NOT EXISTS (
    SELECT 1 FROM auth.role_permissions rp 
    WHERE rp.role_id = '4ccb49d7-359b-45bd-b24b-1a337c7bd458' 
    AND rp.permission_id = (SELECT permission_id FROM auth.permissions WHERE action = 'FOLLOWUP_MENU')
);

-- Add FOLLOWUP_MENU permission to Senior Counsellor role
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
SELECT '6563c720-a750-44cc-b3a4-79c1aaa2abe4', permission_id, 'ADMIN', 'ADMIN'
FROM auth.permissions 
WHERE action = 'FOLLOWUP_MENU'
AND NOT EXISTS (
    SELECT 1 FROM auth.role_permissions rp 
    WHERE rp.role_id = '6563c720-a750-44cc-b3a4-79c1aaa2abe4' 
    AND rp.permission_id = (SELECT permission_id FROM auth.permissions WHERE action = 'FOLLOWUP_MENU')
);

-- Add FOLLOWUP_MENU permission to Counsellor role
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
SELECT '5d415ea6-84dd-490a-b790-b8f5a314c47e', permission_id, 'ADMIN', 'ADMIN'
FROM auth.permissions 
WHERE action = 'FOLLOWUP_MENU'
AND NOT EXISTS (
    SELECT 1 FROM auth.role_permissions rp 
    WHERE rp.role_id = '5d415ea6-84dd-490a-b790-b8f5a314c47e' 
    AND rp.permission_id = (SELECT permission_id FROM auth.permissions WHERE action = 'FOLLOWUP_MENU')
);

