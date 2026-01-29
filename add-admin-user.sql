-- Add Admin user (auto UUID)
-- This will auto-generate the UUID if you omit id

-- Ensure default UUID generator is set
alter table users alter column id set default gen_random_uuid();

-- Insert admin user (change employee_id/password/name as needed)
insert into users (employee_id, password, name, role, avatar)
values ('ADM001', '123456', 'ผู้ดูแลระบบ', 'admin', '🛡️')
ON CONFLICT (employee_id) DO NOTHING;

-- Optional: allow admin to receive points
insert into employees (employee_id, points, total_earned, tier)
values ('ADM001', 0, 0, 'Bronze')
ON CONFLICT (employee_id) DO NOTHING;
