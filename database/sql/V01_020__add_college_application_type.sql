-- Add COLLEGE as a valid application type
-- This migration updates the check constraint to allow COLLEGE applications

-- First, drop the existing check constraint
ALTER TABLE applications.applications DROP CONSTRAINT IF EXISTS chk_application_type;

-- Add the new check constraint that includes COLLEGE
ALTER TABLE applications.applications 
ADD CONSTRAINT chk_application_type 
CHECK (application_type IN ('LOAN', 'SCHOLARSHIP', 'COLLEGE'));

-- Add a comment to document the change
COMMENT ON CONSTRAINT chk_application_type ON applications.applications IS 'Ensures application_type is one of: LOAN, SCHOLARSHIP, or COLLEGE';
