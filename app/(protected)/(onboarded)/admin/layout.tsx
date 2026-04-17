import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth');
  }

  const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).maybeSingle();
  const profile = data as { role?: string } | null;

  if (profile?.role !== 'admin') {
    redirect('/dashboard');
  }

  return children;
}
