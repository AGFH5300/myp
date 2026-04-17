'use client';

import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { createClient } from '@/lib/supabase/browser';

export default function AdminSessionsPage() {
  const supabase = createClient();
  const [rows, setRows] = useState<Array<{ id: string; exam_year: number; exam_month: string }>>([]);
  const [examYear, setExamYear] = useState(2025);
  const [examMonth, setExamMonth] = useState<'May' | 'November'>('May');
  const load = useCallback(
    () => supabase.from('exam_sessions').select('*').order('exam_year', { ascending: false }).then(({ data }) => setRows(data ?? [])),
    [supabase],
  );
  useEffect(() => {
    load();
  }, [load]);
  const onCreate = async (e: FormEvent) => { e.preventDefault(); await supabase.from('exam_sessions').insert({ exam_year: examYear, exam_month: examMonth }); load(); };
  return <div><PageHeader title="Admin: Sessions" /><Card><form onSubmit={onCreate} className="mb-4 flex gap-2"><input className="rounded border p-2" type="number" value={examYear} onChange={(e) => setExamYear(Number(e.target.value))} /><select className="rounded border p-2" value={examMonth} onChange={(e) => setExamMonth(e.target.value as 'May' | 'November')}><option>May</option><option>November</option></select><Button>Create</Button></form>{rows.length === 0 ? <p className="text-sm text-slate-600">No sessions yet.</p> : rows.map((r) => <div key={r.id} className="border-b py-2">{r.exam_month} {r.exam_year}</div>)}</Card></div>;
}
