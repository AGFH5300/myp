'use client';

import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { createClient } from '@/lib/supabase/browser';

export default function AdminTopicsPage() {
  const supabase = createClient();
  const [rows, setRows] = useState<Array<{ id: string; name: string }>>([]);
  const [name, setName] = useState('');
  const load = useCallback(
    () => supabase.from('topics').select('id,name').order('name').then(({ data }) => setRows(data ?? [])),
    [supabase],
  );
  useEffect(() => {
    load();
  }, [load]);
  const onCreate = async (e: FormEvent) => { e.preventDefault(); await supabase.from('topics').insert({ name, is_published: true }); setName(''); load(); };
  return <div><PageHeader title="Admin: Topics" /><Card><form onSubmit={onCreate} className="mb-4 flex gap-2"><input className="rounded border p-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Topic name" required /><Button>Create</Button></form>{rows.length === 0 ? <p className="text-sm text-slate-600">No topics yet.</p> : rows.map((r) => <div key={r.id} className="border-b py-2">{r.name}</div>)}</Card></div>;
}
