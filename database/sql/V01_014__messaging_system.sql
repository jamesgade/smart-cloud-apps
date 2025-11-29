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
