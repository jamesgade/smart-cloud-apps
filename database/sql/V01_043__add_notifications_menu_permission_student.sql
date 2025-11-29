-- Add NOTIFICATIONS_ALERTS_MENU permission to Student role
-- This allows students to see the Notifications menu item in the frontend

-- Add NOTIFICATIONS_ALERTS_MENU permission to Student role
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
SELECT '85396e7c-1bf2-40cf-a03c-744fb6b9fa9f', permission_id, 'ADMIN', 'ADMIN'
FROM auth.permissions 
WHERE action = 'NOTIFICATIONS_ALERTS_MENU'
AND NOT EXISTS (
    SELECT 1 FROM auth.role_permissions rp 
    WHERE rp.role_id = '85396e7c-1bf2-40cf-a03c-744fb6b9fa9f' 
    AND rp.permission_id = (SELECT permission_id FROM auth.permissions WHERE action = 'NOTIFICATIONS_ALERTS_MENU')
);

