-- V01_019__colleges_enhanced_fields.sql
-- Add 20 essential fields to colleges table for comprehensive college information

-- Add Academic & Admission fields (Priority 1)
ALTER TABLE common.colleges ADD COLUMN IF NOT EXISTS courses_offered text[];
ALTER TABLE common.colleges ADD COLUMN IF NOT EXISTS entrance_exams varchar(500)[];
ALTER TABLE common.colleges ADD COLUMN IF NOT EXISTS cutoff_percentile decimal(5,2);
ALTER TABLE common.colleges ADD COLUMN IF NOT EXISTS application_deadline date;
ALTER TABLE common.colleges ADD COLUMN IF NOT EXISTS minimum_percentage decimal(5,2);

-- Add Financial Information fields (Priority 2)
ALTER TABLE common.colleges ADD COLUMN IF NOT EXISTS tuition_fee_yearly decimal(10,2);
ALTER TABLE common.colleges ADD COLUMN IF NOT EXISTS hostel_fee_yearly decimal(10,2);
ALTER TABLE common.colleges ADD COLUMN IF NOT EXISTS total_fee_yearly decimal(10,2);
ALTER TABLE common.colleges ADD COLUMN IF NOT EXISTS scholarships_available boolean DEFAULT false;
ALTER TABLE common.colleges ADD COLUMN IF NOT EXISTS loan_facilities boolean DEFAULT false;

-- Add Infrastructure & Facilities fields (Priority 3)
ALTER TABLE common.colleges ADD COLUMN IF NOT EXISTS campus_size_acres decimal(8,2);
ALTER TABLE common.colleges ADD COLUMN IF NOT EXISTS hostel_facility boolean DEFAULT false;
ALTER TABLE common.colleges ADD COLUMN IF NOT EXISTS library_books_count integer;
ALTER TABLE common.colleges ADD COLUMN IF NOT EXISTS laboratories_count integer;
ALTER TABLE common.colleges ADD COLUMN IF NOT EXISTS wifi_facility boolean DEFAULT false;

-- Add Student Statistics & Placement fields (Priority 4)
ALTER TABLE common.colleges ADD COLUMN IF NOT EXISTS total_students integer;
ALTER TABLE common.colleges ADD COLUMN IF NOT EXISTS faculty_count integer;
ALTER TABLE common.colleges ADD COLUMN IF NOT EXISTS placement_percentage decimal(5,2);
ALTER TABLE common.colleges ADD COLUMN IF NOT EXISTS average_salary decimal(10,2);
ALTER TABLE common.colleges ADD COLUMN IF NOT EXISTS top_recruiters text[];

-- Add comments for documentation
COMMENT ON COLUMN common.colleges.courses_offered IS 'Array of courses/programs offered by the college';
COMMENT ON COLUMN common.colleges.entrance_exams IS 'Array of entrance exams accepted (JEE, NEET, CAT, etc.)';
COMMENT ON COLUMN common.colleges.cutoff_percentile IS 'Minimum percentile required for admission';
COMMENT ON COLUMN common.colleges.application_deadline IS 'Last date to submit application';
COMMENT ON COLUMN common.colleges.minimum_percentage IS 'Minimum percentage required for eligibility';
COMMENT ON COLUMN common.colleges.tuition_fee_yearly IS 'Annual tuition fee in INR';
COMMENT ON COLUMN common.colleges.hostel_fee_yearly IS 'Annual hostel fee in INR';
COMMENT ON COLUMN common.colleges.total_fee_yearly IS 'Total annual fee including all charges';
COMMENT ON COLUMN common.colleges.scholarships_available IS 'Whether scholarships are available';
COMMENT ON COLUMN common.colleges.loan_facilities IS 'Whether education loan facilities are available';
COMMENT ON COLUMN common.colleges.campus_size_acres IS 'Campus size in acres';
COMMENT ON COLUMN common.colleges.hostel_facility IS 'Whether hostel facility is available';
COMMENT ON COLUMN common.colleges.library_books_count IS 'Number of books in library';
COMMENT ON COLUMN common.colleges.laboratories_count IS 'Number of laboratories';
COMMENT ON COLUMN common.colleges.wifi_facility IS 'Whether WiFi facility is available';
COMMENT ON COLUMN common.colleges.total_students IS 'Total number of students';
COMMENT ON COLUMN common.colleges.faculty_count IS 'Number of faculty members';
COMMENT ON COLUMN common.colleges.placement_percentage IS 'Percentage of students placed';
COMMENT ON COLUMN common.colleges.average_salary IS 'Average salary offered in INR';
COMMENT ON COLUMN common.colleges.top_recruiters IS 'Array of top recruiting companies';
