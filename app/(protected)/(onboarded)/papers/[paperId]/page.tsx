'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { createClient } from '@/lib/supabase/browser';

interface QuestionRow { id: string; question_number: string; subpart: string | null; marks: number | null; }

export default function PaperDetailPage() {
  const { paperId } = useParams<{ paperId: string }>();
  const supabase = createClient();
  const [paper, setPaper] = useState<Record<string, unknown> | null>(null);
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [topicMap, setTopicMap] = useState<Record<string, string[]>>({});
  const [topicFilter, setTopicFilter] = useState('all');

  useEffect(() => {
    if (!paperId) return;
    supabase.from('papers').select('*').eq('id', paperId).maybeSingle().then(({ data }) => setPaper(data));
    supabase.from('questions').select('id,question_number,subpart,marks').eq('paper_id', paperId).eq('is_published', true).order('question_number').then(async ({ data }) => {
      const q = data ?? [];
      setQuestions(q);
      if (q.length === 0) return;
      const { data: qt } = await supabase.from('question_topics').select('question_id,topic:topics(name)').in('question_id', q.map((x) => x.id));
      const next: Record<string, string[]> = {};
      (qt as Array<{ question_id: string; topic: { name: string } | null }> | null)?.forEach((row) => {
        if (!next[row.question_id]) next[row.question_id] = [];
        if (row.topic?.name) next[row.question_id].push(row.topic.name);
      });
      setTopicMap(next);
    });
  }, [paperId, supabase]);

  const allTopics = Array.from(new Set(Object.values(topicMap).flat()));
  const visibleQuestions = useMemo(
    () => questions.filter((q) => topicFilter === 'all' || (topicMap[q.id] ?? []).includes(topicFilter)),
    [questions, topicMap, topicFilter],
  );

  return (
    <div>
      <PageHeader title={(paper?.title as string) ?? 'Paper'} subtitle="Paper summary and questions" />
      <Card>
        <p className="text-sm text-slate-600">Full paper PDF path: {(paper?.paper_pdf_path as string) ?? 'Not attached yet'}</p>
        <div className="my-3">
          <select className="rounded border p-2" value={topicFilter} onChange={(e) => setTopicFilter(e.target.value)}>
            <option value="all">All topics</option>
            {allTopics.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        {visibleQuestions.length === 0 ? (
          <p className="text-sm text-slate-600">No published questions in this paper yet.</p>
        ) : (
          <div className="space-y-2">
            {visibleQuestions.map((q) => (
              <Link key={q.id} href={`/questions/${q.id}`} className="block rounded border p-3">
                Q{q.question_number}{q.subpart ? `(${q.subpart})` : ''} · {q.marks ?? 0} marks
                <div className="text-xs text-slate-600">{(topicMap[q.id] ?? []).join(', ')}</div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
