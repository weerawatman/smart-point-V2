-- Add Manager to employees table
-- This allows managers to also receive points like regular employees

-- Insert MGR001 into employees table
INSERT INTO employees (employee_id, points, total_earned, tier) 
VALUES ('MGR001', 0, 0, 'Bronze')
ON CONFLICT (employee_id) DO NOTHING;

-- Note: You can run this SQL in Supabase SQL Editor
-- After running this, MGR001 will be able to receive points like other employees
