'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { createClient } from '@/lib/supabase/browser';

export default function AdminPapersPage() {
  const supabase = createClient();
  const [rows, setRows] = useState<Array<{ id: string; title: string; is_published: boolean }>>([]);
  useEffect(() => {
    supabase.from('papers').select('id,title,is_published').order('created_at', { ascending: false }).then(({ data }) => setRows(data ?? []));
  }, [supabase]);
  return (
    <div>
      <PageHeader title="Admin: Papers" subtitle="Create and edit papers" />
      <Card>
        <Link className="mb-4 inline-block text-blue-600" href="/admin/papers/new">+ New paper</Link>
        {rows.length === 0 ? <p className="text-sm text-slate-600">No papers yet.</p> : rows.map((r) => <Link className="block border-b py-2" href={`/admin/papers/${r.id}/edit`} key={r.id}>{r.title} {r.is_published ? '· Published' : '· Draft'}</Link>)}
      </Card>
    </div>
  );
}
