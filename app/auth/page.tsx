'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { createClient } from '@/lib/supabase/browser';

export default function AuthPage() {
  const supabase = createClient();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password });
      setMessage(error ? error.message : 'Account created. Check your email for verification.');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
      return;
    }

    router.replace('/dashboard');
  };

  return (
    <div className="mx-auto mt-16 max-w-md">
      <Card>
        <h1 className="mb-4 text-2xl font-semibold">Sign in</h1>
        <div className="mb-4 flex gap-2">
          <Button type="button" className={mode === 'login' ? '' : 'bg-slate-600'} onClick={() => setMode('login')}>
            Login
          </Button>
          <Button type="button" className={mode === 'signup' ? '' : 'bg-slate-600'} onClick={() => setMode('signup')}>
            Sign up
          </Button>
        </div>
        <form className="space-y-3" onSubmit={onSubmit}>
          <input
            className="w-full rounded border p-2"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full rounded border p-2"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {message && <p className="text-sm text-slate-700">{message}</p>}
          <Button type="submit" className="w-full">
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
