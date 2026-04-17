'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { useAuth } from '@/features/auth/AuthProvider';
import { createClient } from '@/lib/supabase/browser';

export default function BookmarksPage() {
  const supabase = createClient();
  const { session } = useAuth();
  const [rows, setRows] = useState<Array<{ question_id: string; question: { question_number: string } | null }>>([]);

  useEffect(() => {
    if (!session?.user) return;
    supabase.from('bookmarks').select('question_id,question:questions(question_number)').eq('student_id', session.user.id).then(({ data }) => setRows((data as never) ?? []));
  }, [session, supabase]);

  return (
    <div>
      <PageHeader title="Bookmarks" subtitle="Saved questions" />
      <Card>
        {rows.length === 0 ? <p className="text-sm text-slate-600">No bookmarked questions yet.</p> : rows.map((r) => <Link className="block border-b py-2" key={r.question_id} href={`/questions/${r.question_id}`}>Question {r.question?.question_number}</Link>)}
      </Card>
    </div>
  );
}
