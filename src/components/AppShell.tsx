'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { PropsWithChildren } from 'react';
import { useAuth } from '@/features/auth/AuthProvider';

const studentLinks = [
  ['Dashboard', '/dashboard'],
  ['Papers', '/papers'],
  ['Bookmarks', '/bookmarks'],
  ['Attempts', '/attempts'],
] as const;

const adminLinks = [
  ['Admin', '/admin'],
  ['Subjects', '/admin/subjects'],
  ['Sessions', '/admin/sessions'],
  ['Papers', '/admin/papers'],
  ['Topics', '/admin/topics'],
] as const;

export function AppShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, signOut } = useAuth();

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link className="font-semibold" href="/dashboard">
            MYP Practice
          </Link>
          <nav className="flex flex-wrap gap-3 text-sm">
            {studentLinks.map(([label, href]) => (
              <Link key={href} href={href} className={isActive(href) ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'}>
                {label}
              </Link>
            ))}
            {profile?.role === 'admin' &&
              adminLinks.map(([label, href]) => (
                <Link key={href} href={href} className={isActive(href) ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'}>
                  {label}
                </Link>
              ))}
            <button
              type="button"
              onClick={async () => {
                await signOut();
                router.replace('/auth');
              }}
              className="text-slate-600 hover:text-slate-900"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
