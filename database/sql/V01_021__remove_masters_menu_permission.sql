-- Remove Masters Menu permission and its role assignments
-- This migration removes the MASTERS_MENU permission since the Masters menu item has been removed

-- First, remove the role permission assignment
DELETE FROM auth.role_permissions 
WHERE permission_id = 'dfc5b379-c8d9-493a-a688-b63379e49530';

-- Then, remove the permission itself
DELETE FROM auth.permissions 
WHERE permission_id = 'dfc5b379-c8d9-493a-a688-b63379e49530';

-- Add a comment to document the change
COMMENT ON TABLE auth.permissions IS 'Permissions table - MASTERS_MENU permission removed as Masters menu item was removed from the application';
