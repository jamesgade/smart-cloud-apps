DELETE FROM auth.role_permissions rp
WHERE rp.role_id = '85396e7c-1bf2-40cf-a03c-744fb6b9fa9f' -- Student role
AND rp.permission_id = (
  SELECT permission_id
  FROM auth.permissions
  WHERE action = 'CALENDAR_MENU'
);

ALTER TABLE student.student
ADD COLUMN student_serial_id SERIAL;
