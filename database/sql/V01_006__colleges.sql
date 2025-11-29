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
