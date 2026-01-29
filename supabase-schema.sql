-- ===========================
-- SMART Rewards Database Schema
-- Supabase PostgreSQL
-- ===========================

-- 1. Users Table
create table users (
  id uuid default gen_random_uuid() primary key,
  employee_id text unique not null,
  password text not null,
  name text not null,
  role text not null check (role in ('manager', 'employee', 'admin')),
  avatar text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table users enable row level security;

-- Policy: Anyone can read users (for login)
create policy "Anyone can read users"
  on users for select
  using (true);

-- ===========================

-- 2. Employees Table
create table employees (
  id uuid default gen_random_uuid() primary key,
  employee_id text unique not null references users(employee_id) on delete cascade,
  points integer default 0 not null,
  total_earned integer default 0 not null,
  tier text default 'Bronze' not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table employees enable row level security;

-- Policy: Anyone can read employee data
create policy "Anyone can read employees"
  on employees for select
  using (true);

-- Policy: Anyone can update employees (for points allocation)
create policy "Anyone can update employees"
  on employees for update
  using (true);

-- ===========================

-- 3. Allocations Table
create table allocations (
  id uuid default gen_random_uuid() primary key,
  manager_id text not null references users(employee_id),
  manager_name text not null,
  employee_id text not null references users(employee_id),
  employee_name text not null,
  points integer not null default 1,
  reason text not null,
  smart_value text not null check (smart_value in ('S', 'M', 'A', 'R', 'T', 'O')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table allocations enable row level security;

-- Policy: Anyone can read allocations
create policy "Anyone can read allocations"
  on allocations for select
  using (true);

-- Policy: Anyone can create allocations
create policy "Anyone can create allocations"
  on allocations for insert
  with check (true);

-- ===========================

-- 4. Transactions Table
create table transactions (
  id uuid default gen_random_uuid() primary key,
  employee_id text not null references users(employee_id),
  reward_id text not null,
  reward_name text not null,
  points integer not null,
  type text not null default 'redeem',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table transactions enable row level security;

-- Policy: Anyone can read transactions
create policy "Anyone can read transactions"
  on transactions for select
  using (true);

-- Policy: Anyone can create transactions
create policy "Anyone can create transactions"
  on transactions for insert
  with check (true);

-- ===========================
-- 5. Rewards Table
create table rewards (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text not null,
  points integer not null,
  category text not null,
  image_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table rewards enable row level security;

create policy "Anyone can read rewards"
  on rewards for select
  using (true);

create policy "Anyone can create rewards"
  on rewards for insert
  with check (true);

create policy "Anyone can update rewards"
  on rewards for update
  using (true);

create policy "Anyone can delete rewards"
  on rewards for delete
  using (true);

-- ===========================
-- Insert Demo Data
-- ===========================

-- Insert demo users
insert into users (employee_id, password, name, role, avatar) values
  ('MGR001', '123456', 'ผู้จัดการ สมศักดิ์', 'manager', '👔'),
  ('EMP001', '123456', 'สมชาย ใจดี', 'employee', '👤'),
  ('EMP002', '123456', 'สมหญิง รักงาน', 'employee', '👤'),
  ('EMP003', '123456', 'วิชัย มานะ', 'employee', '👤'),
  ('EMP004', '123456', 'ปรียา สุขใจ', 'employee', '👤'),
  ('EMP005', '123456', 'ธนา เก่งกาจ', 'employee', '👤');

-- Insert demo employees (including manager - everyone can receive points)
insert into employees (employee_id, points, total_earned, tier) values
  ('MGR001', 0, 0, 'Bronze'),
  ('EMP001', 150, 250, 'Silver'),
  ('EMP002', 80, 120, 'Bronze'),
  ('EMP003', 220, 350, 'Gold'),
  ('EMP004', 45, 90, 'Bronze'),
  ('EMP005', 180, 280, 'Silver');

-- Insert demo rewards
insert into rewards (name, description, points, category, image_url) values
  ('หูฟังบลูทูธ Premium', 'หูฟังไร้สายคุณภาพสูง เสียงใส ตัดเสียงรบกวน', 150, 'electronics', '🎧'),
  ('บัตรกำนัล Starbucks 500 บาท', 'บัตรกำนัลสตาร์บัคส์ มูลค่า 500 บาท', 50, 'giftcard', '☕'),
  ('Smart Watch', 'นาฬิกาอัจฉริยะ ติดตามสุขภาพ ออกกำลังกาย', 300, 'electronics', '⌚'),
  ('คอร์สออนไลน์ Udemy', 'เลือกคอร์สเรียนออนไลน์ได้ 1 คอร์ส', 80, 'experience', '📚'),
  ('กระเป๋าเป้แบรนด์เนม', 'กระเป๋าเป้สุดเท่ ใส่โน้ตบุ๊คได้', 200, 'lifestyle', '🎒'),
  ('บัตรชมภาพยนตร์ 2 ที่นั่ง', 'บัตรชมหนังฟรี 2 ที่นั่ง ทุกโรงในเครือ', 60, 'experience', '🎬'),
  ('Power Bank 20000mAh', 'แบตสำรอง ชาร์จเร็ว รองรับทุกอุปกรณ์', 100, 'electronics', '🔋'),
  ('บัตรกำนัล Central 1000 บาท', 'บัตรกำนัลห้างเซ็นทรัล มูลค่า 1000 บาท', 100, 'giftcard', '🎁');
