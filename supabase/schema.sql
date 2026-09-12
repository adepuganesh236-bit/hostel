-- =============================================================================
-- StayNest Premium Hostel - Single Hostel Booking Database Schema (Supabase)
-- =============================================================================
-- Run this whole file in the Supabase SQL editor. The React app uses the
-- PUBLIC anon key only and reads/writes these tables through RLS.
-- =============================================================================

-- ---------- profiles (students, owner, admin) --------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  mobile text,
  email text,
  college text,
  course text,
  year integer,
  gender text,
  budget numeric,
  preferred_room text,
  role text not null default 'student' check (role in ('student','owner','admin')),
  verified boolean default false,
  created_at timestamptz default now()
);

-- ---------- hostel (single-hostel settings) ----------------------------------
create table if not exists public.hostel (
  id uuid primary key default gen_random_uuid(),
  name text default 'StayNest Premium Hostel',
  tagline text default 'Your Safe & Comfortable Home Away From Home',
  address text default '',
  phone text default '',
  email text default '',
  map_url text default '',
  created_at timestamptz default now()
);

insert into public.hostel (name, tagline)
values ('StayNest Premium Hostel', 'Your Safe & Comfortable Home Away From Home')
on conflict do nothing;

-- ---------- rooms (40 demo rooms) --------------------------------------------
create table if not exists public.rooms (
  id text primary key,
  room_number text not null unique,
  floor integer,
  sharing integer not null,
  type_label text,
  ac boolean default false,
  rent numeric not null,
  advance numeric default 0,
  created_at timestamptz default now()
);

-- ---------- beds ------------------------------------------------------------------
create table if not exists public.beds (
  id text primary key,
  room_id text references public.rooms (id) on delete cascade,
  bed_number text not null,
  status text not null default 'available' check (status in ('available','occupied','reserved')),
  student_id uuid references auth.users (id) on delete set null,
  created_at timestamptz default now()
);

-- ---------- bookings -----------------------------------------------------------------
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_id text not null unique,
  student_id uuid references auth.users (id) on delete cascade,
  student_name text,
  student_mobile text,
  student_email text,
  college text,
  room_number text,
  sharing integer,
  bed_number text,
  bed_id text,
  date date,
  rent numeric,
  advance numeric,
  food numeric,
  electricity numeric,
  amount numeric,
  transaction_id text,
  payment_method text,
  payment_status text default 'pending' check (payment_status in ('paid','pending')),
  status text default 'pending' check (status in ('pending','confirmed','cancelled')),
  created_at timestamptz default now()
);

-- ---------- payments ---------------------------------------------------------------
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  payment_id text not null unique,
  student_id uuid references auth.users (id) on delete cascade,
  student_name text,
  room_number text,
  bed text,
  amount numeric,
  method text,
  transaction_id text,
  date date,
  status text default 'paid',
  type text default 'Monthly Rent',
  created_at timestamptz default now()
);

-- ---------- weekly food menu -----------------------------------------------------------
create table if not exists public.food_menu (
  id uuid primary key default gen_random_uuid(),
  day text not null,
  meal text not null,
  items jsonb,
  timings text,
  created_at timestamptz default now()
);

-- ---------- reviews -----------------------------------------------------------------
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references auth.users (id) on delete cascade,
  student_name text,
  college text,
  rating integer check (rating between 1 and 5),
  text text,
  date date,
  verified boolean default false,
  created_at timestamptz default now()
);

-- ---------- complaints -----------------------------------------------------------------
create table if not exists public.complaints (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references auth.users (id) on delete cascade,
  student_name text,
  room text,
  type text,
  message text,
  status text default 'open' check (status in ('open','in_progress','resolved')),
  date date,
  created_at timestamptz default now()
);

-- ---------- contact form messages ----------------------------------------------------------
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  mobile text,
  message text,
  created_at timestamptz default now()
);

-- ---------- Row Level Security ----------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.rooms enable row level security;
alter table public.beds enable row level security;
alter table public.bookings enable row level security;
alter table public.payments enable row level security;
alter table public.reviews enable row level security;
alter table public.complaints enable row level security;
alter table public.contacts enable row level security;
alter table public.hostel enable row level security;
alter table public.food_menu enable row level security;

-- Public read for public content
create policy "Hostel is public" on public.hostel for select using (true);
create policy "Rooms are visible" on public.rooms for select using (true);
create policy "Beds are visible" on public.beds for select using (true);
create policy "Food menu public" on public.food_menu for select using (true);
create policy "Reviews public" on public.reviews for select using (true);

-- Authenticated write for relevant tables
create policy "Students manage own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "Students manage own bookings" on public.bookings
  for select using (auth.uid() = student_id);

create policy "Students create payments" on public.payments
  for insert with check (auth.uid() = student_id);
create policy "Students read own payments" on public.payments
  for select using (auth.uid() = student_id);

create policy "Students submit reviews" on public.reviews
  for insert with check (auth.uid() = student_id);

create policy "Students submit complaints" on public.complaints
  for insert with check (auth.uid() = student_id);

create policy "Anyone can contact" on public.contacts for insert with check (true);