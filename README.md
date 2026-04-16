# MYP eAssessment Practice Platform (v1)

Student + admin web app scaffold built with Vite, React, TypeScript, React Router, Supabase JS, and Tailwind.

## Stack
- Vite + React + TypeScript
- React Router
- Supabase JS
- Tailwind CSS

## 1) Install and run
```bash
npm install
cp .env.example .env
npm run dev
```

Set in `.env`:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 2) Apply database schema manually in Supabase
This project does **not** auto-run SQL. Run the migration manually in the Supabase SQL editor:

- `supabase/migrations/202604160001_myp_platform_schema.sql`

After running SQL:
1. Ensure your auth users have a corresponding `profiles` row (same `id` as `auth.users.id`).
2. Set `profiles.role = 'admin'` for admin accounts.

## 3) Route map
Public:
- `/`
- `/auth`

Protected student:
- `/onboarding`
- `/dashboard`
- `/papers`
- `/papers/:paperId`
- `/questions/:questionId`
- `/bookmarks`
- `/attempts`

Admin (role = `admin`):
- `/admin`
- `/admin/subjects`
- `/admin/sessions`
- `/admin/papers`
- `/admin/papers/new`
- `/admin/papers/:paperId/edit`
- `/admin/questions/:questionId/edit`
- `/admin/topics`

## 4) Product behavior in v1
- Manual/admin-curated question content (no OCR).
- No AI marking.
- No semantic search.
- Question renderer supports:
  - `short_text`
  - `long_text`
  - `numeric`
  - `dropdown`
  - `multiple_choice`
- Other answer modes render safe placeholder panel.

## 5) Optional dev SQL seed examples
Use after the migration and with an admin user/profile present.

```sql
insert into public.subjects (name, code, is_published)
values ('Physics', 'PHY', true), ('Mathematics', 'MATH', true);

insert into public.exam_sessions (exam_year, exam_month)
values (2025, 'May')
on conflict do nothing;

insert into public.papers (subject_id, session_id, title, paper_code, is_published)
select s.id, es.id, 'Physics Practice Paper 1', 'P1', true
from public.subjects s
join public.exam_sessions es on es.exam_year = 2025 and es.exam_month = 'May'
where s.code = 'PHY'
limit 1;
```

## Notes
- Storage uploads are referenced by DB path fields (`paper_pdf_path`, `markscheme_pdf_path`, `image_asset_path`).
- The app intentionally avoids direct SQL execution and live DB mutation from CLI.
