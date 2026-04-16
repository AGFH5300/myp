import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/Card';
import { PageHeader } from '../../components/PageHeader';
import { useAuth } from '../auth/AuthProvider';
import { supabase } from '../../integrations/supabase/client';

export function DashboardPage() {
  const { session } = useAuth();
  const [subjects, setSubjects] = useState<Array<{ subject: { name: string } | null }>>([]);
  const [attempts, setAttempts] = useState<Array<{ id: string; question_id: string; status: string; started_at: string }>>([]);
  const [bookmarks, setBookmarks] = useState<Array<{ question_id: string }>>([]);

  useEffect(() => {
    if (!session?.user) return;
    const id = session.user.id;
    supabase.from('student_subjects').select('subject:subjects(name)').eq('student_id', id).then(({ data }) => setSubjects((data as never) ?? []));
    supabase.from('attempts').select('id,question_id,status,started_at').eq('student_id', id).order('started_at', { ascending: false }).limit(5).then(({ data }) => setAttempts(data ?? []));
    supabase.from('bookmarks').select('question_id').eq('student_id', id).limit(5).then(({ data }) => setBookmarks(data ?? []));
  }, [session]);

  return (
    <div className="space-y-4">
      <PageHeader title="Dashboard" subtitle="Track progress and jump into practice." />
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <h2 className="font-semibold">Selected subjects</h2>
          <ul className="mt-2 text-sm text-slate-600">{subjects.map((s, i) => <li key={i}>{s.subject?.name}</li>)}</ul>
        </Card>
        <Card>
          <h2 className="font-semibold">Recent attempts</h2>
          <ul className="mt-2 text-sm text-slate-600">{attempts.map((a) => <li key={a.id}>Q {a.question_id.slice(0, 6)} · {a.status}</li>)}</ul>
        </Card>
        <Card>
          <h2 className="font-semibold">Bookmarked</h2>
          <ul className="mt-2 text-sm text-slate-600">{bookmarks.map((b) => <li key={b.question_id}>Q {b.question_id.slice(0, 6)}</li>)}</ul>
        </Card>
      </div>
      <Card>
        <h3 className="mb-2 font-semibold">Quick links</h3>
        <div className="flex gap-3 text-sm">
          <Link className="text-blue-600" to="/papers">Browse papers</Link>
          <Link className="text-blue-600" to="/bookmarks">Bookmarks</Link>
          <Link className="text-blue-600" to="/attempts">Attempts</Link>
        </div>
      </Card>
    </div>
  );
}
