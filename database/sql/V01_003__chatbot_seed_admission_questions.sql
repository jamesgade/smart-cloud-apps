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


