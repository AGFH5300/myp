import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { PageHeader } from '../../components/PageHeader';
import { supabase } from '../../integrations/supabase/client';

export function AdminPaperFormPage() {
  const { paperId } = useParams();
  const isEdit = Boolean(paperId);
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Array<{ id: string; name: string }>>([]);
  const [sessions, setSessions] = useState<Array<{ id: string; exam_year: number; exam_month: string }>>([]);
  const [form, setForm] = useState({ subject_id: '', session_id: '', title: '', paper_code: '', description: '', paper_pdf_path: '', markscheme_pdf_path: '', is_published: false });
  const [questions, setQuestions] = useState<Array<{ id: string; question_number: string; subpart: string | null }>>([]);

  useEffect(() => {
    supabase.from('subjects').select('id,name').then(({ data }) => setSubjects(data ?? []));
    supabase.from('exam_sessions').select('id,exam_year,exam_month').then(({ data }) => setSessions(data ?? []));
    if (paperId) {
      supabase.from('questions').select('id,question_number,subpart').eq('paper_id', paperId).order('question_number').then(({ data }) => setQuestions(data ?? []));
      supabase.from('papers').select('*').eq('id', paperId).single().then(({ data }) => {
        if (data) setForm({ subject_id: data.subject_id, session_id: data.session_id, title: data.title, paper_code: data.paper_code ?? '', description: data.description ?? '', paper_pdf_path: data.paper_pdf_path ?? '', markscheme_pdf_path: data.markscheme_pdf_path ?? '', is_published: data.is_published });
      });
    }
  }, [paperId]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = { ...form, paper_code: form.paper_code || null, description: form.description || null, paper_pdf_path: form.paper_pdf_path || null, markscheme_pdf_path: form.markscheme_pdf_path || null };
    if (isEdit) await supabase.from('papers').update(payload).eq('id', paperId!);
    else await supabase.from('papers').insert(payload);
    navigate('/admin/papers');
  };


  const createQuestion = async () => {
    if (!paperId) return;
    const { data } = await supabase
      .from('questions')
      .insert({ paper_id: paperId, question_number: String(questions.length + 1), answer_mode: 'short_text' })
      .select('id')
      .single();
    if (data?.id) navigate(`/admin/questions/${data.id}/edit`);
  };
  return (
    <div>
      <PageHeader title={isEdit ? 'Edit paper' : 'Create paper'} subtitle="Attach storage paths for PDFs and publish when ready." />
      <Card>
        {isEdit && (
          <div className="mb-4 rounded border p-3">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-medium">Questions</h3>
              <Button type="button" onClick={createQuestion}>+ Add question</Button>
            </div>
            <div className="space-y-1 text-sm">
              {questions.map((q) => (
                <a key={q.id} href={`/admin/questions/${q.id}/edit`} className="block text-blue-600">Q{q.question_number}{q.subpart ? `(${q.subpart})` : ''}</a>
              ))}
            </div>
          </div>
        )}
        <form className="grid gap-3" onSubmit={onSubmit}>
          <select className="rounded border p-2" value={form.subject_id} onChange={(e) => setForm((f) => ({ ...f, subject_id: e.target.value }))} required><option value="">Subject</option>{subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
          <select className="rounded border p-2" value={form.session_id} onChange={(e) => setForm((f) => ({ ...f, session_id: e.target.value }))} required><option value="">Session</option>{sessions.map((s) => <option key={s.id} value={s.id}>{s.exam_month} {s.exam_year}</option>)}</select>
          <input className="rounded border p-2" placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
          <input className="rounded border p-2" placeholder="Paper code" value={form.paper_code} onChange={(e) => setForm((f) => ({ ...f, paper_code: e.target.value }))} />
          <textarea className="rounded border p-2" placeholder="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          <input className="rounded border p-2" placeholder="Paper PDF storage path" value={form.paper_pdf_path} onChange={(e) => setForm((f) => ({ ...f, paper_pdf_path: e.target.value }))} />
          <input className="rounded border p-2" placeholder="Markscheme PDF storage path" value={form.markscheme_pdf_path} onChange={(e) => setForm((f) => ({ ...f, markscheme_pdf_path: e.target.value }))} />
          <label className="flex gap-2"><input type="checkbox" checked={form.is_published} onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))} />Published</label>
          <Button>{isEdit ? 'Save changes' : 'Create paper'}</Button>
        </form>
      </Card>
    </div>
  );
}
