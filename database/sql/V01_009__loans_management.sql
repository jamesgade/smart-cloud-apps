-- Ensure the schema exists
CREATE SCHEMA IF NOT EXISTS common;

-- Drop existing loans table if it exists (to recreate with correct structure)
DROP TABLE IF EXISTS common.loans CASCADE;

-- Create loans table with correct structure
CREATE TABLE common.loans (
    loan_id uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    bank_name varchar(255) NOT NULL, -- Name of the bank or NBFC
    loan_amount_min decimal(15,2), -- Minimum loan amount
    loan_amount_max decimal(15,2), -- Maximum loan amount
    coverage_details text, -- What the loan covers (tuition, hostel, books, travel, etc.)
    interest_rate decimal(5,2), -- Rate of interest
    interest_type varchar(20) DEFAULT 'FIXED', -- FIXED or FLOATING
    moratorium_period_months integer, -- Moratorium period in months
    repayment_duration_months integer, -- Repayment duration in months
    eligibility_criteria text, -- Who can apply - citizenship, admission status, course type, co-applicant requirements
    collateral_required boolean DEFAULT false, -- Whether collateral is needed
    collateral_threshold_amount decimal(15,2), -- Threshold amount for collateral
    guarantor_required boolean DEFAULT false, -- Whether guarantor is needed
    overall_remarks text, -- Short summary of advantages, key features, or special schemes
    is_active boolean DEFAULT true NOT NULL,
    created_by varchar(150) NOT NULL,
    updated_by varchar(150) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_loans_bank_name ON common.loans(bank_name);
CREATE INDEX IF NOT EXISTS idx_loans_is_active ON common.loans(is_active);
CREATE INDEX IF NOT EXISTS idx_loans_interest_rate ON common.loans(interest_rate);
CREATE INDEX IF NOT EXISTS idx_loans_loan_id ON common.loans(loan_id);
CREATE INDEX IF NOT EXISTS idx_loans_created_at ON common.loans(created_at);
CREATE INDEX IF NOT EXISTS idx_loans_updated_at ON common.loans(updated_at);

-- Insert sample loan data
INSERT INTO common.loans (
    bank_name,
    loan_amount_min,
    loan_amount_max,
    coverage_details,
    interest_rate,
    interest_type,
    moratorium_period_months,
    repayment_duration_months,
    eligibility_criteria,
    collateral_required,
    collateral_threshold_amount,
    guarantor_required,
    overall_remarks,
    created_by,
    updated_by
) VALUES 
(
    'State Bank of India (SBI)',
    50000,
    2000000,
    'Covers tuition fees, hostel fees, books, equipment, and other educational expenses',
    8.50,
    'FIXED',
    12,
    180,
    'Indian citizen, admitted to recognized institution, co-applicant required for loans above ₹7.5 lakhs',
    false,
    0,
    true,
    'Lowest interest rates, flexible repayment options, no processing fee for loans up to ₹7.5 lakhs',
    'ADMIN',
    'ADMIN'
),
(
    'HDFC Credila',
    100000,
    1500000,
    'Covers tuition fees, living expenses, books, laptop, and travel expenses',
    9.25,
    'FLOATING',
    6,
    120,
    'Indian citizen, admitted to recognized institution, co-applicant required for all loans',
    false,
    0,
    true,
    'Quick approval process, online application, competitive rates for engineering and medical courses',
    'ADMIN',
    'ADMIN'
),
(
    'Canara Bank',
    25000,
    1000000,
    'Covers tuition fees, hostel fees, books, and other academic expenses',
    8.75,
    'FIXED',
    12,
    180,
    'Indian citizen, admitted to recognized institution, co-applicant required for loans above ₹4 lakhs',
    true,
    500000,
    true,
    'Government bank reliability, flexible repayment, special schemes for SC/ST students',
    'ADMIN',
    'ADMIN'
),
(
    'Axis Bank',
    50000,
    2000000,
    'Covers tuition fees, living expenses, books, equipment, and travel',
    9.00,
    'FLOATING',
    6,
    180,
    'Indian citizen, admitted to recognized institution, co-applicant required for loans above ₹5 lakhs',
    false,
    0,
    true,
    'Digital application process, quick disbursement, special rates for premier institutions',
    'ADMIN',
    'ADMIN'
),
(
    'ICICI Bank',
    100000,
    1500000,
    'Covers tuition fees, living expenses, books, laptop, and other educational needs',
    9.50,
    'FLOATING',
    6,
    120,
    'Indian citizen, admitted to recognized institution, co-applicant required for all loans',
    false,
    0,
    true,
    'Online application, quick approval, competitive rates for top-tier institutions',
    'ADMIN',
    'ADMIN'
);

-- Insert permissions for loan management
INSERT INTO auth.permissions (
    permission_id,
    name,
    created_by,
    updated_by,
    description,
    action,
    condition,
    object_id,
    request_method,
    override_object_url,
    path
) VALUES 
(
    'f1a2b3c4-d5e6-4789-a1b2-c3d4e5f6a7b8',
    'Create Loan',
    'ADMIN',
    'ADMIN',
    'Create Loan',
    'CREATE_LOAN',
    NULL,
    'a1bbb4f9-ad0e-4600-881d-b59db667c956',
    'POST',
    false,
    '/api/loans'
),
(
    'f2a3b4c5-d6e7-4789-a2b3-c4d5e6f7a8b9',
    'Update Loan',
    'ADMIN',
    'ADMIN',
    'Update Loan',
    'UPDATE_LOAN',
    NULL,
    'a1bbb4f9-ad0e-4600-881d-b59db667c956',
    'PUT',
    false,
    '/api/loans'
),
(
    'f3a4b5c6-d7e8-4789-a3b4-c5d6e7f8a9b0',
    'Delete Loan',
    'ADMIN',
    'ADMIN',
    'Delete Loan',
    'DELETE_LOAN',
    NULL,
    'a1bbb4f9-ad0e-4600-881d-b59db667c956',
    'DELETE',
    false,
    '/api/loans'
),
(
    'f4a5b6c7-d8e9-4789-a4b5-c6d7e8f9a0b1',
    'Loans Management Menu',
    'ADMIN',
    'ADMIN',
    'Loans Management Menu',
    'LOANS_MANAGEMENT_MENU',
    NULL,
    'a1bbb4f9-ad0e-4600-881d-b59db667c956',
    'GET',
    false,
    '/loans-management'
);

-- Assign permissions to admin role
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES 
('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'f1a2b3c4-d5e6-4789-a1b2-c3d4e5f6a7b8', 'ADMIN', 'ADMIN'), -- Create Loan
('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'f2a3b4c5-d6e7-4789-a2b3-c4d5e6f7a8b9', 'ADMIN', 'ADMIN'), -- Update Loan
('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'f3a4b5c6-d7e8-4789-a3b4-c5d6e7f8a9b0', 'ADMIN', 'ADMIN'), -- Delete Loan
('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'f4a5b6c7-d8e9-4789-a4b5-c6d7e8f9a0b1', 'ADMIN', 'ADMIN'); -- Loans Management Menu
