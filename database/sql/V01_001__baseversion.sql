-- Enable UUID support
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';

-- Create schema
CREATE SCHEMA IF NOT EXISTS auth;
ALTER SCHEMA auth OWNER TO postgres;

-- ======================
-- USER TYPE TABLE
-- ======================
CREATE TABLE auth.user_type (
    user_type_id uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    "name" varchar(50) NOT NULL,
    created_by varchar(150) NOT NULL,
    updated_by varchar(150) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);


INSERT INTO auth.user_type (user_type_id, name, created_by, updated_by) 
VALUES
('9dc1aa09-92ca-4a78-b769-34be42a55780', 'Super Admin', 'system', 'system'),
('86f0ee54-485d-4a2a-87d2-5c0853764d41', 'Admin', 'system', 'system'),
('2a5982f2-0dd0-496d-9b93-5a0ebf032130', 'Student', 'system', 'system');

-- ======================
-- ROLES TABLE
-- ======================
CREATE TABLE auth.roles (
    role_id uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    "name" varchar(500) NOT NULL,
    created_by varchar(150) NOT NULL,
    updated_by varchar(150) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_type_id uuid NULL,
    description varchar(250) DEFAULT NULL,
    order_by int4 NULL,
    CONSTRAINT fk_roles_user_type_id FOREIGN KEY (user_type_id) REFERENCES auth.user_type(user_type_id)
);

INSERT INTO auth.roles (role_id, name, created_by, updated_by, user_type_id, description, order_by)
VALUES
('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'Admin', 'system', 'system', '9dc1aa09-92ca-4a78-b769-34be42a55780', 'Full system access and administration', 1),
('4ccb49d7-359b-45bd-b24b-1a337c7bd458', 'Manager', 'system', 'system', '86f0ee54-485d-4a2a-87d2-5c0853764d41', 'School level administration and management', 2),
('6563c720-a750-44cc-b3a4-79c1aaa2abe4', 'Senior Counsellor', 'system', 'system', '86f0ee54-485d-4a2a-87d2-5c0853764d41', 'Teaching and classroom management', 3),
('5d415ea6-84dd-490a-b790-b8f5a314c47e', 'Counsellor', 'system', 'system', '86f0ee54-485d-4a2a-87d2-5c0853764d41', 'Student access and learning', 4),
('85396e7c-1bf2-40cf-a03c-744fb6b9fa9f', 'Student', 'system', 'system', '2a5982f2-0dd0-496d-9b93-5a0ebf032130', 'Parent access to student information', 5);

-- ======================
-- USER TABLE
-- ======================
CREATE TABLE auth."user" (
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    user_type_id uuid NOT NULL,
    email varchar(500) NOT NULL,
    first_name varchar(50) NOT NULL,
    last_name varchar(50) NOT NULL,
    middle_initial varchar(150) NULL,
    is_all_schools bool DEFAULT false,
    is_mobile_mfa bool DEFAULT false,
    is_mobile_validate bool DEFAULT false,
    is_mfa bool DEFAULT false,
    signature text NULL,
    status varchar(150) DEFAULT NULL,
    created_by varchar(150) NOT NULL,
    updated_by varchar(150) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT user_valid_status CHECK (status IN ('ACTIVE','IN-ACTIVE','INVITATION-SENT')),
    CONSTRAINT fk_user_user_type_id FOREIGN KEY (user_type_id) REFERENCES auth.user_type(user_type_id)
);

-- Example user insertion
INSERT INTO auth.user
(user_id, user_type_id, email, first_name, last_name, middle_initial, is_all_schools, is_mobile_mfa, is_mobile_validate, is_mfa, signature, status, created_by, updated_by)
VALUES
(
    'f3a6c9e8-7d24-4b92-8c2f-1d7f5b2a9e4c',  
    '9dc1aa09-92ca-4a78-b769-34be42a55780',
    'manoj@ssplusitsol.com',
    'Manoj',
    'C',
    'Super Admin',          
    true,        
    false,         
    false,         
    false,        
    NULL,         
    'ACTIVE',    
    'f3a6c9e8-7d24-4b92-8c2f-1d7f5b2a9e4c',    
    'f3a6c9e8-7d24-4b92-8c2f-1d7f5b2a9e4c'     
);


-- (Indexes on auth.user instead of auth.user)
CREATE INDEX idx_user_is_all_schools ON auth."user" (is_all_schools);
CREATE INDEX idx_user_user_id ON auth."user" (user_id);

-- ======================
-- USER ASSIGN ROLES
-- ======================
CREATE TABLE auth.user_assign_roles (
    user_id uuid NOT NULL,
    role_id uuid NOT NULL,
    created_by varchar(150) NOT NULL,
    updated_by varchar(150) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT pk_user_assign_role PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_assign_roles_role_id FOREIGN KEY (role_id) REFERENCES auth.roles(role_id),
    CONSTRAINT fk_user_assign_roles_user_id FOREIGN KEY (user_id) REFERENCES auth."user"(user_id)
);

INSERT INTO auth.user_assign_roles (user_id, role_id, created_by, updated_by)
VALUES ('f3a6c9e8-7d24-4b92-8c2f-1d7f5b2a9e4c', '589900b3-0413-4328-8859-e8c0ff3cc9b8', 'f3a6c9e8-7d24-4b92-8c2f-1d7f5b2a9e4c', 'f3a6c9e8-7d24-4b92-8c2f-1d7f5b2a9e4c');

-- ======================
-- USER OTP
-- ======================
CREATE TABLE auth.user_otp (
    user_id uuid NOT NULL,
    current_otp varchar(6) NOT NULL,
    expiry_epoch int4 NOT NULL,
    created_by varchar(150) NOT NULL,
    updated_by varchar(150) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    otp_attempts int4 NULL,
    captcha varchar(4) DEFAULT NULL,
    CONSTRAINT pk_user_otp PRIMARY KEY (user_id),
    CONSTRAINT fk_user_otp_user_id FOREIGN KEY (user_id) REFERENCES auth."user"(user_id)

);

-- ======================
-- USER CONTACT INFO
-- ======================
CREATE TABLE auth.user_contact_info (
    user_contact_info_id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid NOT NULL,
    personal_email varchar(250) DEFAULT NULL,
    secondary_email_address varchar(250) DEFAULT NULL,
    street_address varchar(250) DEFAULT NULL,
    city varchar(250) DEFAULT NULL,
    state_id varchar(150) DEFAULT NULL,
    zip_code varchar(250) DEFAULT NULL,
    mobile_phone varchar(250) DEFAULT NULL,
    gender_id uuid NULL,
    dob timestamp NULL,
    emergency_contact_name varchar(250) DEFAULT NULL,
    emergency_contact_phone varchar(250) DEFAULT NULL,
    emergency_contact_relationship varchar(250) DEFAULT NULL,
    created_by varchar(150) NOT NULL,
    updated_by varchar(150) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_user_contact_info_user_id FOREIGN KEY (user_id) REFERENCES auth."user"(user_id)
);

-- ======================
-- USER REFRESH TOKEN
-- ======================
CREATE TABLE auth.user_refresh_token (
    user_id uuid NOT NULL,
    refreshtoken text NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    session_identifier character varying(150) DEFAULT uuid_generate_v4() NOT NULL
);

-- ======================
-- USER LOGIN HISTORY
-- ======================

CREATE TABLE auth.user_login_history (
user_login_history_id uuid DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
user_id uuid NULL,
student_id uuid NULL,
email varchar(500) DEFAULT NULL::character varying NULL,
app_name varchar(100) DEFAULT NULL::character varying NULL,
ip_address varchar(100) DEFAULT NULL::character varying NULL,
is_mobile bool DEFAULT false NULL,
status varchar(100) NOT NULL,
action_timestamp timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
log text NULL,
user_browser_info text NULL,
CONSTRAINT user_login_history_status_check CHECK (((status)::text = ANY (ARRAY[('IN-PROGRESS'::character varying)::text, ('PASSED'::character varying)::text, ('FAILED'::character varying)::text, ('LOGOUT'::character varying)::text, ('SESSION-VERIFIED'::character varying)::text, ('SESSION-VERIFIED-FAILED'::character varying)::text])))
);


-- student

CREATE SCHEMA IF NOT EXISTS student;

CREATE TABLE student.student (
    student_id uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    email varchar(500) NOT NULL,
    first_name varchar(50) NOT NULL,
    last_name varchar(50) NOT NULL,
    middle_initial varchar(150) NULL,
    mobile_phone varchar(10) NOT NULL,
    signature text NULL,
    user_type_id uuid NOT NULL,
    status varchar(150) DEFAULT NULL,
    created_by varchar(150) NOT NULL,
    updated_by varchar(150) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT student_valid_status CHECK (status IN ('ACTIVE','IN-ACTIVE')),
    CONSTRAINT fk_student_user_type_id FOREIGN KEY (user_type_id) REFERENCES auth.user_type(user_type_id)
);

CREATE TABLE student.course (
    course_id uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    name varchar(500) NOT NULL,
    description TEXT DEFAULT null,
    status boolean DEFAULT false,
    created_by varchar(150) NOT NULL,
    updated_by varchar(150) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
INSERT INTO student.course (name, description, status, created_by, updated_by)
VALUES
('Engineering', 'Undergraduate and postgraduate engineering courses like BTech, MTech, etc.', true, 'f3a6c9e8-7d24-4b92-8c2f-1d7f5b2a9e4c', 'f3a6c9e8-7d24-4b92-8c2f-1d7f5b2a9e4c'),
('Medicine', 'Medical courses including MBBS, MD, BDS, Nursing, and allied health.', true, 'f3a6c9e8-7d24-4b92-8c2f-1d7f5b2a9e4c', 'f3a6c9e8-7d24-4b92-8c2f-1d7f5b2a9e4c'),
('Business', 'Business courses including BBA, MBA, and other management programs.', true, 'f3a6c9e8-7d24-4b92-8c2f-1d7f5b2a9e4c', 'f3a6c9e8-7d24-4b92-8c2f-1d7f5b2a9e4c'),
('Arts', 'Arts courses like BA, MA, Fine Arts, Performing Arts, Literature.', true, 'f3a6c9e8-7d24-4b92-8c2f-1d7f5b2a9e4c', 'f3a6c9e8-7d24-4b92-8c2f-1d7f5b2a9e4c'),
('Science', 'Science courses including BSc, MSc, Physics, Chemistry, Biology, etc.', true, 'f3a6c9e8-7d24-4b92-8c2f-1d7f5b2a9e4c', 'f3a6c9e8-7d24-4b92-8c2f-1d7f5b2a9e4c'),
('Law', 'Law courses like LLB, LLM, and legal studies programs.', true, 'f3a6c9e8-7d24-4b92-8c2f-1d7f5b2a9e4c', 'f3a6c9e8-7d24-4b92-8c2f-1d7f5b2a9e4c'),
('Education', 'Teacher training and education programs like BEd, MEd.', true, 'f3a6c9e8-7d24-4b92-8c2f-1d7f5b2a9e4c', 'f3a6c9e8-7d24-4b92-8c2f-1d7f5b2a9e4c'),
('Computer Science', 'CS courses including BSc CS, BTech CS, MSc CS, Data Science.', true, 'f3a6c9e8-7d24-4b92-8c2f-1d7f5b2a9e4c', 'f3a6c9e8-7d24-4b92-8c2f-1d7f5b2a9e4c'),
('Pharmacy', 'Pharmacy courses like BPharm, MPharm, and related programs.', true, 'f3a6c9e8-7d24-4b92-8c2f-1d7f5b2a9e4c', 'f3a6c9e8-7d24-4b92-8c2f-1d7f5b2a9e4c'),
('Architecture', 'Architecture and design courses like BArch, MArch.', true, 'f3a6c9e8-7d24-4b92-8c2f-1d7f5b2a9e4c', 'f3a6c9e8-7d24-4b92-8c2f-1d7f5b2a9e4c'),
('Hospitality', 'Hospitality and tourism management courses like BHM, MBA Hospitality.', true, 'f3a6c9e8-7d24-4b92-8c2f-1d7f5b2a9e4c', 'f3a6c9e8-7d24-4b92-8c2f-1d7f5b2a9e4c'),
('Social Work', 'Social work and development courses like BSW, MSW.', true, 'f3a6c9e8-7d24-4b92-8c2f-1d7f5b2a9e4c', 'f3a6c9e8-7d24-4b92-8c2f-1d7f5b2a9e4c'),
('Design', 'Design courses like Fashion Design, Graphic Design, Product Design.', true, 'f3a6c9e8-7d24-4b92-8c2f-1d7f5b2a9e4c', 'f3a6c9e8-7d24-4b92-8c2f-1d7f5b2a9e4c'),
('Journalism', 'Journalism and mass communication courses like BJMC, MJMC.', true, 'f3a6c9e8-7d24-4b92-8c2f-1d7f5b2a9e4c', 'f3a6c9e8-7d24-4b92-8c2f-1d7f5b2a9e4c'),
('Agriculture', 'Agricultural sciences courses like BSc Agriculture, MSc Agriculture.', true, 'f3a6c9e8-7d24-4b92-8c2f-1d7f5b2a9e4c', 'f3a6c9e8-7d24-4b92-8c2f-1d7f5b2a9e4c');



-- otp
CREATE TABLE auth.student_otp (
    student_otp_id uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    student_id uuid NULL,
    mobile_phone varchar(10) NOT NULL,
    current_otp varchar(6) NOT NULL,
    expiry_epoch int4 NOT NULL,
    created_by varchar(150) NOT NULL,
    updated_by varchar(150) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    otp_attempts int4 NULL,
    captcha varchar(4) DEFAULT NULL,
    CONSTRAINT fk_student_otp_user_id FOREIGN KEY (student_id) REFERENCES student.student(student_id)
);


CREATE TABLE student.student_assign_course (
    student_id uuid NOT NULL,
    course_id uuid NOT NULL,
    created_by varchar(150) NOT NULL,
    updated_by varchar(150) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT pk_student_assign_course PRIMARY KEY (student_id, course_id),
    CONSTRAINT fk_student_assign_course_id FOREIGN KEY (course_id) REFERENCES student.course(course_id),
    CONSTRAINT fk_student_assign_student_id FOREIGN KEY (student_id) REFERENCES student.student(student_id)
);

CREATE TABLE student.student_assign_roles (
    student_id uuid NOT NULL,
    role_id uuid NOT NULL,
    created_by varchar(150) NOT NULL,
    updated_by varchar(150) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT pk_student_assign_roles PRIMARY KEY (student_id, role_id),
    CONSTRAINT fk_student_assign_role_id FOREIGN KEY (role_id) REFERENCES auth.roles(role_id),
    CONSTRAINT fk_student_assign_student_id FOREIGN KEY (student_id) REFERENCES student.student(student_id)
);