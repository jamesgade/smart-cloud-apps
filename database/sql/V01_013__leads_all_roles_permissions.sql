-- Add Leads Management permissions to all roles except Student
-- This allows all staff roles (Admin, Manager, Senior Counsellor, Counsellor) to access leads

-- Add LEADS_MENU permission to Admin role (if not already exists)
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
SELECT '589900b3-0413-4328-8859-e8c0ff3cc9b8', 'a9951df6-903a-498e-b9d7-a5ead0c87a17', 'ADMIN', 'ADMIN'
WHERE NOT EXISTS (
    SELECT 1 FROM auth.role_permissions 
    WHERE role_id = '589900b3-0413-4328-8859-e8c0ff3cc9b8' 
    AND permission_id = 'a9951df6-903a-498e-b9d7-a5ead0c87a17'
);

-- Add LEADS_MENU permission to Manager role
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
SELECT '4ccb49d7-359b-45bd-b24b-1a337c7bd458', 'a9951df6-903a-498e-b9d7-a5ead0c87a17', 'ADMIN', 'ADMIN'
WHERE NOT EXISTS (
    SELECT 1 FROM auth.role_permissions 
    WHERE role_id = '4ccb49d7-359b-45bd-b24b-1a337c7bd458' 
    AND permission_id = 'a9951df6-903a-498e-b9d7-a5ead0c87a17'
);

-- Add LEADS_MENU permission to Senior Counsellor role
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
SELECT '6563c720-a750-44cc-b3a4-79c1aaa2abe4', 'a9951df6-903a-498e-b9d7-a5ead0c87a17', 'ADMIN', 'ADMIN'
WHERE NOT EXISTS (
    SELECT 1 FROM auth.role_permissions 
    WHERE role_id = '6563c720-a750-44cc-b3a4-79c1aaa2abe4' 
    AND permission_id = 'a9951df6-903a-498e-b9d7-a5ead0c87a17'
);

-- Add LEADS_MENU permission to Counsellor role
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
SELECT '5d415ea6-84dd-490a-b790-b8f5a314c47e', 'a9951df6-903a-498e-b9d7-a5ead0c87a17', 'ADMIN', 'ADMIN'
WHERE NOT EXISTS (
    SELECT 1 FROM auth.role_permissions 
    WHERE role_id = '5d415ea6-84dd-490a-b790-b8f5a314c47e' 
    AND permission_id = 'a9951df6-903a-498e-b9d7-a5ead0c87a17'
);

-- Add LEADS_WALKINS_MENU permission to Admin role (if not already exists)
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
SELECT '589900b3-0413-4328-8859-e8c0ff3cc9b8', '8dbd9f7e-e98b-4036-9ed8-da95c0241a0c', 'ADMIN', 'ADMIN'
WHERE NOT EXISTS (
    SELECT 1 FROM auth.role_permissions 
    WHERE role_id = '589900b3-0413-4328-8859-e8c0ff3cc9b8' 
    AND permission_id = '8dbd9f7e-e98b-4036-9ed8-da95c0241a0c'
);

-- Add LEADS_WALKINS_MENU permission to Manager role
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
SELECT '4ccb49d7-359b-45bd-b24b-1a337c7bd458', '8dbd9f7e-e98b-4036-9ed8-da95c0241a0c', 'ADMIN', 'ADMIN'
WHERE NOT EXISTS (
    SELECT 1 FROM auth.role_permissions 
    WHERE role_id = '4ccb49d7-359b-45bd-b24b-1a337c7bd458' 
    AND permission_id = '8dbd9f7e-e98b-4036-9ed8-da95c0241a0c'
);

-- Add LEADS_WALKINS_MENU permission to Senior Counsellor role
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
SELECT '6563c720-a750-44cc-b3a4-79c1aaa2abe4', '8dbd9f7e-e98b-4036-9ed8-da95c0241a0c', 'ADMIN', 'ADMIN'
WHERE NOT EXISTS (
    SELECT 1 FROM auth.role_permissions 
    WHERE role_id = '6563c720-a750-44cc-b3a4-79c1aaa2abe4' 
    AND permission_id = '8dbd9f7e-e98b-4036-9ed8-da95c0241a0c'
);

-- Add LEADS_WALKINS_MENU permission to Counsellor role
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
SELECT '5d415ea6-84dd-490a-b790-b8f5a314c47e', '8dbd9f7e-e98b-4036-9ed8-da95c0241a0c', 'ADMIN', 'ADMIN'
WHERE NOT EXISTS (
    SELECT 1 FROM auth.role_permissions 
    WHERE role_id = '5d415ea6-84dd-490a-b790-b8f5a314c47e' 
    AND permission_id = '8dbd9f7e-e98b-4036-9ed8-da95c0241a0c'
);

-- Note: Student role ('85396e7c-1bf2-40cf-a03c-744fb6b9fa9f') is intentionally excluded
