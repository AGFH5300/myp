import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { PageHeader } from '../../components/PageHeader';
import { supabase } from '../../integrations/supabase/client';
import type { AnswerMode } from '../../types/schema';

const answerModes: AnswerMode[] = ['short_text', 'long_text', 'numeric', 'dropdown', 'multiple_choice', 'drawing', 'file_upload', 'table', 'graph'];

export function AdminQuestionEditPage() {
  const { questionId } = useParams();
  const [topics, setTopics] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [form, setForm] = useState({
    paper_id: '', question_number: '', subpart: '', prompt_text: '', answer_mode: 'short_text' as AnswerMode,
    marks: 0, source_page_start: 0, source_page_end: 0, image_asset_path: '', markscheme_text: '', notes: '', options_json: '[]', is_published: false,
  });

  useEffect(() => {
    supabase.from('topics').select('id,name').then(({ data }) => setTopics(data ?? []));
    if (!questionId) return;
    supabase.from('questions').select('*').eq('id', questionId).single().then(({ data }) => {
      if (!data) return;
      setForm({
        paper_id: data.paper_id,
        question_number: data.question_number,
        subpart: data.subpart ?? '',
        prompt_text: data.prompt_text ?? '',
        answer_mode: data.answer_mode,
        marks: data.marks ?? 0,
        source_page_start: data.source_page_start ?? 0,
        source_page_end: data.source_page_end ?? 0,
        image_asset_path: data.image_asset_path ?? '',
        markscheme_text: data.markscheme_text ?? '',
        notes: data.notes ?? '',
        options_json: JSON.stringify(data.options_json ?? []),
        is_published: data.is_published,
      });
    });
    supabase.from('question_topics').select('topic_id').eq('question_id', questionId).then(({ data }) => setSelectedTopics((data ?? []).map((d) => d.topic_id)));
  }, [questionId]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!questionId) return;
    const payload = {
      ...form,
      subpart: form.subpart || null,
      prompt_text: form.prompt_text || null,
      source_page_start: form.source_page_start || null,
      source_page_end: form.source_page_end || null,
      image_asset_path: form.image_asset_path || null,
      markscheme_text: form.markscheme_text || null,
      notes: form.notes || null,
      options_json: JSON.parse(form.options_json || '[]'),
    };
    await supabase.from('questions').update(payload).eq('id', questionId);
    await supabase.from('question_topics').delete().eq('question_id', questionId);
    if (selectedTopics.length > 0) {
      await supabase.from('question_topics').insert(selectedTopics.map((topic_id) => ({ question_id: questionId, topic_id })));
    }
  };

  return (
    <div>
      <PageHeader title="Edit question" subtitle="Manual curation for prompt, markscheme, and topic mapping." />
      <Card>
        <form onSubmit={onSubmit} className="grid gap-2">
          <input className="rounded border p-2" placeholder="Paper ID" value={form.paper_id} onChange={(e) => setForm((f) => ({ ...f, paper_id: e.target.value }))} required />
          <div className="grid grid-cols-2 gap-2"><input className="rounded border p-2" placeholder="Question number" value={form.question_number} onChange={(e) => setForm((f) => ({ ...f, question_number: e.target.value }))} required /><input className="rounded border p-2" placeholder="Subpart" value={form.subpart} onChange={(e) => setForm((f) => ({ ...f, subpart: e.target.value }))} /></div>
          <textarea className="rounded border p-2" placeholder="Prompt text" value={form.prompt_text} onChange={(e) => setForm((f) => ({ ...f, prompt_text: e.target.value }))} />
          <select className="rounded border p-2" value={form.answer_mode} onChange={(e) => setForm((f) => ({ ...f, answer_mode: e.target.value as AnswerMode }))}>{answerModes.map((m) => <option key={m}>{m}</option>)}</select>
          <input className="rounded border p-2" type="number" placeholder="Marks" value={form.marks} onChange={(e) => setForm((f) => ({ ...f, marks: Number(e.target.value) }))} />
          <div className="grid grid-cols-2 gap-2"><input className="rounded border p-2" type="number" placeholder="Source page start" value={form.source_page_start} onChange={(e) => setForm((f) => ({ ...f, source_page_start: Number(e.target.value) }))} /><input className="rounded border p-2" type="number" placeholder="Source page end" value={form.source_page_end} onChange={(e) => setForm((f) => ({ ...f, source_page_end: Number(e.target.value) }))} /></div>
          <input className="rounded border p-2" placeholder="Image asset path" value={form.image_asset_path} onChange={(e) => setForm((f) => ({ ...f, image_asset_path: e.target.value }))} />
          <textarea className="rounded border p-2" placeholder="Markscheme text" value={form.markscheme_text} onChange={(e) => setForm((f) => ({ ...f, markscheme_text: e.target.value }))} />
          <textarea className="rounded border p-2" placeholder="Notes" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
          <textarea className="rounded border p-2" placeholder='Options JSON (e.g. ["A","B"])' value={form.options_json} onChange={(e) => setForm((f) => ({ ...f, options_json: e.target.value }))} />
          <div className="rounded border p-2">
            <p className="mb-2 text-sm font-medium">Topics</p>
            <div className="grid grid-cols-2 gap-2">{topics.map((t) => <label key={t.id} className="text-sm"><input type="checkbox" checked={selectedTopics.includes(t.id)} onChange={() => setSelectedTopics((prev) => prev.includes(t.id) ? prev.filter((id) => id !== t.id) : [...prev, t.id])} /> {t.name}</label>)}</div>
          </div>
          <label className="flex gap-2"><input type="checkbox" checked={form.is_published} onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))} />Published</label>
          <Button>Save question</Button>
        </form>
      </Card>
    </div>
  );
}
