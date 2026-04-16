import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { PageHeader } from '../../components/PageHeader';
import { supabase } from '../../integrations/supabase/client';

export function AdminSubjectsPage() {
  const [rows, setRows] = useState<Array<{ id: string; name: string; code: string; is_published: boolean }>>([]);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const load = () => supabase.from('subjects').select('*').order('name').then(({ data }) => setRows(data ?? []));

  useEffect(() => { load(); }, []);

  const onCreate = async (e: FormEvent) => {
    e.preventDefault();
    await supabase.from('subjects').insert({ name, code });
    setName(''); setCode('');
    load();
  };

  return <div><PageHeader title="Admin: Subjects" /><Card><form onSubmit={onCreate} className="mb-4 flex gap-2"><input className="rounded border p-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required /><input className="rounded border p-2" placeholder="Code" value={code} onChange={(e) => setCode(e.target.value)} required /><Button>Create</Button></form>{rows.map((r) => <div key={r.id} className="border-b py-2">{r.name} ({r.code})</div>)}</Card></div>;
}
