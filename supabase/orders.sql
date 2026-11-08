-- PLAY orders and quote requests. Run once in Supabase > SQL Editor.
-- Catalog data stays in JSON files; only orders and requests need a database.

create table if not exists admins (user_id uuid primary key references auth.users(id) on delete cascade);

create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as
$$ select exists (select 1 from public.admins where user_id = auth.uid()) $$;

create table if not exists orders (
  id uuid primary key,
  customer_name text not null,
  phone text not null,
  email text,
  address text not null,
  city text,
  country text,
  payment_method text,
  notes text,
  currency text,
  total_egp numeric(12,2) not null,
  items jsonb not null,
  status text not null default 'new' check (status in ('new','confirmed','paid','shipped','delivered','cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists package_requests (
  id uuid primary key,
  package_id text,
  package_name text,
  company text,
  contact_name text not null,
  email text,
  phone text not null,
  quantity int,
  notes text,
  status text not null default 'new' check (status in ('new','confirmed','paid','shipped','delivered','cancelled')),
  created_at timestamptz not null default now()
);

alter table admins enable row level security;
alter table orders enable row level security;
alter table package_requests enable row level security;

-- Visitors can only INSERT (never read) and only with sane values
create policy "public create orders" on orders for insert to anon
  with check (
    status = 'new'
    and char_length(customer_name) between 1 and 120
    and char_length(phone) between 5 and 40
    and char_length(address) between 1 and 300
    and total_egp >= 0
    and jsonb_typeof(items) = 'array'
    and jsonb_array_length(items) between 1 and 100
  );

create policy "public create requests" on package_requests for insert to anon
  with check (
    status = 'new'
    and char_length(contact_name) between 1 and 120
    and char_length(phone) between 5 and 40
    and (quantity is null or quantity between 1 and 1000000)
  );

-- Admin only
create policy "admin orders" on orders for all to authenticated using (is_admin()) with check (is_admin());
create policy "admin requests" on package_requests for all to authenticated using (is_admin()) with check (is_admin());
create policy "admin self" on admins for select to authenticated using (user_id = auth.uid());

-- Make your login an admin (replace the email, run after creating the user in Authentication > Users):
-- insert into admins (user_id) select id from auth.users where email = 'you@example.com';
