-- این SQL را در Supabase > SQL Editor اجرا کنید.
create extension if not exists pgcrypto;

create table if not exists public.daily_tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  details text,
  jalali_date text,
  task_date date default current_date,
  time time,
  reminder boolean not null default false,
  done boolean not null default false,
  created_at timestamptz not null default now(),
  registered_at timestamptz not null default now()
);

alter table public.daily_tasks enable row level security;

-- حالت شخصی ساده: فقط کاربرانی که به پروژه دسترسی دارند.
-- برای استفاده عمومی بدون ورود، این policyها اجازه CRUD را می‌دهند.
create policy "public read daily_tasks" on public.daily_tasks for select using (true);
create policy "public insert daily_tasks" on public.daily_tasks for insert with check (true);
create policy "public update daily_tasks" on public.daily_tasks for update using (true) with check (true);
create policy "public delete daily_tasks" on public.daily_tasks for delete using (true);

create index if not exists daily_tasks_task_date_idx on public.daily_tasks(task_date);
create index if not exists daily_tasks_done_idx on public.daily_tasks(done);

-- اگر جدول قبلاً ساخته شده است، این خط را جداگانه اجرا کنید:
alter table public.daily_tasks add column if not exists registered_at timestamptz not null default now();
