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
