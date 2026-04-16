import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/Card';
import { PageHeader } from '../../components/PageHeader';
import { useAuth } from '../auth/AuthProvider';
import { supabase } from '../../integrations/supabase/client';

export function BookmarksPage() {
  const { session } = useAuth();
  const [rows, setRows] = useState<Array<{ question_id: string; question: { question_number: string } | null }>>([]);

  useEffect(() => {
    if (!session?.user) return;
    supabase.from('bookmarks').select('question_id,question:questions(question_number)').eq('student_id', session.user.id).then(({ data }) => setRows((data as never) ?? []));
  }, [session]);

  return (
    <div>
      <PageHeader title="Bookmarks" subtitle="Saved questions" />
      <Card>
        {rows.map((r) => <Link className="block border-b py-2" key={r.question_id} to={`/questions/${r.question_id}`}>Question {r.question?.question_number}</Link>)}
      </Card>
    </div>
  );
}
