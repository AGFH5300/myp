'use client';

import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { createClient } from '@/lib/supabase/browser';

export default function AdminSubjectsPage() {
  const supabase = createClient();
  const [rows, setRows] = useState<Array<{ id: string; name: string; code: string }>>([]);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  const load = useCallback(
    () => supabase.from('subjects').select('*').order('name').then(({ data }) => setRows(data ?? [])),
    [supabase],
  );

  useEffect(() => {
    load();
  }, [load]);

  const onCreate = async (e: FormEvent) => {
    e.preventDefault();
    await supabase.from('subjects').insert({ name, code });
    setName('');
    setCode('');
    load();
  };

  return <div><PageHeader title="Admin: Subjects" /><Card><form onSubmit={onCreate} className="mb-4 flex gap-2"><input className="rounded border p-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required /><input className="rounded border p-2" placeholder="Code" value={code} onChange={(e) => setCode(e.target.value)} required /><Button>Create</Button></form>{rows.length === 0 ? <p className="text-sm text-slate-600">No subjects yet.</p> : rows.map((r) => <div key={r.id} className="border-b py-2">{r.name} ({r.code})</div>)}</Card></div>;
}
