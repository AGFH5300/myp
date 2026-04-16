import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { PageHeader } from '../../components/PageHeader';
import { useAuth } from '../auth/AuthProvider';
import { supabase } from '../../integrations/supabase/client';
import type { Subject } from '../../types/schema';

export function OnboardingPage() {
  const { session, refreshProfile } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [year, setYear] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.from('subjects').select('*').eq('is_published', true).then(({ data }) => setSubjects(data ?? []));
  }, []);

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!session?.user) return;
    setError(null);
    const userId = session.user.id;

    const { error: profileErr } = await supabase
      .from('profiles')
      .upsert({ id: userId, myp_year: year, onboarding_completed: true }, { onConflict: 'id' });

    if (profileErr) return setError(profileErr.message);

    await supabase.from('student_subjects').delete().eq('student_id', userId);
    if (selected.length > 0) {
      const { error: subErr } = await supabase.from('student_subjects').insert(selected.map((subject_id) => ({ student_id: userId, subject_id })));
      if (subErr) return setError(subErr.message);
    }

    await refreshProfile();
    navigate('/dashboard');
  };

  return (
    <div>
      <PageHeader title="Set up your learning profile" subtitle="Choose your MYP year and subjects." />
      <Card>
        <form onSubmit={onSave} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">MYP Year</label>
            <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="rounded border p-2">
              {[1, 2, 3, 4, 5].map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Subjects</p>
            <div className="grid grid-cols-2 gap-2">
              {subjects.map((s) => (
                <label key={s.id} className="flex items-center gap-2 rounded border p-2">
                  <input
                    type="checkbox"
                    checked={selected.includes(s.id)}
                    onChange={() => setSelected((prev) => prev.includes(s.id) ? prev.filter((id) => id !== s.id) : [...prev, s.id])}
                  />
                  {s.name}
                </label>
              ))}
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit">Save & continue</Button>
        </form>
      </Card>
    </div>
  );
}
