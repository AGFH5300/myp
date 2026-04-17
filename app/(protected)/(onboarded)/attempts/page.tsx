'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { useAuth } from '@/features/auth/AuthProvider';
import { createClient } from '@/lib/supabase/browser';

export default function AttemptsPage() {
  const supabase = createClient();
  const { session } = useAuth();
  const [rows, setRows] = useState<Array<{ id: string; status: string; started_at: string; submitted_at: string | null; question: { question_number: string } | null }>>([]);

  useEffect(() => {
    if (!session?.user) return;
    supabase.from('attempts').select('id,status,started_at,submitted_at,question:questions(question_number)').eq('student_id', session.user.id).order('started_at', { ascending: false }).then(({ data }) => setRows((data as never) ?? []));
  }, [session, supabase]);

  return (
    <div>
      <PageHeader title="Attempts" subtitle="Your practice history" />
      <Card>
        {rows.length === 0 ? <p className="text-sm text-slate-600">No attempts yet.</p> : rows.map((r) => <div key={r.id} className="border-b py-3 text-sm">Question {r.question?.question_number} · {r.status} · Started {new Date(r.started_at).toLocaleString()}{r.submitted_at ? ` · Submitted ${new Date(r.submitted_at).toLocaleString()}` : ''}</div>)}
      </Card>
    </div>
  );
}
