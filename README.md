# MYP eAssessment Practice Platform

Next.js App Router frontend for student/admin MYP practice workflows backed by Supabase.

## Stack
- Next.js (App Router) + React + TypeScript
- Tailwind CSS
- Supabase JS + `@supabase/ssr`

## 1) Install
```bash
npm install
```

## 2) Environment setup
```bash
cp .env.example .env.local
```
Set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 3) Run in development
```bash
npm run dev
```
Open http://localhost:3000.

## 4) Production build
```bash
npm run build
npm run start
```

## 5) Supabase schema contract
This app is aligned to the existing migration in:
- `supabase/migrations/202604160001_myp_platform_schema.sql`

Important schema assumptions used by the frontend:
- `profiles.onboarding_completed`
- `student_subjects.student_id`
- `papers.paper_pdf_path` and `papers.markscheme_pdf_path`
- `questions.markscheme_text`
- `attempts.question_id` and `attempts.student_id`
- `attempt_answers.attempt_id`
- `bookmarks.student_id` + `bookmarks.question_id`

## 6) Supabase setup notes
1. Run the migration SQL manually in Supabase SQL editor.
2. Ensure each auth user has a matching row in `public.profiles` (`id = auth.users.id`).
3. Set `profiles.role = 'admin'` for accounts that should access `/admin`.
4. Publish at least one subject/paper/question to test student flows.

## 7) Route map
Public:
- `/`
- `/auth`

Protected student:
- `/onboarding`
- `/dashboard`
- `/papers`
- `/papers/[paperId]`
- `/questions/[questionId]`
- `/bookmarks`
- `/attempts`

Admin:
- `/admin`
- `/admin/subjects`
- `/admin/sessions`
- `/admin/papers`
- `/admin/papers/new`
- `/admin/papers/[paperId]/edit`
- `/admin/questions/[questionId]/edit`
- `/admin/topics`

## 8) Notes
- No Vite runtime is used; this project runs only on Next.js.
- Pages include empty-state fallbacks to avoid blank/white screens when data is missing.
