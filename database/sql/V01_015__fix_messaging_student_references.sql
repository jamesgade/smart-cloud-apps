

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

