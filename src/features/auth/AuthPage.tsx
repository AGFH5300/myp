import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { supabase } from '../../integrations/supabase/client';

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password });
      setMessage(error ? error.message : 'Account created. Check email verification inbox.');
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
      return;
    }
    navigate('/dashboard');
  };

  return (
    <div className="mx-auto mt-20 max-w-md">
      <Card>
        <h1 className="mb-4 text-xl font-semibold">{mode === 'login' ? 'Log in' : 'Sign up'}</h1>
        <form className="space-y-3" onSubmit={onSubmit}>
          <input className="w-full rounded border p-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
          <input className="w-full rounded border p-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required minLength={6} />
          <Button type="submit">{mode === 'login' ? 'Log in' : 'Create account'}</Button>
        </form>
        <p className="mt-4 text-sm text-slate-600">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button type="button" className="text-blue-600" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
        {message && <p className="mt-2 text-sm">{message}</p>}
      </Card>
    </div>
  );
}
