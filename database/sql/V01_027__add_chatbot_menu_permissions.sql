-- Add chatbot menu permissions
-- This migration adds the CHATBOT_MENU permission and assigns it to relevant roles

-- Insert the CHATBOT_MENU permission
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
           'Chatbot Menu',
           'ADMIN',
           'ADMIN',
           'Access to view chatbot responses and sessions',
           'CHATBOT_MENU',
           NULL,
           'a1bbb4f9-ad0e-4600-881d-b59db667c956', -- Default object_id
           'GET',
           false,
           '/chat/sessions'
WHERE NOT EXISTS (
    SELECT 1 FROM auth.permissions WHERE action = 'CHATBOT_MENU'
);

-- Assign CHATBOT_MENU permission to Admin role
INSERT INTO auth.role_permissions
          (role_permission_id,
           role_id,
           permission_id,
           created_by,
           updated_by,
           created_at,
           updated_at)
SELECT    gen_random_uuid(),
           r.role_id,
           p.permission_id,
           'ADMIN',
           'ADMIN',
           CURRENT_TIMESTAMP,
           CURRENT_TIMESTAMP
FROM auth.roles r
CROSS JOIN auth.permissions p
WHERE r."name" = 'Admin' 
  AND p.action = 'CHATBOT_MENU'
  AND NOT EXISTS (
    SELECT 1 FROM auth.role_permissions rp 
    WHERE rp.role_id = r.role_id AND rp.permission_id = p.permission_id
  );

-- Assign CHATBOT_MENU permission to Super Admin role
INSERT INTO auth.role_permissions
          (role_permission_id,
           role_id,
           permission_id,
           created_by,
           updated_by,
           created_at,
           updated_at)
SELECT    gen_random_uuid(),
           r.role_id,
           p.permission_id,
           'ADMIN',
           'ADMIN',
           CURRENT_TIMESTAMP,
           CURRENT_TIMESTAMP
FROM auth.roles r
CROSS JOIN auth.permissions p
WHERE r."name" = 'Super Admin' 
  AND p.action = 'CHATBOT_MENU'
  AND NOT EXISTS (
    SELECT 1 FROM auth.role_permissions rp 
    WHERE rp.role_id = r.role_id AND rp.permission_id = p.permission_id
  );

-- Assign CHATBOT_MENU permission to Manager role
INSERT INTO auth.role_permissions
          (role_permission_id,
           role_id,
           permission_id,
           created_by,
           updated_by,
           created_at,
           updated_at)
SELECT    gen_random_uuid(),
           r.role_id,
           p.permission_id,
           'ADMIN',
           'ADMIN',
           CURRENT_TIMESTAMP,
           CURRENT_TIMESTAMP
FROM auth.roles r
CROSS JOIN auth.permissions p
WHERE r."name" = 'Manager' 
  AND p.action = 'CHATBOT_MENU'
  AND NOT EXISTS (
    SELECT 1 FROM auth.role_permissions rp 
    WHERE rp.role_id = r.role_id AND rp.permission_id = p.permission_id
  );

-- Assign CHATBOT_MENU permission to Senior Counsellor role
INSERT INTO auth.role_permissions
          (role_permission_id,
           role_id,
           permission_id,
           created_by,
           updated_by,
           created_at,
           updated_at)
SELECT    gen_random_uuid(),
           r.role_id,
           p.permission_id,
           'ADMIN',
           'ADMIN',
           CURRENT_TIMESTAMP,
           CURRENT_TIMESTAMP
FROM auth.roles r
CROSS JOIN auth.permissions p
WHERE r."name" = 'Senior Counsellor' 
  AND p.action = 'CHATBOT_MENU'
  AND NOT EXISTS (
    SELECT 1 FROM auth.role_permissions rp 
    WHERE rp.role_id = r.role_id AND rp.permission_id = p.permission_id
  );

-- Assign CHATBOT_MENU permission to Counsellor role
INSERT INTO auth.role_permissions
          (role_permission_id,
           role_id,
           permission_id,
           created_by,
           updated_by,
           created_at,
           updated_at)
SELECT    gen_random_uuid(),
           r.role_id,
           p.permission_id,
           'ADMIN',
           'ADMIN',
           CURRENT_TIMESTAMP,
           CURRENT_TIMESTAMP
FROM auth.roles r
CROSS JOIN auth.permissions p
WHERE r."name" = 'Counsellor' 
  AND p.action = 'CHATBOT_MENU'
  AND NOT EXISTS (
    SELECT 1 FROM auth.role_permissions rp 
    WHERE rp.role_id = r.role_id AND rp.permission_id = p.permission_id
  );
