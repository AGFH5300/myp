import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/Card';
import { PageHeader } from '../../components/PageHeader';
import { supabase } from '../../integrations/supabase/client';

interface PaperRow {
  id: string;
  title: string;
  subject_id: string;
  session_id: string;
  subject?: { name: string } | null;
  session?: { exam_year: number; exam_month: string } | null;
}

export function PapersPage() {
  const [papers, setPapers] = useState<PaperRow[]>([]);
  const [subject, setSubject] = useState('all');
  const [year, setYear] = useState('all');
  const [month, setMonth] = useState('all');

  useEffect(() => {
    supabase.from('papers').select('id,title,subject_id,session_id,subject:subjects(name),session:exam_sessions(exam_year,exam_month)').eq('is_published', true).then(({ data }) => setPapers((data as never) ?? []));
  }, []);

  const filtered = useMemo(() => papers.filter((p) =>
    (subject === 'all' || p.subject_id === subject) &&
    (year === 'all' || String(p.session?.exam_year) === year) &&
    (month === 'all' || p.session?.exam_month === month),
  ), [papers, subject, year, month]);

  const subjects = Array.from(new Set(papers.map((p) => JSON.stringify({ id: p.subject_id, name: p.subject?.name })))).map((v) => JSON.parse(v));
  const years = Array.from(new Set(papers.map((p) => String(p.session?.exam_year)).filter(Boolean)));

  return (
    <div>
      <PageHeader title="Papers" subtitle="Filter by subject and exam session." />
      <Card>
        <div className="mb-4 grid gap-2 md:grid-cols-3">
          <select className="rounded border p-2" value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="all">All subjects</option>
            {subjects.map((s: { id: string; name: string }) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select className="rounded border p-2" value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="all">All years</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <select className="rounded border p-2" value={month} onChange={(e) => setMonth(e.target.value)}>
            <option value="all">May/November</option>
            <option value="May">May</option>
            <option value="November">November</option>
          </select>
        </div>
        <div className="space-y-2">
          {filtered.map((paper) => (
            <Link key={paper.id} to={`/papers/${paper.id}`} className="block rounded border p-3 hover:bg-slate-50">
              <div className="font-medium">{paper.title}</div>
              <div className="text-xs text-slate-600">{paper.subject?.name} · {paper.session?.exam_month} {paper.session?.exam_year}</div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
