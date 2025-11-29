-- Grant Manager role access to Loans/Scholarships Management menus
-- and remove Overview menu permissions to avoid duplicates

-- Manager role id
-- 4ccb49d7-359b-45bd-b24b-1a337c7bd458

-- Permission ids
-- Loans Management Menu:        3b1525bf-fa69-4cc2-80d7-5c2b83c17c40
-- Scholarships Management Menu: 60f3009f-7273-479d-9f4b-ae1db437129d
-- Loans Overview Menu:          79087d74-f687-4159-8b61-8c2ef0109dda
-- Scholarships Overview Menu:   1c1e46de-fbe5-4d27-adc6-8a46536fb85e

-- Add management menu permissions to Manager
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
SELECT '4ccb49d7-359b-45bd-b24b-1a337c7bd458', '3b1525bf-fa69-4cc2-80d7-5c2b83c17c40', 'ADMIN', 'ADMIN'
WHERE NOT EXISTS (
  SELECT 1 FROM auth.role_permissions
  WHERE role_id = '4ccb49d7-359b-45bd-b24b-1a337c7bd458'
    AND permission_id = '3b1525bf-fa69-4cc2-80d7-5c2b83c17c40'
);

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
SELECT '4ccb49d7-359b-45bd-b24b-1a337c7bd458', '60f3009f-7273-479d-9f4b-ae1db437129d', 'ADMIN', 'ADMIN'
WHERE NOT EXISTS (
  SELECT 1 FROM auth.role_permissions
  WHERE role_id = '4ccb49d7-359b-45bd-b24b-1a337c7bd458'
    AND permission_id = '60f3009f-7273-479d-9f4b-ae1db437129d'
);

-- Remove overview menu permissions for Manager (optional)
DELETE FROM auth.role_permissions
WHERE role_id = '4ccb49d7-359b-45bd-b24b-1a337c7bd458'
  AND permission_id IN (
    '79087d74-f687-4159-8b61-8c2ef0109dda', -- Loans Overview Menu
    '1c1e46de-fbe5-4d27-adc6-8a46536fb85e'  -- Scholarships Overview Menu
  );


