import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/Card';
import { PageHeader } from '../../components/PageHeader';
import { supabase } from '../../integrations/supabase/client';

export function AdminPapersPage() {
  const [rows, setRows] = useState<Array<{ id: string; title: string; is_published: boolean }>>([]);
  useEffect(() => {
    supabase.from('papers').select('id,title,is_published').order('created_at', { ascending: false }).then(({ data }) => setRows(data ?? []));
  }, []);
  return (
    <div>
      <PageHeader title="Admin: Papers" subtitle="Create and edit papers" />
      <Card>
        <Link className="mb-4 inline-block text-blue-600" to="/admin/papers/new">+ New paper</Link>
        {rows.map((r) => <Link className="block border-b py-2" to={`/admin/papers/${r.id}/edit`} key={r.id}>{r.title} {r.is_published ? '· Published' : '· Draft'}</Link>)}
      </Card>
    </div>
  );
}
