-- Add Loans Management permissions to Counsellor roles
-- This allows counsellors to access loans management with full CRUD operations

-- Add LOANS_MANAGEMENT permissions to Senior Counsellor role
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES
('6563c720-a750-44cc-b3a4-79c1aaa2abe4', 'f1a2b3c4-d5e6-4789-a1b2-c3d4e5f6a7b8', 'ADMIN', 'ADMIN'), -- Create Loan
('6563c720-a750-44cc-b3a4-79c1aaa2abe4', 'f2a3b4c5-d6e7-4789-a2b3-c4d5e6f7a8b9', 'ADMIN', 'ADMIN'), -- Update Loan
('6563c720-a750-44cc-b3a4-79c1aaa2abe4', 'f3a4b5c6-d7e8-4789-a3b4-c5d6e7f8a9b0', 'ADMIN', 'ADMIN'), -- Delete Loan
('6563c720-a750-44cc-b3a4-79c1aaa2abe4', 'f4a5b6c7-d8e9-4789-a4b5-c6d7e8f9a0b1', 'ADMIN', 'ADMIN'); -- Loans Management Menu

-- Add LOANS_MANAGEMENT permissions to Counsellor role
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES
('5d415ea6-84dd-490a-b790-b8f5a314c47e', 'f1a2b3c4-d5e6-4789-a1b2-c3d4e5f6a7b8', 'ADMIN', 'ADMIN'), -- Create Loan
('5d415ea6-84dd-490a-b790-b8f5a314c47e', 'f2a3b4c5-d6e7-4789-a2b3-c4d5e6f7a8b9', 'ADMIN', 'ADMIN'), -- Update Loan
('5d415ea6-84dd-490a-b790-b8f5a314c47e', 'f3a4b5c6-d7e8-4789-a3b4-c5d6e7f8a9b0', 'ADMIN', 'ADMIN'), -- Delete Loan
('5d415ea6-84dd-490a-b790-b8f5a314c47e', 'f4a5b6c7-d8e9-4789-a4b5-c6d7e8f9a0b1', 'ADMIN', 'ADMIN'); -- Loans Management Menu
