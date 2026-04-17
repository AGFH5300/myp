import { redirect } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { createClient } from '@/lib/supabase/server';

export default async function OnboardedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth');
  }

  const { data: profile } = await supabase.from('profiles').select('onboarding_completed').eq('id', session.user.id).maybeSingle();

  if (!profile?.onboarding_completed) {
    redirect('/onboarding');
  }

  return <AppShell>{children}</AppShell>;
}
