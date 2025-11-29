-- Add MESSAGES_MENU permission to Admin, Counsellor, and Senior Counsellor roles
-- This allows these roles to see the Messages menu item in the frontend

-- Add MESSAGES_MENU permission to Admin role
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
SELECT '589900b3-0413-4328-8859-e8c0ff3cc9b8', permission_id, 'ADMIN', 'ADMIN'
FROM auth.permissions 
WHERE action = 'MESSAGES_MENU'
AND NOT EXISTS (
    SELECT 1 FROM auth.role_permissions rp 
    WHERE rp.role_id = '589900b3-0413-4328-8859-e8c0ff3cc9b8' 
    AND rp.permission_id = (SELECT permission_id FROM auth.permissions WHERE action = 'MESSAGES_MENU')
);

-- Add MESSAGES_MENU permission to Counsellor role
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
SELECT '5d415ea6-84dd-490a-b790-b8f5a314c47e', permission_id, 'ADMIN', 'ADMIN'
FROM auth.permissions 
WHERE action = 'MESSAGES_MENU'
AND NOT EXISTS (
    SELECT 1 FROM auth.role_permissions rp 
    WHERE rp.role_id = '5d415ea6-84dd-490a-b790-b8f5a314c47e' 
    AND rp.permission_id = (SELECT permission_id FROM auth.permissions WHERE action = 'MESSAGES_MENU')
);

-- Add MESSAGES_MENU permission to Senior Counsellor role
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
SELECT '6563c720-a750-44cc-b3a4-79c1aaa2abe4', permission_id, 'ADMIN', 'ADMIN'
FROM auth.permissions 
WHERE action = 'MESSAGES_MENU'
AND NOT EXISTS (
    SELECT 1 FROM auth.role_permissions rp 
    WHERE rp.role_id = '6563c720-a750-44cc-b3a4-79c1aaa2abe4' 
    AND rp.permission_id = (SELECT permission_id FROM auth.permissions WHERE action = 'MESSAGES_MENU')
);
