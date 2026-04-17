'use client';

import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import type { Subject } from '@/types/schema';
import { createClient } from '@/lib/supabase/browser';
import { useAuth } from '@/features/auth/AuthProvider';

export default function OnboardingPage() {
  const supabase = createClient();
  const router = useRouter();
  const { session, refreshProfile } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [year, setYear] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('subjects')
      .select('*')
      .eq('is_published', true)
      .then(({ data }) => setSubjects(data ?? []));
  }, [supabase]);

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!session?.user) return;
    setError(null);
    const userId = session.user.id;

    const { error: profileErr } = await supabase
      .from('profiles')
      .upsert({ id: userId, myp_year: year, onboarding_completed: true }, { onConflict: 'id' });

    if (profileErr) {
      setError(profileErr.message);
      return;
    }

    await supabase.from('student_subjects').delete().eq('student_id', userId);
    if (selected.length > 0) {
      const { error: subjectErr } = await supabase
        .from('student_subjects')
        .insert(selected.map((subject_id) => ({ student_id: userId, subject_id })));
      if (subjectErr) {
        setError(subjectErr.message);
        return;
      }
    }

    await refreshProfile();
    router.replace('/dashboard');
  };

  return (
    <div className="mx-auto max-w-3xl py-6">
      <PageHeader title="Set up your learning profile" subtitle="Choose your MYP year and subjects." />
      <Card>
        <form className="space-y-4" onSubmit={onSave}>
          <div>
            <label className="mb-1 block text-sm font-medium">MYP Year</label>
            <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="rounded border p-2">
              {[1, 2, 3, 4, 5].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Subjects</p>
            {subjects.length === 0 ? (
              <p className="text-sm text-slate-600">No published subjects available yet.</p>
            ) : (
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {subjects.map((s) => (
                  <label key={s.id} className="flex items-center gap-2 rounded border p-2">
                    <input
                      type="checkbox"
                      checked={selected.includes(s.id)}
                      onChange={() =>
                        setSelected((prev) => (prev.includes(s.id) ? prev.filter((id) => id !== s.id) : [...prev, s.id]))
                      }
                    />
                    {s.name}
                  </label>
                ))}
              </div>
            )}
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit">Save and continue</Button>
        </form>
      </Card>
    </div>
  );
}
