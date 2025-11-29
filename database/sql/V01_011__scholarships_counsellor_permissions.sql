-- Add Scholarships Management permissions to Counsellor roles
-- This allows counsellors to access scholarships management just like loans management

-- Add SCHOLARSHIPS_MANAGEMENT_MENU permission to Senior Counsellor role
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES
('6563c720-a750-44cc-b3a4-79c1aaa2abe4', 'e1a2b3c4-d5e6-4789-a1b2-c3d4e5f6a7b8', 'ADMIN', 'ADMIN'), -- Create Scholarship
('6563c720-a750-44cc-b3a4-79c1aaa2abe4', 'e2a3b4c5-d6e7-4789-a2b3-c4d5e6f7a8b9', 'ADMIN', 'ADMIN'), -- Update Scholarship
('6563c720-a750-44cc-b3a4-79c1aaa2abe4', 'e3a4b5c6-d7e8-4789-a3b4-c5d6e7f8a9b0', 'ADMIN', 'ADMIN'), -- Delete Scholarship
('6563c720-a750-44cc-b3a4-79c1aaa2abe4', 'e4a5b6c7-d8e9-4789-a4b5-c6d7e8f9a0b1', 'ADMIN', 'ADMIN'); -- Scholarships Management Menu

-- Add SCHOLARSHIPS_MANAGEMENT_MENU permission to Counsellor role
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES
('5d415ea6-84dd-490a-b790-b8f5a314c47e', 'e1a2b3c4-d5e6-4789-a1b2-c3d4e5f6a7b8', 'ADMIN', 'ADMIN'), -- Create Scholarship
('5d415ea6-84dd-490a-b790-b8f5a314c47e', 'e2a3b4c5-d6e7-4789-a2b3-c4d5e6f7a8b9', 'ADMIN', 'ADMIN'), -- Update Scholarship
('5d415ea6-84dd-490a-b790-b8f5a314c47e', 'e3a4b5c6-d7e8-4789-a3b4-c5d6e7f8a9b0', 'ADMIN', 'ADMIN'), -- Delete Scholarship
('5d415ea6-84dd-490a-b790-b8f5a314c47e', 'e4a5b6c7-d8e9-4789-a4b5-c6d7e8f9a0b1', 'ADMIN', 'ADMIN'); -- Scholarships Management Menu
