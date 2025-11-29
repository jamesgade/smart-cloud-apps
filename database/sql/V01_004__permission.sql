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





