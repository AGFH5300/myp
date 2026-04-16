-- MYP eAssessment v1 schema
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  myp_year int check (myp_year between 1 and 5),
  role text not null default 'student' check (role in ('student','admin')),
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.student_subjects (
  student_id uuid not null references public.profiles(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (student_id, subject_id)
);

create table if not exists public.exam_sessions (
  id uuid primary key default gen_random_uuid(),
  exam_year int not null,
  exam_month text not null check (exam_month in ('May','November')),
  created_at timestamptz not null default now(),
  unique (exam_year, exam_month)
);

create table if not exists public.papers (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete restrict,
  session_id uuid not null references public.exam_sessions(id) on delete restrict,
  title text not null,
  paper_code text,
  description text,
  paper_pdf_path text,
  markscheme_pdf_path text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.topics (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid references public.subjects(id) on delete set null,
  name text not null,
  description text,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  paper_id uuid not null references public.papers(id) on delete cascade,
  question_number text not null,
  subpart text,
  prompt_text text,
  answer_mode text not null check (answer_mode in ('short_text','long_text','numeric','dropdown','multiple_choice','drawing','file_upload','table','graph')),
  marks int,
  source_page_start int,
  source_page_end int,
  image_asset_path text,
  markscheme_text text,
  notes text,
  options_json jsonb,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.question_topics (
  question_id uuid not null references public.questions(id) on delete cascade,
  topic_id uuid not null references public.topics(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (question_id, topic_id)
);

create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  status text not null default 'in_progress' check (status in ('in_progress','submitted')),
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  revealed_solution_at timestamptz
);

create table if not exists public.attempt_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.attempts(id) on delete cascade,
  answer_text text,
  answer_json jsonb,
  saved_at timestamptz not null default now()
);

create table if not exists public.bookmarks (
  student_id uuid not null references public.profiles(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (student_id, question_id)
);

alter table public.profiles enable row level security;
alter table public.subjects enable row level security;
alter table public.student_subjects enable row level security;
alter table public.exam_sessions enable row level security;
alter table public.papers enable row level security;
alter table public.topics enable row level security;
alter table public.questions enable row level security;
alter table public.question_topics enable row level security;
alter table public.attempts enable row level security;
alter table public.attempt_answers enable row level security;
alter table public.bookmarks enable row level security;

create policy "students read published subjects" on public.subjects for select using (is_published = true or exists(select 1 from public.profiles p where p.id = auth.uid() and p.role='admin'));
create policy "students read published sessions" on public.exam_sessions for select using (true);
create policy "students read published papers" on public.papers for select using (is_published = true or exists(select 1 from public.profiles p where p.id = auth.uid() and p.role='admin'));
create policy "students read published topics" on public.topics for select using (is_published = true or exists(select 1 from public.profiles p where p.id = auth.uid() and p.role='admin'));
create policy "students read published questions" on public.questions for select using (is_published = true or exists(select 1 from public.profiles p where p.id = auth.uid() and p.role='admin'));
create policy "students read question_topics" on public.question_topics for select using (true);

create policy "profile self read" on public.profiles for select using (id = auth.uid() or exists(select 1 from public.profiles p where p.id = auth.uid() and p.role='admin'));
create policy "profile self upsert" on public.profiles for insert with check (id = auth.uid());
create policy "profile self update" on public.profiles for update using (id = auth.uid() or exists(select 1 from public.profiles p where p.id = auth.uid() and p.role='admin'));

create policy "student subjects self" on public.student_subjects for all using (student_id = auth.uid() or exists(select 1 from public.profiles p where p.id = auth.uid() and p.role='admin')) with check (student_id = auth.uid() or exists(select 1 from public.profiles p where p.id = auth.uid() and p.role='admin'));
create policy "attempts self" on public.attempts for all using (student_id = auth.uid() or exists(select 1 from public.profiles p where p.id = auth.uid() and p.role='admin')) with check (student_id = auth.uid() or exists(select 1 from public.profiles p where p.id = auth.uid() and p.role='admin'));
create policy "attempt answers self" on public.attempt_answers for all using (exists(select 1 from public.attempts a where a.id = attempt_id and a.student_id = auth.uid()) or exists(select 1 from public.profiles p where p.id = auth.uid() and p.role='admin')) with check (exists(select 1 from public.attempts a where a.id = attempt_id and a.student_id = auth.uid()) or exists(select 1 from public.profiles p where p.id = auth.uid() and p.role='admin'));
create policy "bookmarks self" on public.bookmarks for all using (student_id = auth.uid() or exists(select 1 from public.profiles p where p.id = auth.uid() and p.role='admin')) with check (student_id = auth.uid() or exists(select 1 from public.profiles p where p.id = auth.uid() and p.role='admin'));

create policy "admin full subjects" on public.subjects for all using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role='admin')) with check (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role='admin'));
create policy "admin full sessions" on public.exam_sessions for all using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role='admin')) with check (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role='admin'));
create policy "admin full papers" on public.papers for all using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role='admin')) with check (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role='admin'));
create policy "admin full topics" on public.topics for all using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role='admin')) with check (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role='admin'));
create policy "admin full questions" on public.questions for all using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role='admin')) with check (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role='admin'));
create policy "admin full question_topics" on public.question_topics for all using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role='admin')) with check (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role='admin'));
