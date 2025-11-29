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


