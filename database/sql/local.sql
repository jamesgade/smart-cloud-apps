-- =====================================================
-- LOCAL.SQL - Combined Migration Scripts
-- This file contains all SQL migration scripts in order
-- =====================================================

-- =====================================================
-- V01_001__baseversion.sql
-- =====================================================
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

-- =====================================================
-- V01_002__chatbot.sql
-- =====================================================
-- Chatbot schema and tables
CREATE SCHEMA IF NOT EXISTS chat;

-- Questions table
CREATE TABLE IF NOT EXISTS chat.chat_question (
  question_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(100) NOT NULL UNIQUE,
  text VARCHAR(1000) NOT NULL,
  question_type VARCHAR(50) NOT NULL DEFAULT 'text', -- text | select
  options_json JSONB NULL, -- for select: [{ value, label, nextQuestionCode? }]
  order_by INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS chat_question_active_idx ON chat.chat_question(active);
CREATE INDEX IF NOT EXISTS chat_question_order_idx ON chat.chat_question(order_by);

-- Chat sessions
CREATE TABLE IF NOT EXISTS chat.chat_session (
  session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mobile VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active', -- active | completed | abandoned
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS chat_session_mobile_idx ON chat.chat_session(mobile);

-- Chat responses
CREATE TABLE IF NOT EXISTS chat.chat_response (
  response_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES chat.chat_session(session_id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES chat.chat_question(question_id) ON DELETE CASCADE,
  answer_text TEXT NULL,
  answer_value VARCHAR(255) NULL, -- when select option chosen
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS chat_response_session_idx ON chat.chat_response(session_id);
CREATE INDEX IF NOT EXISTS chat_response_question_idx ON chat.chat_response(question_id);

-- Seed basic questions for +12 stream enquiry
INSERT INTO chat.chat_question (code, text, question_type, options_json, order_by)
VALUES
  ('welcome', 'Welcome! Please enter your mobile number to begin.', 'text', NULL, 1),
  ('course_category', 'Which course category are you interested in?', 'select',
    '[{"value":"MBBS","label":"MBBS"},{"value":"BDS","label":"BDS"},{"value":"ENGINEERING","label":"Engineering"},{"value":"LAW","label":"Law"},{"value":"OTHER","label":"Other"}]',
    2)
ON CONFLICT (code) DO NOTHING;



-- =====================================================
-- V01_003__chatbot_seed_admission_questions.sql
-- =====================================================
-- Seed additional admission questions and options
INSERT INTO chat.chat_question (code, text, question_type, options_json, order_by)
VALUES
  ('student_name', 'What is your full name?', 'text', NULL, 3),
  ('preferred_location', 'Preferred study location?', 'select',
    '[{"value":"ANY","label":"Any"},{"value":"TIER_1","label":"Metro/Tier-1"},{"value":"TIER_2","label":"Tier-2/3"}]', 4),
  ('budget', 'Approximate annual tuition budget (INR)?', 'select',
    '[{"value":"<1L","label":"Below 1L"},{"value":"1-3L","label":"1L - 3L"},{"value":"3-6L","label":"3L - 6L"},{"value":">6L","label":"Above 6L"}]', 5),
  ('exam_rank', 'Have you written any entrance exam? Mention exam and rank/score.', 'text', NULL, 6),
  ('need_hostel', 'Do you need hostel/accommodation?', 'select',
    '[{"value":"YES","label":"Yes"},{"value":"NO","label":"No"}]', 7),
  ('need_scholarship', 'Do you want scholarship guidance?', 'select',
    '[{"value":"YES","label":"Yes"},{"value":"NO","label":"No"}]', 8),
  ('final_thanks', 'Thanks! Our counselor will contact you with suitable colleges.', 'text', NULL, 99)
ON CONFLICT (code) DO NOTHING;



-- =====================================================
-- V01_004__permission.sql
-- =====================================================
CREATE TABLE auth.permission_objects (
    permission_object_id UUID DEFAULT uuid_generate_v4() NOT NULL,
    name VARCHAR(100) NOT NULL,
    request_url VARCHAR(100) NOT NULL,
    created_by VARCHAR(150) NOT NULL,
    updated_by VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT objects_pkey PRIMARY KEY (permission_object_id)
);

CREATE TABLE auth.permissions (
    permission_id UUID DEFAULT uuid_generate_v4() NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_by VARCHAR(150) NOT NULL,
    updated_by VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    description VARCHAR NULL,
    action VARCHAR(100) NOT NULL,
    condition VARCHAR(100) NULL,
    object_id UUID NOT NULL,
    request_method VARCHAR(100) NOT NULL,
    override_object_url BOOLEAN DEFAULT FALSE NULL,
    path VARCHAR(100) NOT NULL,
    CONSTRAINT permissions_pkey PRIMARY KEY (permission_id),
    CONSTRAINT fk_permissions_object_id FOREIGN KEY (object_id)
        REFERENCES auth.permission_objects(permission_object_id)
);

CREATE TABLE auth.role_permissions (
    role_permission_id UUID DEFAULT uuid_generate_v4() NOT NULL,
    role_id UUID NOT NULL,
    permission_id UUID NOT NULL,
    created_by VARCHAR(150) NOT NULL,
    updated_by VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT role_permissions_pkey PRIMARY KEY (role_permission_id),
    CONSTRAINT fk_role_permissions_permission_id FOREIGN KEY (permission_id)
        REFERENCES auth.permissions(permission_id),
    CONSTRAINT fk_role_permissions_role_id FOREIGN KEY (role_id)
        REFERENCES auth.roles(role_id)
);


INSERT INTO auth.permission_objects
            (permission_object_id,
             NAME,
             request_url,
             created_by,
             updated_by)
VALUES      ('a1bbb4f9-ad0e-4600-881d-b59db667c956',
             'Users',
             '/portal-api/provider',
             'ADMIN',
             'ADMIN');

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
VALUES    ('07ef05da-d98b-4284-889d-4eeac3684455',
           'Dashboard Menu',
           'ADMIN',
           'ADMIN',
           'dashboard menu',
           'DASHBOARD_MENU',
           NULL,
           'a1bbb4f9-ad0e-4600-881d-b59db667c956',
           '',
           false,
           '');

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
VALUES    ('ca0059f0-0d69-40cf-90b3-6cb10c9c228d',
           'User Management Menu',
           'ADMIN',
           'ADMIN',
           'user management menu',
           'USER_MANAGEMENT_MENU',
           NULL,
           'a1bbb4f9-ad0e-4600-881d-b59db667c956',
           '',
           false,
           '');

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
VALUES    ('a9951df6-903a-498e-b9d7-a5ead0c87a17',
           'Leads Menu',
           'ADMIN',
           'ADMIN',
           'leads menu',
           'LEADS_MENU',
           NULL,
           'a1bbb4f9-ad0e-4600-881d-b59db667c956',
           '',
           false,
           '');

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
VALUES    ('aa54ea46-bf1c-4e2f-be12-610a1efc1661',
           'Counselling Menu',
           'ADMIN',
           'ADMIN',
           'counselling menu',
           'COUNSELLING_MENU',
           NULL,
           'a1bbb4f9-ad0e-4600-881d-b59db667c956',
           '',
           false,
           '');

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
VALUES    ('7c2e1f62-c61f-44bc-9b64-cc4989502ba3',
           'Admissions Menu',
           'ADMIN',
           'ADMIN',
           'admissions menu',
           'ADMISSIONS_MENU',
           NULL,
           'a1bbb4f9-ad0e-4600-881d-b59db667c956',
           '',
           false,
           '');

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
VALUES    ('c1fcaaa9-14ab-4bc1-9bee-6d1c59ae930d',
           'Payments Menu',
           'ADMIN',
           'ADMIN',
           'payments menu',
           'PAYMENTS_MENU',
           NULL,
           'a1bbb4f9-ad0e-4600-881d-b59db667c956',
           '',
           false,
           '');

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
VALUES    ('3b1525bf-fa69-4cc2-80d7-5c2b83c17c40',
           'Loans Management Menu',
           'ADMIN',
           'ADMIN',
           'loans management menu',
           'LOANS_MANAGEMENT_MENU',
           NULL,
           'a1bbb4f9-ad0e-4600-881d-b59db667c956',
           '',
           false,
           '');

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
VALUES    ('60f3009f-7273-479d-9f4b-ae1db437129d',
           'Scholarships Management Menu',
           'ADMIN',
           'ADMIN',
           'scholarships management menu',
           'SCHOLARSHIPS_MANAGEMENT_MENU',
           NULL,
           'a1bbb4f9-ad0e-4600-881d-b59db667c956',
           '',
           false,
           '');

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
VALUES    ('457a842a-f0d7-4eed-8a09-f0a00d2cf27e',
           'Reports Menu',
           'ADMIN',
           'ADMIN',
           'reports menu',
           'REPORTS_MENU',
           NULL,
           'a1bbb4f9-ad0e-4600-881d-b59db667c956',
           '',
           false,
           '');

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
VALUES    ('dfc5b379-c8d9-493a-a688-b63379e49530',
           'Masters Menu',
           'ADMIN',
           'ADMIN',
           'masters menu',
           'MASTERS_MENU',
           NULL,
           'a1bbb4f9-ad0e-4600-881d-b59db667c956',
           '',
           false,
           '');

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
VALUES    ('9b2c0036-e743-4862-83e1-d3f6fbdff4b3',
           'Notifications Alerts Menu',
           'ADMIN',
           'ADMIN',
           'notifications alerts menu',
           'NOTIFICATIONS_ALERTS_MENU',
           NULL,
           'a1bbb4f9-ad0e-4600-881d-b59db667c956',
           '',
           false,
           '');

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
VALUES    ('79087d74-f687-4159-8b61-8c2ef0109dda',
           'Loans Overview Menu',
           'ADMIN',
           'ADMIN',
           'loans overview menu',
           'LOANS_OVERVIEW_MENU',
           NULL,
           'a1bbb4f9-ad0e-4600-881d-b59db667c956',
           '',
           false,
           '');

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
VALUES    ('1c1e46de-fbe5-4d27-adc6-8a46536fb85e',
           'Scholarships Overview Menu',
           'ADMIN',
           'ADMIN',
           'scholarships overview menu',
           'SCHOLARSHIPS_OVERVIEW_MENU',
           NULL,
           'a1bbb4f9-ad0e-4600-881d-b59db667c956',
           '',
           false,
           '');

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
VALUES    ('8dbd9f7e-e98b-4036-9ed8-da95c0241a0c',
           'Leads Walk-ins Menu',
           'ADMIN',
           'ADMIN',
           'leads walk-ins menu',
           'LEADS_WALKINS_MENU',
           NULL,
           'a1bbb4f9-ad0e-4600-881d-b59db667c956',
           '',
           false,
           '');

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
VALUES    ('445eb01b-9981-45e2-8fd9-2fb11490260d',
           'Loans Assistance Menu',
           'ADMIN',
           'ADMIN',
           'loans assistance menu',
           'LOANS_ASSISTANCE_MENU',
           NULL,
           'a1bbb4f9-ad0e-4600-881d-b59db667c956',
           '',
           false,
           '');

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
VALUES    ('a00bf37a-4329-43b9-8840-73b519486bc8',
           'Scholarships Guidance Menu',
           'ADMIN',
           'ADMIN',
           'scholarships guidance menu',
           'SCHOLARSHIPS_GUIDANCE_MENU',
           NULL,
           'a1bbb4f9-ad0e-4600-881d-b59db667c956',
           '',
           false,
           '');

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
VALUES    ('321846f9-3552-48f1-99a2-606514717a95',
           'Colleges Menu',
           'ADMIN',
           'ADMIN',
           'colleges menu',
           'COLLEGES_MENU',
           NULL,
           'a1bbb4f9-ad0e-4600-881d-b59db667c956',
           '',
           false,
           '');

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
VALUES    ('f7b91a7e-5c3e-4cbd-8be6-7b19adb6f92f',
           'Compare Menu',
           'ADMIN',
           'ADMIN',
           'compare menu',
           'COMPARE_MENU',
           NULL,
           'a1bbb4f9-ad0e-4600-881d-b59db667c956',
           '',
           false,
           '');

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
VALUES    ('d4ebcd80-dcd9-4a55-a709-f444d0dafa49',
           'Book Counselling Menu',
           'ADMIN',
           'ADMIN',
           'book counselling menu',
           'BOOK_COUNSELLING_MENU',
           NULL,
           'a1bbb4f9-ad0e-4600-881d-b59db667c956',
           '',
           false,
           '');

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
VALUES    ('7050fa57-95af-488f-8a58-6437aa7b2578',
           'Exams Menu',
           'ADMIN',
           'ADMIN',
           'exams menu',
           'EXAMS_MENU',
           NULL,
           'a1bbb4f9-ad0e-4600-881d-b59db667c956',
           '',
           false,
           '');

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
VALUES    ('1214decf-0cb2-4c2b-bb90-6b601eda0a7e',
           'Education Loans Menu',
           'ADMIN',
           'ADMIN',
           'education loans menu',
           'EDUCATION_LOANS_MENU',
           NULL,
           'a1bbb4f9-ad0e-4600-881d-b59db667c956',
           '',
           false,
           '');

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
VALUES    ('bbb1cbac-e12d-4c06-aff5-66b02472f406',
           'Scholarships Menu',
           'ADMIN',
           'ADMIN',
           'scholarships menu',
           'SCHOLARSHIPS_MENU',
           NULL,
           'a1bbb4f9-ad0e-4600-881d-b59db667c956',
           '',
           false,
           '');

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
VALUES    ('1ec0164f-62f1-4dcb-a2ab-e6916963a95d',
           'Latest News Menu',
           'ADMIN',
           'ADMIN',
           'latest news menu',
           'LATEST_NEWS_MENU',
           NULL,
           'a1bbb4f9-ad0e-4600-881d-b59db667c956',
           '',
           false,
           '');

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
VALUES    ('7293c028-5ff9-481c-b945-5320f65b94f8',
           'Resources Guides Menu',
           'ADMIN',
           'ADMIN',
           'resources guides menu',
           'RESOURCES_GUIDES_MENU',
           NULL,
           'a1bbb4f9-ad0e-4600-881d-b59db667c956',
           '',
           false,
           '');

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
VALUES    ('f01cfb31-a4f6-46a3-90be-e8495d9cfc62',
           'Messages Menu',
           'ADMIN',
           'ADMIN',
           'messages menu',
           'MESSAGES_MENU',
           NULL,
           'a1bbb4f9-ad0e-4600-881d-b59db667c956',
           '',
           false,
           '');

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
VALUES    ('5e7b814c-1600-424c-ac15-9362d0ebb1c0',
           'Settings Menu',
           'ADMIN',
           'ADMIN',
           'settings menu',
           'SETTINGS_MENU',
           NULL,
           'a1bbb4f9-ad0e-4600-881d-b59db667c956',
           '',
           false,
           '');

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('589900b3-0413-4328-8859-e8c0ff3cc9b8', '07ef05da-d98b-4284-889d-4eeac3684455', 'ADMIN', 'ADMIN'); -- Dashboard Menu

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'ca0059f0-0d69-40cf-90b3-6cb10c9c228d', 'ADMIN', 'ADMIN'); -- User Management Menu

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'a9951df6-903a-498e-b9d7-a5ead0c87a17', 'ADMIN', 'ADMIN'); -- Leads Menu

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'aa54ea46-bf1c-4e2f-be12-610a1efc1661', 'ADMIN', 'ADMIN'); -- Counselling Menu

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('589900b3-0413-4328-8859-e8c0ff3cc9b8', '7c2e1f62-c61f-44bc-9b64-cc4989502ba3', 'ADMIN', 'ADMIN'); -- Admissions Menu

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'c1fcaaa9-14ab-4bc1-9bee-6d1c59ae930d', 'ADMIN', 'ADMIN'); -- Payments Menu

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('589900b3-0413-4328-8859-e8c0ff3cc9b8', '3b1525bf-fa69-4cc2-80d7-5c2b83c17c40', 'ADMIN', 'ADMIN'); -- Loans Management Menu

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('589900b3-0413-4328-8859-e8c0ff3cc9b8', '60f3009f-7273-479d-9f4b-ae1db437129d', 'ADMIN', 'ADMIN'); -- Scholarships Management Menu

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('589900b3-0413-4328-8859-e8c0ff3cc9b8', '457a842a-f0d7-4eed-8a09-f0a00d2cf27e', 'ADMIN', 'ADMIN'); -- Reports Menu

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'dfc5b379-c8d9-493a-a688-b63379e49530', 'ADMIN', 'ADMIN'); -- Masters Menu

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('589900b3-0413-4328-8859-e8c0ff3cc9b8', '9b2c0036-e743-4862-83e1-d3f6fbdff4b3', 'ADMIN', 'ADMIN'); -- Notifications Alerts Menu

-- Manager Role Permissions
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('4ccb49d7-359b-45bd-b24b-1a337c7bd458', '07ef05da-d98b-4284-889d-4eeac3684455', 'ADMIN', 'ADMIN'); -- Dashboard Menu

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('4ccb49d7-359b-45bd-b24b-1a337c7bd458', 'a9951df6-903a-498e-b9d7-a5ead0c87a17', 'ADMIN', 'ADMIN'); -- Leads Menu

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('4ccb49d7-359b-45bd-b24b-1a337c7bd458', 'aa54ea46-bf1c-4e2f-be12-610a1efc1661', 'ADMIN', 'ADMIN'); -- Counselling Menu

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('4ccb49d7-359b-45bd-b24b-1a337c7bd458', '7c2e1f62-c61f-44bc-9b64-cc4989502ba3', 'ADMIN', 'ADMIN'); -- Admissions Menu

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('4ccb49d7-359b-45bd-b24b-1a337c7bd458', 'c1fcaaa9-14ab-4bc1-9bee-6d1c59ae930d', 'ADMIN', 'ADMIN'); -- Payments Menu

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('4ccb49d7-359b-45bd-b24b-1a337c7bd458', '79087d74-f687-4159-8b61-8c2ef0109dda', 'ADMIN', 'ADMIN'); -- Loans Overview Menu

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('4ccb49d7-359b-45bd-b24b-1a337c7bd458', '1c1e46de-fbe5-4d27-adc6-8a46536fb85e', 'ADMIN', 'ADMIN'); -- Scholarships Overview Menu

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('4ccb49d7-359b-45bd-b24b-1a337c7bd458', '457a842a-f0d7-4eed-8a09-f0a00d2cf27e', 'ADMIN', 'ADMIN'); -- Reports Menu

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('4ccb49d7-359b-45bd-b24b-1a337c7bd458', '9b2c0036-e743-4862-83e1-d3f6fbdff4b3', 'ADMIN', 'ADMIN'); -- Notifications Alerts Menu

-- Senior Counsellor Role Permissions
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('6563c720-a750-44cc-b3a4-79c1aaa2abe4', '07ef05da-d98b-4284-889d-4eeac3684455', 'ADMIN', 'ADMIN'); -- Dashboard Menu

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('6563c720-a750-44cc-b3a4-79c1aaa2abe4', '8dbd9f7e-e98b-4036-9ed8-da95c0241a0c', 'ADMIN', 'ADMIN'); -- Leads Walk-ins Menu

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('6563c720-a750-44cc-b3a4-79c1aaa2abe4', 'aa54ea46-bf1c-4e2f-be12-610a1efc1661', 'ADMIN', 'ADMIN'); -- Counselling Menu

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('6563c720-a750-44cc-b3a4-79c1aaa2abe4', '7c2e1f62-c61f-44bc-9b64-cc4989502ba3', 'ADMIN', 'ADMIN'); -- Admissions Menu

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('6563c720-a750-44cc-b3a4-79c1aaa2abe4', 'c1fcaaa9-14ab-4bc1-9bee-6d1c59ae930d', 'ADMIN', 'ADMIN'); -- Payments Menu

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('6563c720-a750-44cc-b3a4-79c1aaa2abe4', '445eb01b-9981-45e2-8fd9-2fb11490260d', 'ADMIN', 'ADMIN'); -- Loans Assistance Menu

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('6563c720-a750-44cc-b3a4-79c1aaa2abe4', 'a00bf37a-4329-43b9-8840-73b519486bc8', 'ADMIN', 'ADMIN'); -- Scholarships Guidance Menu

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('6563c720-a750-44cc-b3a4-79c1aaa2abe4', '9b2c0036-e743-4862-83e1-d3f6fbdff4b3', 'ADMIN', 'ADMIN'); -- Notifications Alerts Menu

-- Counsellor Role Permissions
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('5d415ea6-84dd-490a-b790-b8f5a314c47e', '07ef05da-d98b-4284-889d-4eeac3684455', 'ADMIN', 'ADMIN'); -- Dashboard Menu

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('5d415ea6-84dd-490a-b790-b8f5a314c47e', '8dbd9f7e-e98b-4036-9ed8-da95c0241a0c', 'ADMIN', 'ADMIN'); -- Leads Walk-ins Menu

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('5d415ea6-84dd-490a-b790-b8f5a314c47e', 'aa54ea46-bf1c-4e2f-be12-610a1efc1661', 'ADMIN', 'ADMIN'); -- Counselling Menu

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('5d415ea6-84dd-490a-b790-b8f5a314c47e', '7c2e1f62-c61f-44bc-9b64-cc4989502ba3', 'ADMIN', 'ADMIN'); -- Admissions Menu

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('5d415ea6-84dd-490a-b790-b8f5a314c47e', 'c1fcaaa9-14ab-4bc1-9bee-6d1c59ae930d', 'ADMIN', 'ADMIN'); -- Payments Menu

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('5d415ea6-84dd-490a-b790-b8f5a314c47e', '445eb01b-9981-45e2-8fd9-2fb11490260d', 'ADMIN', 'ADMIN'); -- Loans Assistance Menu

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('5d415ea6-84dd-490a-b790-b8f5a314c47e', 'a00bf37a-4329-43b9-8840-73b519486bc8', 'ADMIN', 'ADMIN'); -- Scholarships Guidance Menu

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('5d415ea6-84dd-490a-b790-b8f5a314c47e', '9b2c0036-e743-4862-83e1-d3f6fbdff4b3', 'ADMIN', 'ADMIN'); -- Notifications Alerts Menu

-- Student Role Permissions
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('85396e7c-1bf2-40cf-a03c-744fb6b9fa9f', '07ef05da-d98b-4284-889d-4eeac3684455', 'ADMIN', 'ADMIN'); -- Dashboard Menu

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('85396e7c-1bf2-40cf-a03c-744fb6b9fa9f', '321846f9-3552-48f1-99a2-606514717a95', 'ADMIN', 'ADMIN'); -- Colleges Menu

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('85396e7c-1bf2-40cf-a03c-744fb6b9fa9f', 'f7b91a7e-5c3e-4cbd-8be6-7b19adb6f92f', 'ADMIN', 'ADMIN'); -- Compare Menu

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('85396e7c-1bf2-40cf-a03c-744fb6b9fa9f', 'd4ebcd80-dcd9-4a55-a709-f444d0dafa49', 'ADMIN', 'ADMIN'); -- Book Counselling Menu

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('85396e7c-1bf2-40cf-a03c-744fb6b9fa9f', '7050fa57-95af-488f-8a58-6437aa7b2578', 'ADMIN', 'ADMIN'); -- Exams Menu

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('85396e7c-1bf2-40cf-a03c-744fb6b9fa9f', '1214decf-0cb2-4c2b-bb90-6b601eda0a7e', 'ADMIN', 'ADMIN'); -- Education Loans Menu

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('85396e7c-1bf2-40cf-a03c-744fb6b9fa9f', 'bbb1cbac-e12d-4c06-aff5-66b02472f406', 'ADMIN', 'ADMIN'); -- Scholarships Menu

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('85396e7c-1bf2-40cf-a03c-744fb6b9fa9f', '1ec0164f-62f1-4dcb-a2ab-e6916963a95d', 'ADMIN', 'ADMIN'); -- Latest News Menu

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('85396e7c-1bf2-40cf-a03c-744fb6b9fa9f', '7293c028-5ff9-481c-b945-5320f65b94f8', 'ADMIN', 'ADMIN'); -- Resources Guides Menu

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('85396e7c-1bf2-40cf-a03c-744fb6b9fa9f', 'f01cfb31-a4f6-46a3-90be-e8495d9cfc62', 'ADMIN', 'ADMIN'); -- Messages Menu

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('85396e7c-1bf2-40cf-a03c-744fb6b9fa9f', '5e7b814c-1600-424c-ac15-9362d0ebb1c0', 'ADMIN', 'ADMIN'); -- Settings Menu





-- =====================================================
-- V01_005__calendar_permission.sql
-- =====================================================
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
VALUES    ('4dda28a8-4a72-4c69-b97b-244c5e6b88fa',
           'Calendar Menu',
           'ADMIN',
           'ADMIN',
           'calendar menu',
           'CALENDAR_MENU',
           NULL,
           'a1bbb4f9-ad0e-4600-881d-b59db667c956',
           '',
           false,
           '');


INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('589900b3-0413-4328-8859-e8c0ff3cc9b8', '4dda28a8-4a72-4c69-b97b-244c5e6b88fa', 'ADMIN', 'ADMIN'); -- Calendar Menu

-- Manager Role Permissions
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('4ccb49d7-359b-45bd-b24b-1a337c7bd458', '4dda28a8-4a72-4c69-b97b-244c5e6b88fa', 'ADMIN', 'ADMIN'); -- Calendar Menu

-- Senior Counsellor Role Permissions
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('6563c720-a750-44cc-b3a4-79c1aaa2abe4', '4dda28a8-4a72-4c69-b97b-244c5e6b88fa', 'ADMIN', 'ADMIN'); -- Calendar Menu

-- Counsellor Role Permissions

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('5d415ea6-84dd-490a-b790-b8f5a314c47e', '4dda28a8-4a72-4c69-b97b-244c5e6b88fa', 'ADMIN', 'ADMIN'); -- Calendar Menu

-- Student Role Permissions
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('85396e7c-1bf2-40cf-a03c-744fb6b9fa9f', '4dda28a8-4a72-4c69-b97b-244c5e6b88fa', 'ADMIN', 'ADMIN'); -- Calendar Menu

-- =====================================================
-- V01_006__colleges.sql
-- =====================================================
-- Ensure the schema exists
CREATE SCHEMA IF NOT EXISTS common;
CREATE TABLE IF NOT EXISTS common.colleges (
    college_id uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    "name" varchar(255) NOT NULL, -- Full college name
    type varchar(100), -- College type (Engineering, Medical, Arts, etc.)
    state varchar(100),
    district varchar(100),
    city varchar(100),
    fees varchar(50),
    image varchar(500),
    rating decimal(3,2),
    description text,
    website varchar(255),
    phone varchar(20),
    email varchar(100),
    address text,
    established_year integer,
    affiliation varchar(100),
    accreditation varchar(100),
    is_active boolean DEFAULT true NOT NULL,
    created_by varchar(150) NOT NULL,
    updated_by varchar(150) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE IF NOT EXISTS student.student_assigned_colleges (
    student_assigned_college_id uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    student_id uuid NOT NULL,
    college_id uuid NOT NULL,
    created_by varchar(150) NOT NULL,
    updated_by varchar(150) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- ✅ Constraints
    CONSTRAINT fk_student FOREIGN KEY (student_id)
        REFERENCES student.student(student_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_college FOREIGN KEY (college_id)
        REFERENCES common.colleges(college_id)
        ON DELETE CASCADE,

    -- ✅ Prevent duplicate student-college assignments
    CONSTRAINT uq_student_college UNIQUE (student_id, college_id)
);

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
VALUES    ('c8ccd4d6-39fd-4552-a281-2ca755cd64e7',
           'Create College',
           'ADMIN',
           'ADMIN',
           'Create College',
           'CREATE_COLLEGE',
           NULL,
           'a1bbb4f9-ad0e-4600-881d-b59db667c956',
           '',
           false,
           '');

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'c8ccd4d6-39fd-4552-a281-2ca755cd64e7', 'ADMIN', 'ADMIN'); -- college create

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('589900b3-0413-4328-8859-e8c0ff3cc9b8', '321846f9-3552-48f1-99a2-606514717a95', 'ADMIN', 'ADMIN'); -- admin college menu

-- =====================================================
-- V01_007__counselling_calendar_video.sql
-- =====================================================
CREATE SCHEMA IF NOT EXISTS counselling;

-- =====================================================
-- 1. APPOINTMENT STATUS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS counselling.appointment_status (
    status_id UUID PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    status_code VARCHAR(50) UNIQUE NOT NULL,
    status_name VARCHAR(100) NOT NULL,
    description TEXT DEFAULT NULL,
    display_order INTEGER NOT NULL,

    created_by VARCHAR(150) NOT NULL,
    updated_by VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Insert status values
INSERT INTO counselling.appointment_status (status_code, status_name, description, display_order, created_by, updated_by)
VALUES
    ('PENDING', 'Pending', 'Appointment created by student, awaiting counsellor confirmation', 1, 'SYSTEM', 'SYSTEM'),
    ('CONFIRMED', 'Confirmed', 'Counsellor confirmed the appointment', 2, 'SYSTEM', 'SYSTEM'),
    ('REJECTED', 'Rejected', 'Counsellor rejected the appointment', 3, 'SYSTEM', 'SYSTEM'),
    ('CANCELLED', 'Cancelled', 'Appointment cancelled by student or counsellor', 4, 'SYSTEM', 'SYSTEM'),
    ('COMPLETED', 'Completed', 'Appointment session completed', 5, 'SYSTEM', 'SYSTEM'),
    ('NO_SHOW', 'No Show', 'Student did not attend', 6, 'SYSTEM', 'SYSTEM');

-- =====================================================
-- 2. APPOINTMENTS TABLE
-- =====================================================
-- Students create appointments with counsellors
CREATE TABLE IF NOT EXISTS counselling.appointments (
    appointment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,

    -- Participants
    student_id UUID NOT NULL,
    counsellor_id UUID NOT NULL,

    -- Appointment details
    title VARCHAR(255) NOT NULL,
    description TEXT DEFAULT NULL,

    -- Scheduling
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,

    -- Status
    status_id UUID NOT NULL,

    -- Additional info
    student_notes TEXT DEFAULT NULL,
    counsellor_notes TEXT DEFAULT NULL,

    -- Confirmation/Rejection
    confirmed_at TIMESTAMP DEFAULT NULL,
    rejection_reason TEXT DEFAULT NULL,

    -- Cancellation
    cancelled_by UUID DEFAULT NULL,
    cancelled_at TIMESTAMP DEFAULT NULL,
    cancellation_reason TEXT DEFAULT NULL,

    -- Audit fields
    created_by VARCHAR(150) NOT NULL,
    updated_by VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

    CONSTRAINT fk_appointments_student FOREIGN KEY (student_id)
        REFERENCES student.student(student_id) ON DELETE CASCADE,
    CONSTRAINT fk_appointments_counsellor FOREIGN KEY (counsellor_id)
        REFERENCES auth."user"(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_appointments_status FOREIGN KEY (status_id)
        REFERENCES counselling.appointment_status(status_id),
    CONSTRAINT check_appointment_time CHECK (end_time > start_time)
);

CREATE INDEX idx_appointments_student ON counselling.appointments(student_id);
CREATE INDEX idx_appointments_counsellor ON counselling.appointments(counsellor_id);
CREATE INDEX idx_appointments_date ON counselling.appointments(appointment_date);
CREATE INDEX idx_appointments_status ON counselling.appointments(status_id);

-- =====================================================
-- 3. SESSION STATUS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS counselling.session_status (
    status_id UUID PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    status_code VARCHAR(50) UNIQUE NOT NULL,
    status_name VARCHAR(100) NOT NULL,
    description TEXT DEFAULT NULL,
    display_order INTEGER NOT NULL,

    created_by VARCHAR(150) NOT NULL,
    updated_by VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Insert session status values
INSERT INTO counselling.session_status (status_code, status_name, description, display_order, created_by, updated_by)
VALUES
    ('CREATED', 'Created', 'Video room created, waiting to start', 1, 'SYSTEM', 'SYSTEM'),
    ('ACTIVE', 'Active', 'Video call in progress', 2, 'SYSTEM', 'SYSTEM'),
    ('COMPLETED', 'Completed', 'Session ended successfully', 3, 'SYSTEM', 'SYSTEM'),
    ('FAILED', 'Failed', 'Technical failure or error', 4, 'SYSTEM', 'SYSTEM');

-- =====================================================
-- 4. SESSIONS TABLE
-- =====================================================
-- Counsellors launch video sessions from appointments
CREATE TABLE IF NOT EXISTS counselling.sessions (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    appointment_id UUID NOT NULL,

    -- Session timing
    launched_at TIMESTAMP DEFAULT NULL,
    started_at TIMESTAMP DEFAULT NULL,
    ended_at TIMESTAMP DEFAULT NULL,
    duration_minutes INTEGER DEFAULT NULL,

    -- Status
    status_id UUID NOT NULL,

    -- Participants joined tracking
    counsellor_joined BOOLEAN DEFAULT false,
    counsellor_joined_at TIMESTAMP DEFAULT NULL,
    student_joined BOOLEAN DEFAULT false,
    student_joined_at TIMESTAMP DEFAULT NULL,

    -- Session outcome
    session_notes TEXT DEFAULT NULL,

    -- Audit fields
    created_by VARCHAR(150) NOT NULL,
    updated_by VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

    CONSTRAINT fk_sessions_appointment FOREIGN KEY (appointment_id)
        REFERENCES counselling.appointments(appointment_id) ON DELETE CASCADE,
    CONSTRAINT fk_sessions_status FOREIGN KEY (status_id)
        REFERENCES counselling.session_status(status_id)
);

CREATE INDEX idx_sessions_appointment ON counselling.sessions(appointment_id);
CREATE INDEX idx_sessions_status ON counselling.sessions(status_id);
CREATE INDEX idx_sessions_launched ON counselling.sessions(launched_at);

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE counselling.appointment_status IS 'Status values for appointments';
COMMENT ON TABLE counselling.appointments IS 'Student-created counselling appointments';
COMMENT ON TABLE counselling.session_status IS 'Status values for video sessions';
COMMENT ON TABLE counselling.sessions IS 'Counsellor-launched video call sessions';

-- =====================================================
-- V01_008__counsellors_list_permission.sql
-- =====================================================
-- =====================================================
-- ADD COUNSELLORS LIST PERMISSION FOR STUDENTS
-- =====================================================
-- Allow students to view list of counsellors for booking appointments

-- Insert permission for viewing counsellors list
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
VALUES    ('b9f2c3d1-4e5f-6a7b-8c9d-0e1f2a3b4c5d',
           'View Counsellors List',
           'ADMIN',
           'ADMIN',
           'View list of available counsellors for booking',
           'VIEW_COUNSELLORS',
           NULL,
           'a1bbb4f9-ad0e-4600-881d-b59db667c956',
           'GET',
           false,
           '/appointments/counsellors');

-- Assign permission to Student role
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('85396e7c-1bf2-40cf-a03c-744fb6b9fa9f', 'b9f2c3d1-4e5f-6a7b-8c9d-0e1f2a3b4c5d', 'ADMIN', 'ADMIN'); -- Student role

-- Assign permission to Counsellor roles (so they can see other counsellors if needed)
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('6563c720-a750-44cc-b3a4-79c1aaa2abe4', 'b9f2c3d1-4e5f-6a7b-8c9d-0e1f2a3b4c5d', 'ADMIN', 'ADMIN'); -- Senior Counsellor

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('5d415ea6-84dd-490a-b790-b8f5a314c47e', 'b9f2c3d1-4e5f-6a7b-8c9d-0e1f2a3b4c5d', 'ADMIN', 'ADMIN'); -- Counsellor

-- Assign permission to Admin and Manager roles
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'b9f2c3d1-4e5f-6a7b-8c9d-0e1f2a3b4c5d', 'ADMIN', 'ADMIN'); -- Admin

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('4ccb49d7-359b-45bd-b24b-1a337c7bd458', 'b9f2c3d1-4e5f-6a7b-8c9d-0e1f2a3b4c5d', 'ADMIN', 'ADMIN'); -- Manager

COMMENT ON COLUMN auth.permissions.action IS 'Permission action name used in frontend';


-- =====================================================
-- V01_009__loans_management.sql
-- =====================================================
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

-- =====================================================
-- V01_010__scholarships_management.sql
-- =====================================================
-- Ensure the schema exists
CREATE SCHEMA IF NOT EXISTS common;

-- Drop existing scholarships table if it exists (to recreate with correct structure)
DROP TABLE IF EXISTS common.scholarships CASCADE;

-- Create scholarships table with correct structure
CREATE TABLE common.scholarships (
    scholarship_id uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    scholarship_name varchar(255) NOT NULL, -- Name of the scholarship
    provider varchar(255) NOT NULL, -- Organization providing the scholarship
    eligibility_criteria text, -- Academic merit, income limits, category, or course-specific requirements
    applicable_courses varchar(100), -- Which courses are eligible
    education_level varchar(50), -- UG, PG, PhD, Abroad, etc.
    scholarship_amount decimal(15,2), -- Total monetary aid amount
    benefits_description text, -- Tuition fee, living allowance, stipend details
    application_process text, -- How to apply
    portal_link varchar(500), -- Application portal link
    application_start_date date, -- When applications open
    application_end_date date, -- When applications close
    renewal_schedule text, -- Renewal schedule and process
    overall_remarks text, -- Brief note on ease of application, competition level, or reliability
    is_active boolean DEFAULT true NOT NULL,
    created_by varchar(150) NOT NULL,
    updated_by varchar(150) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_scholarships_name ON common.scholarships(scholarship_name);
CREATE INDEX IF NOT EXISTS idx_scholarships_provider ON common.scholarships(provider);
CREATE INDEX IF NOT EXISTS idx_scholarships_education_level ON common.scholarships(education_level);
CREATE INDEX IF NOT EXISTS idx_scholarships_is_active ON common.scholarships(is_active);
CREATE INDEX IF NOT EXISTS idx_scholarships_amount ON common.scholarships(scholarship_amount);
CREATE INDEX IF NOT EXISTS idx_scholarships_scholarship_id ON common.scholarships(scholarship_id);
CREATE INDEX IF NOT EXISTS idx_scholarships_created_at ON common.scholarships(created_at);
CREATE INDEX IF NOT EXISTS idx_scholarships_updated_at ON common.scholarships(updated_at);

-- Insert sample scholarship records
INSERT INTO common.scholarships (
    scholarship_id, scholarship_name, provider, eligibility_criteria, applicable_courses,
    education_level, scholarship_amount, benefits_description, application_process,
    portal_link, application_start_date, application_end_date, renewal_schedule,
    overall_remarks, is_active, created_by, updated_by
) VALUES
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'National Scholarship Portal (NSP)', 'Government of India',
 'Indian citizen, family income below ₹8 lakhs, minimum 60% marks in previous exam',
 'All courses', 'UG/PG', 50000.00, 'Tuition fee reimbursement, maintenance allowance',
 'Online application through NSP portal', 'https://scholarships.gov.in',
 '2024-01-01', '2024-03-31', 'Annual renewal based on academic performance',
 'Highly reliable, easy application process', true, 'ADMIN', 'ADMIN'),

('b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Tata Trusts Scholarship', 'Tata Trusts',
 'Merit-based, family income below ₹6 lakhs, admission to premier institutes',
 'Engineering, Medicine, Management', 'UG/PG', 100000.00, 'Full tuition fee, living expenses, laptop',
 'Direct application to Tata Trusts', 'https://tatatrusts.org/scholarships',
 '2024-02-01', '2024-04-30', 'Annual renewal with academic excellence',
 'Competitive but highly prestigious', true, 'ADMIN', 'ADMIN'),

('b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'UGC NET Fellowship', 'University Grants Commission',
 'Masters degree with 55% marks, age limit 30 years, NET qualified',
 'All subjects', 'PhD', 31000.00, 'Monthly stipend, contingency grant',
 'Through UGC NET examination', 'https://ugcnet.nta.nic.in',
 '2024-03-01', '2024-05-31', 'Annual renewal for 5 years',
 'Research-oriented, highly competitive', true, 'ADMIN', 'ADMIN'),

('b4eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Chevening Scholarship', 'UK Government',
 'Indian citizen, 2+ years work experience, leadership qualities',
 'All subjects', 'Masters', 0.00, 'Full tuition fee, living allowance, travel costs',
 'Online application through Chevening portal', 'https://chevening.org',
 '2024-08-01', '2024-11-01', 'One-time award, no renewal',
 'International exposure, highly prestigious', true, 'ADMIN', 'ADMIN'),

('b5eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'Fulbright Scholarship', 'US Government',
 'Indian citizen, Masters degree, English proficiency, research proposal',
 'All subjects', 'PhD/Research', 0.00, 'Full funding, health insurance, travel',
 'Through USIEF application', 'https://usief.org.in',
 '2024-04-01', '2024-07-15', 'One-time award, no renewal',
 'International research opportunity', true, 'ADMIN', 'ADMIN');

-- Permissions for Scholarships Management
INSERT INTO auth.permissions (permission_id, name, created_by, updated_by, description, action, condition, object_id, request_method, override_object_url, path)
VALUES
('e1a2b3c4-d5e6-4789-a1b2-c3d4e5f6a7b8', 'Create Scholarship', 'ADMIN', 'ADMIN', 'Create Scholarship', 'CREATE_SCHOLARSHIP', NULL, 'a1bbb4f9-ad0e-4600-881d-b59db667c956', 'POST', false, '/api/scholarships'),
('e2a3b4c5-d6e7-4789-a2b3-c4d5e6f7a8b9', 'Update Scholarship', 'ADMIN', 'ADMIN', 'Update Scholarship', 'UPDATE_SCHOLARSHIP', NULL, 'a1bbb4f9-ad0e-4600-881d-b59db667c956', 'PUT', false, '/api/scholarships'),
('e3a4b5c6-d7e8-4789-a3b4-c5d6e7f8a9b0', 'Delete Scholarship', 'ADMIN', 'ADMIN', 'Delete Scholarship', 'DELETE_SCHOLARSHIP', NULL, 'a1bbb4f9-ad0e-4600-881d-b59db667c956', 'DELETE', false, '/api/scholarships'),
('e4a5b6c7-d8e9-4789-a4b5-c6d7e8f9a0b1', 'Scholarships Management Menu', 'ADMIN', 'ADMIN', 'Scholarships Management Menu', 'SCHOLARSHIPS_MANAGEMENT_MENU', NULL, 'a1bbb4f9-ad0e-4600-881d-b59db667c956', 'GET', false, '/scholarships-management');

-- Assign permissions to Admin role
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES
('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'e1a2b3c4-d5e6-4789-a1b2-c3d4e5f6a7b8', 'ADMIN', 'ADMIN'), -- Create Scholarship
('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'e2a3b4c5-d6e7-4789-a2b3-c4d5e6f7a8b9', 'ADMIN', 'ADMIN'), -- Update Scholarship
('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'e3a4b5c6-d7e8-4789-a3b4-c5d6e7f8a9b0', 'ADMIN', 'ADMIN'), -- Delete Scholarship
('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'e4a5b6c7-d8e9-4789-a4b5-c6d7e8f9a0b1', 'ADMIN', 'ADMIN'); -- Scholarships Management Menu

-- =====================================================
-- V01_011__scholarships_counsellor_permissions.sql
-- =====================================================
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

-- =====================================================
-- V01_012__loans_counsellor_permissions.sql
-- =====================================================
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

-- =====================================================
-- V01_013__leads_all_roles_permissions.sql
-- =====================================================
-- Add Leads Management permissions to all roles except Student
-- This allows all staff roles (Admin, Manager, Senior Counsellor, Counsellor) to access leads

-- Add LEADS_MENU permission to Admin role (if not already exists)
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
SELECT '589900b3-0413-4328-8859-e8c0ff3cc9b8', 'a9951df6-903a-498e-b9d7-a5ead0c87a17', 'ADMIN', 'ADMIN'
WHERE NOT EXISTS (
    SELECT 1 FROM auth.role_permissions
    WHERE role_id = '589900b3-0413-4328-8859-e8c0ff3cc9b8'
    AND permission_id = 'a9951df6-903a-498e-b9d7-a5ead0c87a17'
);

-- Add LEADS_MENU permission to Manager role
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
SELECT '4ccb49d7-359b-45bd-b24b-1a337c7bd458', 'a9951df6-903a-498e-b9d7-a5ead0c87a17', 'ADMIN', 'ADMIN'
WHERE NOT EXISTS (
    SELECT 1 FROM auth.role_permissions
    WHERE role_id = '4ccb49d7-359b-45bd-b24b-1a337c7bd458'
    AND permission_id = 'a9951df6-903a-498e-b9d7-a5ead0c87a17'
);

-- Add LEADS_MENU permission to Senior Counsellor role
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
SELECT '6563c720-a750-44cc-b3a4-79c1aaa2abe4', 'a9951df6-903a-498e-b9d7-a5ead0c87a17', 'ADMIN', 'ADMIN'
WHERE NOT EXISTS (
    SELECT 1 FROM auth.role_permissions
    WHERE role_id = '6563c720-a750-44cc-b3a4-79c1aaa2abe4'
    AND permission_id = 'a9951df6-903a-498e-b9d7-a5ead0c87a17'
);

-- Add LEADS_MENU permission to Counsellor role
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
SELECT '5d415ea6-84dd-490a-b790-b8f5a314c47e', 'a9951df6-903a-498e-b9d7-a5ead0c87a17', 'ADMIN', 'ADMIN'
WHERE NOT EXISTS (
    SELECT 1 FROM auth.role_permissions
    WHERE role_id = '5d415ea6-84dd-490a-b790-b8f5a314c47e'
    AND permission_id = 'a9951df6-903a-498e-b9d7-a5ead0c87a17'
);

-- Add LEADS_WALKINS_MENU permission to Admin role (if not already exists)
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
SELECT '589900b3-0413-4328-8859-e8c0ff3cc9b8', '8dbd9f7e-e98b-4036-9ed8-da95c0241a0c', 'ADMIN', 'ADMIN'
WHERE NOT EXISTS (
    SELECT 1 FROM auth.role_permissions
    WHERE role_id = '589900b3-0413-4328-8859-e8c0ff3cc9b8'
    AND permission_id = '8dbd9f7e-e98b-4036-9ed8-da95c0241a0c'
);

-- Add LEADS_WALKINS_MENU permission to Manager role
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
SELECT '4ccb49d7-359b-45bd-b24b-1a337c7bd458', '8dbd9f7e-e98b-4036-9ed8-da95c0241a0c', 'ADMIN', 'ADMIN'
WHERE NOT EXISTS (
    SELECT 1 FROM auth.role_permissions
    WHERE role_id = '4ccb49d7-359b-45bd-b24b-1a337c7bd458'
    AND permission_id = '8dbd9f7e-e98b-4036-9ed8-da95c0241a0c'
);

-- Add LEADS_WALKINS_MENU permission to Senior Counsellor role
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
SELECT '6563c720-a750-44cc-b3a4-79c1aaa2abe4', '8dbd9f7e-e98b-4036-9ed8-da95c0241a0c', 'ADMIN', 'ADMIN'
WHERE NOT EXISTS (
    SELECT 1 FROM auth.role_permissions
    WHERE role_id = '6563c720-a750-44cc-b3a4-79c1aaa2abe4'
    AND permission_id = '8dbd9f7e-e98b-4036-9ed8-da95c0241a0c'
);

-- Add LEADS_WALKINS_MENU permission to Counsellor role
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
SELECT '5d415ea6-84dd-490a-b790-b8f5a314c47e', '8dbd9f7e-e98b-4036-9ed8-da95c0241a0c', 'ADMIN', 'ADMIN'
WHERE NOT EXISTS (
    SELECT 1 FROM auth.role_permissions
    WHERE role_id = '5d415ea6-84dd-490a-b790-b8f5a314c47e'
    AND permission_id = '8dbd9f7e-e98b-4036-9ed8-da95c0241a0c'
);

-- Note: Student role ('85396e7c-1bf2-40cf-a03c-744fb6b9fa9f') is intentionally excluded

-- =====================================================
-- V01_014__messaging_system.sql
-- =====================================================
-- Messaging system for student-counsellor communication
-- Ensure the schema exists
CREATE SCHEMA IF NOT EXISTS messaging;

-- Create conversations table
CREATE TABLE IF NOT EXISTS messaging.conversations (
    conversation_id uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    student_id uuid NOT NULL,
    counsellor_id uuid NULL, -- NULL initially, assigned when counsellor picks up
    subject varchar(255) NOT NULL,
    status varchar(20) DEFAULT 'OPEN' NOT NULL, -- OPEN, ASSIGNED, CLOSED
    priority varchar(10) DEFAULT 'NORMAL' NOT NULL, -- LOW, NORMAL, HIGH, URGENT
    created_by varchar(150) NOT NULL,
    updated_by varchar(150) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- Foreign key constraints
    CONSTRAINT fk_conversation_student FOREIGN KEY (student_id)
        REFERENCES student.student(student_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_conversation_counsellor FOREIGN KEY (counsellor_id)
        REFERENCES auth."user"(user_id)
        ON DELETE SET NULL,

    -- Check constraints
    CONSTRAINT chk_conversation_status CHECK (status IN ('OPEN', 'ASSIGNED', 'CLOSED')),
    CONSTRAINT chk_conversation_priority CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT'))
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messaging.messages (
    message_id uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    conversation_id uuid NOT NULL,
    sender_id uuid NOT NULL,
    sender_type varchar(20) NOT NULL, -- STUDENT, COUNSELLOR, ADMIN
    message_text text NOT NULL,
    message_type varchar(20) DEFAULT 'TEXT' NOT NULL, -- TEXT, IMAGE, FILE, SYSTEM
    is_read boolean DEFAULT false NOT NULL,
    read_at timestamp NULL,
    created_by varchar(150) NOT NULL,
    updated_by varchar(150) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- Foreign key constraints
    CONSTRAINT fk_message_conversation FOREIGN KEY (conversation_id)
        REFERENCES messaging.conversations(conversation_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_message_sender FOREIGN KEY (sender_id)
        REFERENCES auth."user"(user_id)
        ON DELETE CASCADE,

    -- Check constraints
    CONSTRAINT chk_message_sender_type CHECK (sender_type IN ('STUDENT', 'COUNSELLOR', 'ADMIN')),
    CONSTRAINT chk_message_type CHECK (message_type IN ('TEXT', 'IMAGE', 'FILE', 'SYSTEM'))
);

-- Create conversation participants table (for tracking who can see the conversation)
CREATE TABLE IF NOT EXISTS messaging.conversation_participants (
    participant_id uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    conversation_id uuid NOT NULL,
    user_id uuid NOT NULL,
    user_type varchar(20) NOT NULL, -- STUDENT, COUNSELLOR, ADMIN
    role varchar(20) NOT NULL, -- PARTICIPANT, OBSERVER
    joined_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by varchar(150) NOT NULL,
    updated_by varchar(150) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- Foreign key constraints
    CONSTRAINT fk_participant_conversation FOREIGN KEY (conversation_id)
        REFERENCES messaging.conversations(conversation_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_participant_user FOREIGN KEY (user_id)
        REFERENCES auth."user"(user_id)
        ON DELETE CASCADE,

    -- Check constraints
    CONSTRAINT chk_participant_user_type CHECK (user_type IN ('STUDENT', 'COUNSELLOR', 'ADMIN')),
    CONSTRAINT chk_participant_role CHECK (role IN ('PARTICIPANT', 'OBSERVER')),

    -- Unique constraint to prevent duplicate participants
    CONSTRAINT uq_conversation_participant UNIQUE (conversation_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_conversations_student_id ON messaging.conversations(student_id);
CREATE INDEX IF NOT EXISTS idx_conversations_counsellor_id ON messaging.conversations(counsellor_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON messaging.conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON messaging.conversations(created_at);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messaging.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messaging.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messaging.messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messaging.messages(is_read);

CREATE INDEX IF NOT EXISTS idx_participants_conversation_id ON messaging.conversation_participants(conversation_id);
CREATE INDEX IF NOT EXISTS idx_participants_user_id ON messaging.conversation_participants(user_id);

-- Insert permissions for messaging
INSERT INTO auth.permissions
    (permission_id, name, created_by, updated_by, description, action, condition, object_id, request_method, override_object_url, path)
VALUES
    -- Student permissions
    ('e86c67a0-6d0a-4f91-8a5c-ec5142c11627', 'Create Message', 'ADMIN', 'ADMIN', 'Allow students to create new messages', 'CREATE_MESSAGE', 'userTypeName=Student', 'a1bbb4f9-ad0e-4600-881d-b59db667c956', 'POST', false, '/messaging/conversations'),
    ('bb22875d-f252-43ab-80a4-a18fb5b51a25', 'View Messages', 'ADMIN', 'ADMIN', 'Allow students to view their messages', 'VIEW_MESSAGES', 'userTypeName=Student', 'a1bbb4f9-ad0e-4600-881d-b59db667c956', 'GET', false, '/messaging/conversations'),
    ('01a7b3bc-ea91-4e0b-ac52-0a5e5688002a', 'Reply to Messages', 'ADMIN', 'ADMIN', 'Allow students to reply to messages', 'REPLY_MESSAGE', 'userTypeName=Student', 'a1bbb4f9-ad0e-4600-881d-b59db667c956', 'POST', false, '/messaging/messages'),

    -- Counsellor permissions
    ('932aec53-6b11-4641-b2db-83992f1b7385', 'View All Messages', 'ADMIN', 'ADMIN', 'Allow counsellors to view all open messages', 'VIEW_ALL_MESSAGES', 'userTypeName=Counsellor', 'a1bbb4f9-ad0e-4600-881d-b59db667c956', 'GET', false, '/messaging/conversations'),
    ('9be0568e-c82e-4408-867a-44a6c60b2abb', 'Assign Conversation', 'ADMIN', 'ADMIN', 'Allow counsellors to assign conversations to themselves', 'ASSIGN_CONVERSATION', 'userTypeName=Counsellor', 'a1bbb4f9-ad0e-4600-881d-b59db667c956', 'PATCH', false, '/messaging/conversations'),
    ('26daff8a-0dd9-41a9-955d-3e18dbdb7a45', 'Reply as Counsellor', 'ADMIN', 'ADMIN', 'Allow counsellors to reply to messages', 'REPLY_MESSAGE', 'userTypeName=Counsellor', 'a1bbb4f9-ad0e-4600-881d-b59db667c956', 'POST', false, '/messaging/messages'),
    ('c929d8c6-243b-4929-8143-0655928c66e3', 'Close Conversation', 'ADMIN', 'ADMIN', 'Allow counsellors to close conversations', 'CLOSE_CONVERSATION', 'userTypeName=Counsellor', 'a1bbb4f9-ad0e-4600-881d-b59db667c956', 'PATCH', false, '/messaging/conversations'),

    -- Admin permissions
    ('db9911f6-176a-4209-96ca-0b85ab9db0f1', 'View All Conversations', 'ADMIN', 'ADMIN', 'Allow admins to view all conversations', 'VIEW_ALL_CONVERSATIONS', 'userTypeName=Admin', 'a1bbb4f9-ad0e-4600-881d-b59db667c956', 'GET', false, '/messaging/conversations'),
    ('a1ad64e5-15fd-4f2b-bdbb-99488a778fba', 'Manage Messages', 'ADMIN', 'ADMIN', 'Allow admins to manage all messages', 'MANAGE_MESSAGES', 'userTypeName=Admin', 'a1bbb4f9-ad0e-4600-881d-b59db667c956', 'ALL', false, '/messaging/*');

-- Assign permissions to roles
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES
    -- Student role permissions
    ('85396e7c-1bf2-40cf-a03c-744fb6b9fa9f', 'e86c67a0-6d0a-4f91-8a5c-ec5142c11627', 'ADMIN', 'ADMIN'),
    ('85396e7c-1bf2-40cf-a03c-744fb6b9fa9f', 'bb22875d-f252-43ab-80a4-a18fb5b51a25', 'ADMIN', 'ADMIN'),
    ('85396e7c-1bf2-40cf-a03c-744fb6b9fa9f', '01a7b3bc-ea91-4e0b-ac52-0a5e5688002a', 'ADMIN', 'ADMIN'),

    -- Counsellor role permissions
    ('5d415ea6-84dd-490a-b790-b8f5a314c47e', '932aec53-6b11-4641-b2db-83992f1b7385', 'ADMIN', 'ADMIN'),
    ('5d415ea6-84dd-490a-b790-b8f5a314c47e', '9be0568e-c82e-4408-867a-44a6c60b2abb', 'ADMIN', 'ADMIN'),
    ('5d415ea6-84dd-490a-b790-b8f5a314c47e', '26daff8a-0dd9-41a9-955d-3e18dbdb7a45', 'ADMIN', 'ADMIN'),
    ('5d415ea6-84dd-490a-b790-b8f5a314c47e', 'c929d8c6-243b-4929-8143-0655928c66e3', 'ADMIN', 'ADMIN'),

    -- Senior Counsellor role permissions
    ('6563c720-a750-44cc-b3a4-79c1aaa2abe4', '932aec53-6b11-4641-b2db-83992f1b7385', 'ADMIN', 'ADMIN'),
    ('6563c720-a750-44cc-b3a4-79c1aaa2abe4', '9be0568e-c82e-4408-867a-44a6c60b2abb', 'ADMIN', 'ADMIN'),
    ('6563c720-a750-44cc-b3a4-79c1aaa2abe4', '26daff8a-0dd9-41a9-955d-3e18dbdb7a45', 'ADMIN', 'ADMIN'),
    ('6563c720-a750-44cc-b3a4-79c1aaa2abe4', 'c929d8c6-243b-4929-8143-0655928c66e3', 'ADMIN', 'ADMIN'),

    -- Admin role permissions
    ('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'db9911f6-176a-4209-96ca-0b85ab9db0f1', 'ADMIN', 'ADMIN'),
    ('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'a1ad64e5-15fd-4f2b-bdbb-99488a778fba', 'ADMIN', 'ADMIN');

-- Create a function to automatically add participants when a conversation is created
CREATE OR REPLACE FUNCTION messaging.add_conversation_participants()
RETURNS TRIGGER AS $$
BEGIN
    -- Add student as participant
    INSERT INTO messaging.conversation_participants (conversation_id, user_id, user_type, role, created_by, updated_by)
    VALUES (NEW.conversation_id, NEW.student_id, 'STUDENT', 'PARTICIPANT', NEW.created_by, NEW.updated_by);

    -- Add all counsellors as observers (they can see but not participate until assigned)
    INSERT INTO messaging.conversation_participants (conversation_id, user_id, user_type, role, created_by, updated_by)
    SELECT NEW.conversation_id, u.user_id, 'COUNSELLOR', 'OBSERVER', NEW.created_by, NEW.updated_by
    FROM auth."user" u
    INNER JOIN auth.user_assign_roles ur ON u.user_id = ur.user_id
    INNER JOIN auth.roles r ON ur.role_id = r.role_id
    WHERE r.name = 'Counsellor' AND u.is_active = true;

    -- Add all admins as observers
    INSERT INTO messaging.conversation_participants (conversation_id, user_id, user_type, role, created_by, updated_by)
    SELECT NEW.conversation_id, u.user_id, 'ADMIN', 'OBSERVER', NEW.created_by, NEW.updated_by
    FROM auth."user" u
    INNER JOIN auth.user_assign_roles ur ON u.user_id = ur.user_id
    INNER JOIN auth.roles r ON ur.role_id = r.role_id
    WHERE r.name = 'Admin' AND u.is_active = true;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically add participants
CREATE TRIGGER trg_add_conversation_participants
    AFTER INSERT ON messaging.conversations
    FOR EACH ROW
    EXECUTE FUNCTION messaging.add_conversation_participants();

-- Create a function to update participant role when counsellor is assigned
CREATE OR REPLACE FUNCTION messaging.update_counsellor_participant()
RETURNS TRIGGER AS $$
BEGIN
    -- If counsellor_id is set, update their role to PARTICIPANT
    IF NEW.counsellor_id IS NOT NULL THEN
        UPDATE messaging.conversation_participants
        SET role = 'PARTICIPANT', updated_at = CURRENT_TIMESTAMP, updated_by = NEW.updated_by
        WHERE conversation_id = NEW.conversation_id
        AND user_id = NEW.counsellor_id
        AND user_type = 'COUNSELLOR';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update counsellor participant role
CREATE TRIGGER trg_update_counsellor_participant
    AFTER UPDATE ON messaging.conversations
    FOR EACH ROW
    EXECUTE FUNCTION messaging.update_counsellor_participant();

-- =====================================================
-- V01_015__fix_messaging_student_references.sql
-- =====================================================


-- First, drop the existing foreign key constraints
ALTER TABLE messaging.conversation_participants
DROP CONSTRAINT IF EXISTS fk_participant_user;

-- Also drop the foreign key constraint on messages table
ALTER TABLE messaging.messages
DROP CONSTRAINT IF EXISTS fk_message_sender;

-- Drop the existing trigger
DROP TRIGGER IF EXISTS trg_add_conversation_participants ON messaging.conversations;

-- Drop the existing function
DROP FUNCTION IF EXISTS messaging.add_conversation_participants();

-- Create a new function that handles both auth.users and student.student
CREATE OR REPLACE FUNCTION messaging.add_conversation_participants()
RETURNS TRIGGER AS $$
BEGIN
    -- Add student as participant (from student.student table)
    INSERT INTO messaging.conversation_participants (conversation_id, user_id, user_type, role, created_by, updated_by)
    VALUES (NEW.conversation_id, NEW.student_id, 'STUDENT', 'PARTICIPANT', NEW.created_by, NEW.updated_by);

    -- Add all counsellors as observers (they can see but not participate until assigned)
    INSERT INTO messaging.conversation_participants (conversation_id, user_id, user_type, role, created_by, updated_by)
    SELECT NEW.conversation_id, u.user_id, 'COUNSELLOR', 'OBSERVER', NEW.created_by, NEW.updated_by
    FROM auth."user" u
    INNER JOIN auth.user_assign_roles ur ON u.user_id = ur.user_id
    INNER JOIN auth.roles r ON ur.role_id = r.role_id
    WHERE r.name = 'Counsellor' AND u.status = 'ACTIVE';

    -- Add all admins as observers
    INSERT INTO messaging.conversation_participants (conversation_id, user_id, user_type, role, created_by, updated_by)
    SELECT NEW.conversation_id, u.user_id, 'ADMIN', 'OBSERVER', NEW.created_by, NEW.updated_by
    FROM auth."user" u
    INNER JOIN auth.user_assign_roles ur ON u.user_id = ur.user_id
    INNER JOIN auth.roles r ON ur.role_id = r.role_id
    WHERE r.name = 'Admin' AND u.status = 'ACTIVE';

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a new trigger
CREATE TRIGGER trg_add_conversation_participants
    AFTER INSERT ON messaging.conversations
    FOR EACH ROW
    EXECUTE FUNCTION messaging.add_conversation_participants();

-- Create a new function to update participant role when counsellor is assigned
CREATE OR REPLACE FUNCTION messaging.update_counsellor_participant()
RETURNS TRIGGER AS $$
BEGIN
    -- If counsellor_id is set, update their role to PARTICIPANT
    IF NEW.counsellor_id IS NOT NULL THEN
        UPDATE messaging.conversation_participants
        SET role = 'PARTICIPANT', updated_at = CURRENT_TIMESTAMP, updated_by = NEW.updated_by
        WHERE conversation_id = NEW.conversation_id
        AND user_id = NEW.counsellor_id
        AND user_type = 'COUNSELLOR';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists, then create new one
DROP TRIGGER IF EXISTS trg_update_counsellor_participant ON messaging.conversations;

-- Create trigger to update counsellor participant role
CREATE TRIGGER trg_update_counsellor_participant
    AFTER UPDATE ON messaging.conversations
    FOR EACH ROW
    EXECUTE FUNCTION messaging.update_counsellor_participant();

-- =====================================================
-- V01_016__add_messages_menu_permissions.sql
-- =====================================================
-- Add MESSAGES_MENU permission to Admin, Counsellor, and Senior Counsellor roles
-- This allows these roles to see the Messages menu item in the frontend

-- Add MESSAGES_MENU permission to Admin role
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
SELECT '589900b3-0413-4328-8859-e8c0ff3cc9b8', permission_id, 'ADMIN', 'ADMIN'
FROM auth.permissions
WHERE action = 'MESSAGES_MENU'
AND NOT EXISTS (
    SELECT 1 FROM auth.role_permissions rp
    WHERE rp.role_id = '589900b3-0413-4328-8859-e8c0ff3cc9b8'
    AND rp.permission_id = (SELECT permission_id FROM auth.permissions WHERE action = 'MESSAGES_MENU')
);

-- Add MESSAGES_MENU permission to Counsellor role
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
SELECT '5d415ea6-84dd-490a-b790-b8f5a314c47e', permission_id, 'ADMIN', 'ADMIN'
FROM auth.permissions
WHERE action = 'MESSAGES_MENU'
AND NOT EXISTS (
    SELECT 1 FROM auth.role_permissions rp
    WHERE rp.role_id = '5d415ea6-84dd-490a-b790-b8f5a314c47e'
    AND rp.permission_id = (SELECT permission_id FROM auth.permissions WHERE action = 'MESSAGES_MENU')
);

-- Add MESSAGES_MENU permission to Senior Counsellor role
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
SELECT '6563c720-a750-44cc-b3a4-79c1aaa2abe4', permission_id, 'ADMIN', 'ADMIN'
FROM auth.permissions
WHERE action = 'MESSAGES_MENU'
AND NOT EXISTS (
    SELECT 1 FROM auth.role_permissions rp
    WHERE rp.role_id = '6563c720-a750-44cc-b3a4-79c1aaa2abe4'
    AND rp.permission_id = (SELECT permission_id FROM auth.permissions WHERE action = 'MESSAGES_MENU')
);

-- =====================================================
-- V01_017__applications_system.sql
-- =====================================================
-- Create applications schema
CREATE SCHEMA IF NOT EXISTS applications;

-- Create applications table
CREATE TABLE IF NOT EXISTS applications.applications (
    application_id uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    student_id uuid NOT NULL,
    student_name varchar(255) NOT NULL,
    application_type varchar(50) NOT NULL, -- 'LOAN' or 'SCHOLARSHIP'
    application_title varchar(255) NOT NULL, -- Bank name for loans, Scholarship name for scholarships
    application_details text, -- Additional details like loan amount, scholarship amount, etc.
    status varchar(50) DEFAULT 'PENDING' NOT NULL, -- 'PENDING', 'APPROVED', 'REJECTED', 'UNDER_REVIEW'
    applied_date timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    reviewed_by uuid, -- Admin/Counsellor who reviewed
    reviewed_date timestamp,
    review_notes text,
    created_by varchar(150) NOT NULL,
    updated_by varchar(150) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- Constraints
    CONSTRAINT fk_application_student FOREIGN KEY (student_id)
        REFERENCES student.student(student_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_application_reviewer FOREIGN KEY (reviewed_by)
        REFERENCES auth."user"(user_id)
        ON DELETE SET NULL,

    CONSTRAINT chk_application_type CHECK (application_type IN ('LOAN', 'SCHOLARSHIP')),
    CONSTRAINT chk_application_status CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'UNDER_REVIEW'))
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_applications_student_id ON applications.applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_type ON applications.applications(application_type);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications.applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_applied_date ON applications.applications(applied_date);

-- Create permission object for applications
INSERT INTO auth.permission_objects
            (permission_object_id,
             NAME,
             request_url,
             created_by,
             updated_by)
VALUES      ('a1b2c3d4-e5f6-7890-abcd-ef1234567890',
             'Applications',
             '/portal-api/applications',
             'system',
             'system');

-- Insert permissions for applications
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
VALUES    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890',
           'APPLICATIONS_MENU',
           'system',
           'system',
           'Access to Applications menu',
           'read',
           NULL,
           'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
           'GET',
           false,
           '/applications'),
          ('b2c3d4e5-f6a7-8901-bcde-f23456789012',
           'APPLICATIONS_CREATE',
           'system',
           'system',
           'Create new applications',
           'create',
           NULL,
           'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
           'POST',
           false,
           '/applications'),
          ('c3d4e5f6-a7b8-9012-cdef-345678901234',
           'APPLICATIONS_READ',
           'system',
           'system',
           'Read applications',
           'read',
           NULL,
           'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
           'GET',
           false,
           '/applications'),
          ('d4e5f6a7-b8c9-0123-defa-456789012345',
           'APPLICATIONS_UPDATE',
           'system',
           'system',
           'Update applications',
           'update',
           NULL,
           'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
           'PUT',
           false,
           '/applications'),
          ('e5f6a7b8-c9d0-1234-efab-567890123456',
           'APPLICATIONS_DELETE',
           'system',
           'system',
           'Delete applications',
           'delete',
           NULL,
           'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
           'DELETE',
           false,
           '/applications');

-- Assign permissions to roles
-- Admin role gets all permissions
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES
    ('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'system', 'system'),
    ('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'b2c3d4e5-f6a7-8901-bcde-f23456789012', 'system', 'system'),
    ('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'c3d4e5f6-a7b8-9012-cdef-345678901234', 'system', 'system'),
    ('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'd4e5f6a7-b8c9-0123-defa-456789012345', 'system', 'system'),
    ('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'e5f6a7b8-c9d0-1234-efab-567890123456', 'system', 'system');

-- Manager role gets all permissions
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES
    ('4ccb49d7-359b-45bd-b24b-1a337c7bd458', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'system', 'system'),
    ('4ccb49d7-359b-45bd-b24b-1a337c7bd458', 'b2c3d4e5-f6a7-8901-bcde-f23456789012', 'system', 'system'),
    ('4ccb49d7-359b-45bd-b24b-1a337c7bd458', 'c3d4e5f6-a7b8-9012-cdef-345678901234', 'system', 'system'),
    ('4ccb49d7-359b-45bd-b24b-1a337c7bd458', 'd4e5f6a7-b8c9-0123-defa-456789012345', 'system', 'system'),
    ('4ccb49d7-359b-45bd-b24b-1a337c7bd458', 'e5f6a7b8-c9d0-1234-efab-567890123456', 'system', 'system');

-- Senior Counsellor role gets all permissions
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES
    ('6563c720-a750-44cc-b3a4-79c1aaa2abe4', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'system', 'system'),
    ('6563c720-a750-44cc-b3a4-79c1aaa2abe4', 'b2c3d4e5-f6a7-8901-bcde-f23456789012', 'system', 'system'),
    ('6563c720-a750-44cc-b3a4-79c1aaa2abe4', 'c3d4e5f6-a7b8-9012-cdef-345678901234', 'system', 'system'),
    ('6563c720-a750-44cc-b3a4-79c1aaa2abe4', 'd4e5f6a7-b8c9-0123-defa-456789012345', 'system', 'system'),
    ('6563c720-a750-44cc-b3a4-79c1aaa2abe4', 'e5f6a7b8-c9d0-1234-efab-567890123456', 'system', 'system');

-- Counsellor role gets all permissions
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES
    ('5d415ea6-84dd-490a-b790-b8f5a314c47e', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'system', 'system'),
    ('5d415ea6-84dd-490a-b790-b8f5a314c47e', 'b2c3d4e5-f6a7-8901-bcde-f23456789012', 'system', 'system'),
    ('5d415ea6-84dd-490a-b790-b8f5a314c47e', 'c3d4e5f6-a7b8-9012-cdef-345678901234', 'system', 'system'),
    ('5d415ea6-84dd-490a-b790-b8f5a314c47e', 'd4e5f6a7-b8c9-0123-defa-456789012345', 'system', 'system'),
    ('5d415ea6-84dd-490a-b790-b8f5a314c47e', 'e5f6a7b8-c9d0-1234-efab-567890123456', 'system', 'system');

-- Student role gets only create and read permissions
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES
    ('85396e7c-1bf2-40cf-a03c-744fb6b9fa9f', 'b2c3d4e5-f6a7-8901-bcde-f23456789012', 'system', 'system'),
    ('85396e7c-1bf2-40cf-a03c-744fb6b9fa9f', 'c3d4e5f6-a7b8-9012-cdef-345678901234', 'system', 'system');

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION applications.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trg_applications_updated_at
    BEFORE UPDATE ON applications.applications
    FOR EACH ROW
    EXECUTE FUNCTION applications.update_updated_at_column();

-- =====================================================
-- V01_018__colleges_edit_delete_permissions.sql
-- =====================================================


-- Add EDIT_COLLEGE permission
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
VALUES    ('a1b2c3d4-e5f6-7890-abcd-ef1234567891',
           'Edit College',
           'ADMIN',
           'ADMIN',
           'Edit College',
           'EDIT_COLLEGE',
           NULL,
           'a1bbb4f9-ad0e-4600-881d-b59db667c956',
           '',
           false,
           '');

-- Add DELETE_COLLEGE permission
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
VALUES    ('b2c3d4e5-f6a7-8901-bcde-f23456789013',
           'Delete College',
           'ADMIN',
           'ADMIN',
           'Delete College',
           'DELETE_COLLEGE',
           NULL,
           'a1bbb4f9-ad0e-4600-881d-b59db667c956',
           '',
           false,
           '');

-- Assign EDIT_COLLEGE permission to Admin role only
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'a1b2c3d4-e5f6-7890-abcd-ef1234567891', 'ADMIN', 'ADMIN'); -- Admin role

-- Assign DELETE_COLLEGE permission to Admin role only
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES ('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'b2c3d4e5-f6a7-8901-bcde-f23456789013', 'ADMIN', 'ADMIN'); -- Admin role

-- Note: Student role ('85396e7c-1bf2-40cf-a03c-744fb6b9fa9f') is intentionally excluded
-- Students only have COLLEGES_MENU permission for view-only access

-- =====================================================
-- V01_019__colleges_enhanced_fields.sql
-- =====================================================
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

-- =====================================================
-- V01_020__add_college_application_type.sql
-- =====================================================
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

-- =====================================================
-- V01_021__remove_masters_menu_permission.sql
-- =====================================================
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

-- =====================================================
-- V01_022__add_student_state_city.sql
-- =====================================================
-- V01_022__add_student_state_city.sql
-- Add state and city columns to student table for registration

-- Add state column to student table
ALTER TABLE student.student ADD COLUMN IF NOT EXISTS state varchar(100) NULL;

-- Add city column to student table
ALTER TABLE student.student ADD COLUMN IF NOT EXISTS city varchar(100) NULL;

-- Add comments to document the new columns
COMMENT ON COLUMN student.student.state IS 'State where the student is located';
COMMENT ON COLUMN student.student.city IS 'City where the student is located';

-- =====================================================
-- V01_023__add_student_followup_tracking.sql
-- =====================================================
-- V01_023__add_student_followup_tracking.sql
-- Add student followup tracking table for managing student followups (hot calling, cold, warm, etc.)

CREATE TABLE IF NOT EXISTS student.student_followup (
    followup_id uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    student_id uuid NOT NULL,
    followup_type varchar(50) NOT NULL, -- 'HOT_CALLING', 'COLD', 'WARM', 'FOLLOWUP', 'CLOSED'
    followup_date timestamp NOT NULL,
    notes text,
    counsellor_id uuid, -- Admin/Counsellor who conducted the followup
    next_followup_date timestamp,
    status varchar(50) DEFAULT 'SCHEDULED', -- 'SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED'
    created_by varchar(150) NOT NULL,
    updated_by varchar(150) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- Constraints
    CONSTRAINT fk_followup_student FOREIGN KEY (student_id)
        REFERENCES student.student(student_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_followup_counsellor FOREIGN KEY (counsellor_id)
        REFERENCES auth."user"(user_id)
        ON DELETE SET NULL,

    CONSTRAINT chk_followup_type CHECK (followup_type IN ('HOT', 'COLD', 'WARM', 'FOLLOWUP', 'CLOSED')),
    CONSTRAINT chk_followup_status CHECK (status IN ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED'))
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_followup_student_id ON student.student_followup(student_id);
CREATE INDEX IF NOT EXISTS idx_followup_counsellor_id ON student.student_followup(counsellor_id);
CREATE INDEX IF NOT EXISTS idx_followup_date ON student.student_followup(followup_date);
CREATE INDEX IF NOT EXISTS idx_followup_type ON student.student_followup(followup_type);
CREATE INDEX IF NOT EXISTS idx_followup_status ON student.student_followup(status);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION student.update_student_followup_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trg_student_followup_updated_at
    BEFORE UPDATE ON student.student_followup
    FOR EACH ROW
    EXECUTE FUNCTION student.update_student_followup_updated_at();

-- Add comment to document the table
COMMENT ON TABLE student.student_followup IS 'Tracks student followups including hot calling, cold calling, warm leads, and followup activities';

-- =====================================================
-- V01_024__fix_student_assigned_colleges_schema.sql
-- =====================================================
-- Fix student_assigned_colleges table schema and structure
-- Move from student schema to common schema and add missing columns

-- Drop the old table if it exists in student schema
DROP TABLE IF EXISTS student.student_assigned_colleges;

-- Create the table in common schema with all required fields
CREATE TABLE IF NOT EXISTS common.student_assigned_colleges (
    assignment_id uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    student_id uuid NOT NULL,
    college_id uuid NOT NULL,
    assignment_type varchar(50) DEFAULT 'INTERESTED' NOT NULL,
    assignment_status varchar(50) DEFAULT 'ACTIVE' NOT NULL,
    priority_order integer,
    application_date date,
    admission_date date,
    enrollment_date date,
    course_name varchar(255),
    specialization varchar(255),
    semester varchar(10),
    student_notes text,
    counsellor_notes text,
    assigned_by uuid,
    assigned_date timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by varchar(150) NOT NULL,
    updated_by varchar(150) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- Constraints
    CONSTRAINT fk_assignment_student FOREIGN KEY (student_id)
        REFERENCES student.student(student_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_assignment_college FOREIGN KEY (college_id)
        REFERENCES common.colleges(college_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_assignment_user FOREIGN KEY (assigned_by)
        REFERENCES auth."user"(user_id)
        ON DELETE SET NULL,

    CONSTRAINT chk_assignment_type CHECK (assignment_type IN ('INTERESTED', 'APPLIED', 'ADMITTED', 'ENROLLED', 'REJECTED', 'WAITLISTED')),
    CONSTRAINT chk_assignment_status CHECK (assignment_status IN ('ACTIVE', 'INACTIVE', 'COMPLETED', 'CANCELLED'))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_student_assigned_colleges_student_id ON common.student_assigned_colleges(student_id);
CREATE INDEX IF NOT EXISTS idx_student_assigned_colleges_college_id ON common.student_assigned_colleges(college_id);
CREATE INDEX IF NOT EXISTS idx_student_assigned_colleges_assignment_type ON common.student_assigned_colleges(assignment_type);
CREATE INDEX IF NOT EXISTS idx_student_assigned_colleges_assignment_status ON common.student_assigned_colleges(assignment_status);

-- Create unique partial index: Only one ACTIVE assignment per student-college pair
-- This allows multiple assignments with different statuses (e.g., INTERESTED -> APPLIED -> ADMITTED)
-- but prevents duplicate active assignments
CREATE UNIQUE INDEX IF NOT EXISTS uq_student_college_active
    ON common.student_assigned_colleges(student_id, college_id)
    WHERE assignment_status = 'ACTIVE';

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION common.update_student_assigned_colleges_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trg_student_assigned_colleges_updated_at
    BEFORE UPDATE ON common.student_assigned_colleges
    FOR EACH ROW
    EXECUTE FUNCTION common.update_student_assigned_colleges_updated_at_column();

-- =====================================================
-- V01_025__create_assigned_students_table.sql
-- =====================================================
-- V01_025__create_assigned_students_table.sql
-- Create assigned_students table for assigning students to counsellors/admins

CREATE TABLE IF NOT EXISTS common.assigned_students (
    assignment_id uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    student_id uuid NOT NULL,
    assigned_to uuid NOT NULL, -- User ID (counsellor/admin)
    assignment_status varchar(50) DEFAULT 'ACTIVE' NOT NULL,
    assigned_by uuid NOT NULL, -- Admin who made the assignment
    assigned_date timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    notes text,
    created_by varchar(150) NOT NULL,
    updated_by varchar(150) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- Constraints
    CONSTRAINT fk_assigned_student FOREIGN KEY (student_id)
        REFERENCES student.student(student_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_assigned_to_user FOREIGN KEY (assigned_to)
        REFERENCES auth."user"(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_assigned_by_user FOREIGN KEY (assigned_by)
        REFERENCES auth."user"(user_id)
        ON DELETE SET NULL,

    CONSTRAINT chk_assignment_status CHECK (assignment_status IN ('ACTIVE', 'INACTIVE', 'COMPLETED', 'TRANSFERRED'))
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assigned_students_student_id ON common.assigned_students(student_id);
CREATE INDEX IF NOT EXISTS idx_assigned_students_assigned_to ON common.assigned_students(assigned_to);
CREATE INDEX IF NOT EXISTS idx_assigned_students_assigned_by ON common.assigned_students(assigned_by);
CREATE INDEX IF NOT EXISTS idx_assigned_students_status ON common.assigned_students(assignment_status);

-- Create unique partial index: Only one ACTIVE assignment per student
-- This allows reassignment by deactivating previous assignment
CREATE UNIQUE INDEX IF NOT EXISTS uq_student_active_assignment
    ON common.assigned_students(student_id)
    WHERE assignment_status = 'ACTIVE';

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION common.update_assigned_students_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trg_assigned_students_updated_at
    BEFORE UPDATE ON common.assigned_students
    FOR EACH ROW
    EXECUTE FUNCTION common.update_assigned_students_updated_at_column();

-- Note: Permissions are typically managed through application-level authentication
-- If you need to grant specific database role permissions, adjust the role name below:
-- GRANT SELECT, INSERT, UPDATE, DELETE ON common.assigned_students TO <your_role_name>;

-- =====================================================
-- V01_026__add_followup_menu_permissions.sql
-- =====================================================
-- V01_026__add_followup_menu_permissions.sql
-- Add FOLLOWUP_MENU permission and assign it to Admin, Manager, Senior Counsellor, and Counsellor roles

-- Insert FOLLOWUP_MENU permission (only if it doesn't exist)
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
           'Followup Menu',
           'ADMIN',
           'ADMIN',
           'followup menu',
           'FOLLOWUP_MENU',
           NULL,
           'a1bbb4f9-ad0e-4600-881d-b59db667c956',
           '',
           false,
           ''
WHERE NOT EXISTS (
    SELECT 1 FROM auth.permissions WHERE action = 'FOLLOWUP_MENU'
);

-- Add FOLLOWUP_MENU permission to Admin role
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
SELECT '589900b3-0413-4328-8859-e8c0ff3cc9b8', permission_id, 'ADMIN', 'ADMIN'
FROM auth.permissions
WHERE action = 'FOLLOWUP_MENU'
AND NOT EXISTS (
    SELECT 1 FROM auth.role_permissions rp
    WHERE rp.role_id = '589900b3-0413-4328-8859-e8c0ff3cc9b8'
    AND rp.permission_id = (SELECT permission_id FROM auth.permissions WHERE action = 'FOLLOWUP_MENU')
);

-- Add FOLLOWUP_MENU permission to Manager role
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
SELECT '4ccb49d7-359b-45bd-b24b-1a337c7bd458', permission_id, 'ADMIN', 'ADMIN'
FROM auth.permissions
WHERE action = 'FOLLOWUP_MENU'
AND NOT EXISTS (
    SELECT 1 FROM auth.role_permissions rp
    WHERE rp.role_id = '4ccb49d7-359b-45bd-b24b-1a337c7bd458'
    AND rp.permission_id = (SELECT permission_id FROM auth.permissions WHERE action = 'FOLLOWUP_MENU')
);

-- Add FOLLOWUP_MENU permission to Senior Counsellor role
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
SELECT '6563c720-a750-44cc-b3a4-79c1aaa2abe4', permission_id, 'ADMIN', 'ADMIN'
FROM auth.permissions
WHERE action = 'FOLLOWUP_MENU'
AND NOT EXISTS (
    SELECT 1 FROM auth.role_permissions rp
    WHERE rp.role_id = '6563c720-a750-44cc-b3a4-79c1aaa2abe4'
    AND rp.permission_id = (SELECT permission_id FROM auth.permissions WHERE action = 'FOLLOWUP_MENU')
);

-- Add FOLLOWUP_MENU permission to Counsellor role
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
SELECT '5d415ea6-84dd-490a-b790-b8f5a314c47e', permission_id, 'ADMIN', 'ADMIN'
FROM auth.permissions
WHERE action = 'FOLLOWUP_MENU'
AND NOT EXISTS (
    SELECT 1 FROM auth.role_permissions rp
    WHERE rp.role_id = '5d415ea6-84dd-490a-b790-b8f5a314c47e'
    AND rp.permission_id = (SELECT permission_id FROM auth.permissions WHERE action = 'FOLLOWUP_MENU')
);

-- =====================================================
-- V01_027__add_chatbot_menu_permissions.sql
-- =====================================================
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

-- =====================================================
-- V01_028__student_calendar_permission_remove.sql
-- =====================================================
DELETE FROM auth.role_permissions rp
WHERE rp.role_id = '85396e7c-1bf2-40cf-a03c-744fb6b9fa9f' -- Student role
AND rp.permission_id = (
  SELECT permission_id
  FROM auth.permissions
  WHERE action = 'CALENDAR_MENU'
);

ALTER TABLE student.student
ADD COLUMN student_serial_id SERIAL;

-- =====================================================
-- V01_029__manager_management_permissions.sql
-- =====================================================
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

-- =====================================================
-- V01_030__exams_management.sql
-- =====================================================
-- Create exams table and add permissions for management and public listing

CREATE SCHEMA IF NOT EXISTS common;

CREATE TABLE IF NOT EXISTS common.exams (
    exam_id uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    name varchar(255) NOT NULL,
    category varchar(100) NOT NULL, -- Engineering, Medical, Management, Law, etc.
    description text NULL,
    exam_date date NULL,
    start_date date NULL,
    end_date date NULL,
    status varchar(50) DEFAULT 'UPCOMING' NOT NULL, -- UPCOMING | CURRENT | COMPLETED
    is_active boolean DEFAULT true NOT NULL,
    created_by varchar(150) NOT NULL,
    updated_by varchar(150) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_exams_category ON common.exams(category);
CREATE INDEX IF NOT EXISTS idx_exams_is_active ON common.exams(is_active);
CREATE INDEX IF NOT EXISTS idx_exams_status ON common.exams(status);
CREATE INDEX IF NOT EXISTS idx_exams_dates ON common.exams(exam_date, start_date, end_date);

-- Permissions
-- Reuse existing permission object id for Users/API routing used elsewhere
-- Or create a new object if needed. Using existing 'Users' object: a1bbb4f9-ad0e-4600-881d-b59db667c956

-- Exams Management Menu (for admin/manager/counsellor)
INSERT INTO auth.permissions (
  permission_id, name, created_by, updated_by, description, action, condition, object_id, request_method, override_object_url, path
) VALUES (
  'b9f5f9c8-2f1e-4e6a-9a8b-2a2f5c9b0e7a',
  'Exams Management Menu',
  'ADMIN',
  'ADMIN',
  'exams management menu',
  'EXAMS_MANAGEMENT_MENU',
  NULL,
  'a1bbb4f9-ad0e-4600-881d-b59db667c956',
  'GET',
  false,
  '/examinations'
)
ON CONFLICT DO NOTHING;

-- Assign to Admin, Manager, Counsellor
-- Admin role id: 589900b3-0413-4328-8859-e8c0ff3cc9b8
-- Manager role id: 4ccb49d7-359b-45bd-b24b-1a337c7bd458
-- Senior Counsellor role id: 6563c720-a750-44cc-b3a4-79c1aaa2abe4
-- Counsellor role id: 5d415ea6-84dd-490a-b790-b8f5a314c47e

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
SELECT '589900b3-0413-4328-8859-e8c0ff3cc9b8', 'b9f5f9c8-2f1e-4e6a-9a8b-2a2f5c9b0e7a', 'ADMIN', 'ADMIN'
WHERE NOT EXISTS (
  SELECT 1 FROM auth.role_permissions WHERE role_id = '589900b3-0413-4328-8859-e8c0ff3cc9b8' AND permission_id = 'b9f5f9c8-2f1e-4e6a-9a8b-2a2f5c9b0e7a'
);

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
SELECT '4ccb49d7-359b-45bd-b24b-1a337c7bd458', 'b9f5f9c8-2f1e-4e6a-9a8b-2a2f5c9b0e7a', 'ADMIN', 'ADMIN'
WHERE NOT EXISTS (
  SELECT 1 FROM auth.role_permissions WHERE role_id = '4ccb49d7-359b-45bd-b24b-1a337c7bd458' AND permission_id = 'b9f5f9c8-2f1e-4e6a-9a8b-2a2f5c9b0e7a'
);

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
SELECT '6563c720-a750-44cc-b3a4-79c1aaa2abe4', 'b9f5f9c8-2f1e-4e6a-9a8b-2a2f5c9b0e7a', 'ADMIN', 'ADMIN'
WHERE NOT EXISTS (
  SELECT 1 FROM auth.role_permissions WHERE role_id = '6563c720-a750-44cc-b3a4-79c1aaa2abe4' AND permission_id = 'b9f5f9c8-2f1e-4e6a-9a8b-2a2f5c9b0e7a'
);

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
SELECT '5d415ea6-84dd-490a-b790-b8f5a314c47e', 'b9f5f9c8-2f1e-4e6a-9a8b-2a2f5c9b0e7a', 'ADMIN', 'ADMIN'
WHERE NOT EXISTS (
  SELECT 1 FROM auth.role_permissions WHERE role_id = '5d415ea6-84dd-490a-b790-b8f5a314c47e' AND permission_id = 'b9f5f9c8-2f1e-4e6a-9a8b-2a2f5c9b0e7a'
);

-- =====================================================
-- V01_031__exams_additional_fields.sql
-- =====================================================
-- Add more detailed fields to common.exams

ALTER TABLE common.exams
  ADD COLUMN IF NOT EXISTS application_start_date date NULL,
  ADD COLUMN IF NOT EXISTS application_end_date date NULL,
  ADD COLUMN IF NOT EXISTS registration_url varchar(500) NULL,
  ADD COLUMN IF NOT EXISTS official_website varchar(500) NULL,
  ADD COLUMN IF NOT EXISTS eligibility text NULL,
  ADD COLUMN IF NOT EXISTS exam_mode varchar(50) NULL, -- ONLINE/OFFLINE/HYBRID
  ADD COLUMN IF NOT EXISTS exam_level varchar(50) NULL, -- NATIONAL/STATE/INSTITUTE
  ADD COLUMN IF NOT EXISTS subjects text[] NULL,
  ADD COLUMN IF NOT EXISTS application_fee decimal(10,2) NULL,
  ADD COLUMN IF NOT EXISTS conducting_body varchar(255) NULL;

CREATE INDEX IF NOT EXISTS idx_exams_level ON common.exams(exam_level);
CREATE INDEX IF NOT EXISTS idx_exams_mode ON common.exams(exam_mode);

-- =====================================================
-- V01_032__exams_defaults.sql
-- =====================================================
-- Set default values for exam_level and exam_mode

ALTER TABLE common.exams
  ALTER COLUMN exam_level SET DEFAULT 'NATIONAL';

ALTER TABLE common.exams
  ALTER COLUMN exam_mode SET DEFAULT 'ONLINE';

-- Optionally backfill existing NULLs to defaults for consistency
UPDATE common.exams SET exam_level = 'NATIONAL' WHERE exam_level IS NULL;
UPDATE common.exams SET exam_mode = 'ONLINE' WHERE exam_mode IS NULL;

-- =====================================================
-- V01_033__student_academic_profile.sql
-- =====================================================
-- Student academic profile details

CREATE TABLE IF NOT EXISTS student.student_academic_profile (
    student_id uuid PRIMARY KEY REFERENCES student.student(student_id) ON DELETE CASCADE,
    tenth_marks_percent numeric(5,2) NULL,
    inter_first_year_percent numeric(5,2) NULL,
    inter_second_year_percent numeric(5,2) NULL,
    competitive_exams text[] NULL,
    created_by varchar(150) NOT NULL DEFAULT 'SYSTEM',
    updated_by varchar(150) NOT NULL DEFAULT 'SYSTEM',
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_student_academic_profile_student ON student.student_academic_profile(student_id);

-- =====================================================
-- V01_034__student_family_details.sql
-- =====================================================
-- Add family details to student academic profile

ALTER TABLE student.student_academic_profile
  ADD COLUMN IF NOT EXISTS father_name varchar(150) NULL,
  ADD COLUMN IF NOT EXISTS father_mobile varchar(20) NULL,
  ADD COLUMN IF NOT EXISTS father_occupation varchar(150) NULL,
  ADD COLUMN IF NOT EXISTS mother_name varchar(150) NULL,
  ADD COLUMN IF NOT EXISTS mother_mobile varchar(20) NULL,
  ADD COLUMN IF NOT EXISTS mother_occupation varchar(150) NULL;

-- =====================================================
-- V01_035__student_intermediate_stream.sql
-- =====================================================
-- Add intermediate (+12) stream to student academic profile

ALTER TABLE student.student_academic_profile
  ADD COLUMN IF NOT EXISTS inter_stream varchar(50) NULL;

-- =====================================================
-- V01_036__course_update.sql
-- =====================================================
delete from student.course
where course_id ='27df62ec-d325-4ba7-8a74-281466974fdb'; --removed course social work

update student.course
set name = 'Medicine (MBBS, PG)'
where name = 'Medicine';

update student.course
set name = 'Engineering (BE, BTech, MTech)'
where name = 'Engineering';

-- =====================================================
-- V01_037__blogs_and_news.sql
-- =====================================================
-- =====================================================
-- Blog/News Management System
-- Version: V01_036
-- Description: Creates blogs table for blog posts and news articles
-- Schema: common (for public content)
-- =====================================================

-- Blogs/News Articles Table
CREATE TABLE IF NOT EXISTS common.blogs (
    blog_id uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,

    -- Basic Info
    heading varchar(500) NOT NULL,
    tagline varchar(1000),
    slug varchar(500) NOT NULL UNIQUE,

    -- Content Sections (stored as TEXT, can be rich HTML/Markdown)
    section_1 text,
    section_2 text,
    section_3 text,

    -- Featured Image
    -- featured_image_url varchar(1000),

    -- Author Information
    author_signature text,
    author_name varchar(255),
    author_id uuid REFERENCES auth."user"(user_id) ON DELETE SET NULL,

    -- Publishing
    is_published boolean DEFAULT false NOT NULL,
    published_at timestamp,

    -- Additional Metadata
    category varchar(100), -- e.g., 'Admissions', 'Scholarships', 'Career Guidance'
    tags text, -- Comma-separated tags
    view_count integer DEFAULT 0,

    -- SEO
    meta_description text,

    -- Audit Fields
    is_active boolean DEFAULT true NOT NULL,
    created_by varchar(150) NOT NULL,
    updated_by varchar(150) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_blogs_blog_id ON common.blogs(blog_id);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON common.blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_is_published ON common.blogs(is_published);
CREATE INDEX IF NOT EXISTS idx_blogs_published_at ON common.blogs(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON common.blogs(category);
CREATE INDEX IF NOT EXISTS idx_blogs_author_id ON common.blogs(author_id);
CREATE INDEX IF NOT EXISTS idx_blogs_is_active ON common.blogs(is_active);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON common.blogs(created_at DESC);

-- Comments for documentation
COMMENT ON TABLE common.blogs IS 'Stores blog posts and news articles for Campus Yatra platform';
COMMENT ON COLUMN common.blogs.heading IS 'Main title/heading of the blog post';
COMMENT ON COLUMN common.blogs.tagline IS 'Short subtitle or tagline';
COMMENT ON COLUMN common.blogs.slug IS 'URL-friendly unique identifier';
COMMENT ON COLUMN common.blogs.section_1 IS 'First content section (supports HTML/Markdown)';
COMMENT ON COLUMN common.blogs.section_2 IS 'Second content section (supports HTML/Markdown)';
COMMENT ON COLUMN common.blogs.section_3 IS 'Third content section (supports HTML/Markdown)';
COMMENT ON COLUMN common.blogs.is_published IS 'Whether the blog is publicly visible';
COMMENT ON COLUMN common.blogs.published_at IS 'Timestamp when the blog was published';

-- Add permissions for blog management
INSERT INTO auth.permissions
    (permission_id, NAME, created_by, updated_by, description, action, condition, object_id, request_method, override_object_url, path)
VALUES
    ('f8a9d123-4567-89ab-cdef-123456789abc', 'Blog Management Menu', 'ADMIN', 'ADMIN', 'Access to blog management section', 'BLOG_MANAGEMENT_MENU', NULL, 'a1bbb4f9-ad0e-4600-881d-b59db667c956', '', false, ''),
    ('f8a9d123-4567-89ab-cdef-123456789abd', 'View Blogs', 'ADMIN', 'ADMIN', 'View all blogs', 'VIEW_BLOGS', NULL, 'a1bbb4f9-ad0e-4600-881d-b59db667c956', '', false, ''),
    ('f8a9d123-4567-89ab-cdef-123456789abe', 'Create Blog', 'ADMIN', 'ADMIN', 'Create new blog posts', 'CREATE_BLOG', NULL, 'a1bbb4f9-ad0e-4600-881d-b59db667c956', '', false, ''),
    ('f8a9d123-4567-89ab-cdef-123456789abf', 'Edit Blog', 'ADMIN', 'ADMIN', 'Edit existing blog posts', 'EDIT_BLOG', NULL, 'a1bbb4f9-ad0e-4600-881d-b59db667c956', '', false, ''),
    ('f8a9d123-4567-89ab-cdef-123456789ac0', 'Delete Blog', 'ADMIN', 'ADMIN', 'Delete blog posts', 'DELETE_BLOG', NULL, 'a1bbb4f9-ad0e-4600-881d-b59db667c956', '', false, ''),
    ('f8a9d123-4567-89ab-cdef-123456789ac1', 'Blogs Menu', 'ADMIN', 'ADMIN', 'Access to blogs viewing section for students', 'BLOGS_MENU', NULL, 'a1bbb4f9-ad0e-4600-881d-b59db667c956', '', false, '')
ON CONFLICT (permission_id) DO NOTHING;

-- Assign all blog permissions to Admin role
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES
    ('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'f8a9d123-4567-89ab-cdef-123456789abc', 'ADMIN', 'ADMIN'), -- Blog Management Menu
    ('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'f8a9d123-4567-89ab-cdef-123456789abd', 'ADMIN', 'ADMIN'), -- View Blogs
    ('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'f8a9d123-4567-89ab-cdef-123456789abe', 'ADMIN', 'ADMIN'), -- Create Blog
    ('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'f8a9d123-4567-89ab-cdef-123456789abf', 'ADMIN', 'ADMIN'), -- Edit Blog
    ('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'f8a9d123-4567-89ab-cdef-123456789ac0', 'ADMIN', 'ADMIN'), -- Delete Blog
    ('589900b3-0413-4328-8859-e8c0ff3cc9b8', 'f8a9d123-4567-89ab-cdef-123456789ac1', 'ADMIN', 'ADMIN')  -- Blogs Menu
ON CONFLICT DO NOTHING;

-- Assign Blog Management Menu to Manager, Senior Counsellor, and Counsellor (NOT Student)
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES
    ('4ccb49d7-359b-45bd-b24b-1a337c7bd458', 'f8a9d123-4567-89ab-cdef-123456789abc', 'ADMIN', 'ADMIN'), -- Manager - Blog Management Menu
    ('6563c720-a750-44cc-b3a4-79c1aaa2abe4', 'f8a9d123-4567-89ab-cdef-123456789abc', 'ADMIN', 'ADMIN'), -- Senior Counsellor - Blog Management Menu
    ('5d415ea6-84dd-490a-b790-b8f5a314c47e', 'f8a9d123-4567-89ab-cdef-123456789abc', 'ADMIN', 'ADMIN'), -- Counsellor - Blog Management Menu
    ('4ccb49d7-359b-45bd-b24b-1a337c7bd458', 'f8a9d123-4567-89ab-cdef-123456789abd', 'ADMIN', 'ADMIN'), -- Manager - View Blogs
    ('6563c720-a750-44cc-b3a4-79c1aaa2abe4', 'f8a9d123-4567-89ab-cdef-123456789abd', 'ADMIN', 'ADMIN'), -- Senior Counsellor - View Blogs
    ('5d415ea6-84dd-490a-b790-b8f5a314c47e', 'f8a9d123-4567-89ab-cdef-123456789abd', 'ADMIN', 'ADMIN'), -- Counsellor - View Blogs
    ('4ccb49d7-359b-45bd-b24b-1a337c7bd458', 'f8a9d123-4567-89ab-cdef-123456789abe', 'ADMIN', 'ADMIN'), -- Manager - Create Blog
    ('6563c720-a750-44cc-b3a4-79c1aaa2abe4', 'f8a9d123-4567-89ab-cdef-123456789abe', 'ADMIN', 'ADMIN'), -- Senior Counsellor - Create Blog
    ('5d415ea6-84dd-490a-b790-b8f5a314c47e', 'f8a9d123-4567-89ab-cdef-123456789abe', 'ADMIN', 'ADMIN'), -- Counsellor - Create Blog
    ('4ccb49d7-359b-45bd-b24b-1a337c7bd458', 'f8a9d123-4567-89ab-cdef-123456789abf', 'ADMIN', 'ADMIN'), -- Manager - Edit Blog
    ('6563c720-a750-44cc-b3a4-79c1aaa2abe4', 'f8a9d123-4567-89ab-cdef-123456789abf', 'ADMIN', 'ADMIN'), -- Senior Counsellor - Edit Blog
    ('5d415ea6-84dd-490a-b790-b8f5a314c47e', 'f8a9d123-4567-89ab-cdef-123456789abf', 'ADMIN', 'ADMIN'), -- Counsellor - Edit Blog
    ('4ccb49d7-359b-45bd-b24b-1a337c7bd458', 'f8a9d123-4567-89ab-cdef-123456789ac0', 'ADMIN', 'ADMIN'), -- Manager - Delete Blog
    ('6563c720-a750-44cc-b3a4-79c1aaa2abe4', 'f8a9d123-4567-89ab-cdef-123456789ac0', 'ADMIN', 'ADMIN'), -- Senior Counsellor - Delete Blog
    ('5d415ea6-84dd-490a-b790-b8f5a314c47e', 'f8a9d123-4567-89ab-cdef-123456789ac0', 'ADMIN', 'ADMIN')  -- Counsellor - Delete Blog
ON CONFLICT DO NOTHING;

-- Assign Latest News Menu permission to all roles (students can view blogs at /latest-news)
INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
VALUES
    ('4ccb49d7-359b-45bd-b24b-1a337c7bd458', 'f8a9d123-4567-89ab-cdef-123456789ac1', 'ADMIN', 'ADMIN'), -- Manager
    ('6563c720-a750-44cc-b3a4-79c1aaa2abe4', 'f8a9d123-4567-89ab-cdef-123456789ac1', 'ADMIN', 'ADMIN'), -- Senior Counsellor
    ('5d415ea6-84dd-490a-b790-b8f5a314c47e', 'f8a9d123-4567-89ab-cdef-123456789ac1', 'ADMIN', 'ADMIN'), -- Counsellor
    ('85396e7c-1bf2-40cf-a03c-744fb6b9fa9f', 'f8a9d123-4567-89ab-cdef-123456789ac1', 'ADMIN', 'ADMIN')  -- Student
ON CONFLICT DO NOTHING;

-- =====================================================
-- V01_038__colleges_alter.sql
-- =====================================================
alter table common.colleges
add column program varchar;

-- =====================================================
-- V01_039__add_student_referral_source.sql
-- =====================================================
-- V01_039__add_student_referral_source.sql
-- Add referral_source column to student table to track how students found the website

-- Add referral_source column to student table
ALTER TABLE student.student ADD COLUMN IF NOT EXISTS referral_source varchar(100) NULL;

-- Add comment to document the new column
COMMENT ON COLUMN student.student.referral_source IS 'How the student found out about the website (e.g., Google Search, Facebook, Friend Referral, etc.)';

-- =====================================================
-- V01_040__user_password.sql
-- =====================================================
alter table auth.user
add column password varchar;

-- =====================================================
-- V01_041__content_manager_role.sql
-- =====================================================
INSERT INTO auth.roles (
role_id,
name,
created_by,
updated_by,
user_type_id,
description,
order_by
)
values
(
'8dc9a62c-d6d4-4733-82f8-de5ba1a2d4c7',
'Content Manager',
'system',
'system',
'9dc1aa09-92ca-4a78-b769-34be42a55780',
'Full system access and administration',
6
);

INSERT INTO auth.role_permissions (role_id, permission_id, created_by, updated_by)
values
('8dc9a62c-d6d4-4733-82f8-de5ba1a2d4c7', '07ef05da-d98b-4284-889d-4eeac3684455', 'ADMIN', 'ADMIN'), -- colleges
('8dc9a62c-d6d4-4733-82f8-de5ba1a2d4c7', '321846f9-3552-48f1-99a2-606514717a95', 'ADMIN', 'ADMIN'), -- colleges
('8dc9a62c-d6d4-4733-82f8-de5ba1a2d4c7', '7050fa57-95af-488f-8a58-6437aa7b2578', 'ADMIN', 'ADMIN'), -- exam menu
('8dc9a62c-d6d4-4733-82f8-de5ba1a2d4c7', 'f8a9d123-4567-89ab-cdef-123456789ac1', 'ADMIN', 'ADMIN'), -- blogs menu
('8dc9a62c-d6d4-4733-82f8-de5ba1a2d4c7', 'f8a9d123-4567-89ab-cdef-123456789abc', 'ADMIN', 'ADMIN'), -- blogs managemnet
('8dc9a62c-d6d4-4733-82f8-de5ba1a2d4c7', 'f8a9d123-4567-89ab-cdef-123456789abd', 'ADMIN', 'ADMIN'), -- View Blogs
('8dc9a62c-d6d4-4733-82f8-de5ba1a2d4c7', 'f8a9d123-4567-89ab-cdef-123456789abe', 'ADMIN', 'ADMIN'), -- Create Blog
('8dc9a62c-d6d4-4733-82f8-de5ba1a2d4c7', 'f8a9d123-4567-89ab-cdef-123456789abf', 'ADMIN', 'ADMIN'), -- Edit Blog
('8dc9a62c-d6d4-4733-82f8-de5ba1a2d4c7', 'f8a9d123-4567-89ab-cdef-123456789ac0', 'ADMIN', 'ADMIN'); -- Delete Blog

Delete from student.course
where name = 'Social Work';

-- =====================================================
-- V01_042__blog_images.sql
-- =====================================================
CREATE TABLE IF NOT EXISTS common.blog_images (
    image_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    blog_id uuid NOT NULL REFERENCES common.blogs(blog_id) ON DELETE CASCADE,
    image_url varchar(1000) NOT NULL,             -- Full S3 URL or CDN URL
    alt_text varchar(500),                        -- SEO friendly alt text
    caption text,                                 -- Optional caption under image (if needed)
    image_order int DEFAULT 1,                    -- Controls display order
    is_featured boolean DEFAULT false,            -- Optional: mark one image as featured
    created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by varchar(150),
    updated_by varchar(150)
);


-- =====================================================
-- V01_043__add_notifications_menu_permission_student.sql
-- =====================================================
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

