import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthProvider';

const studentLinks = [
  ['Dashboard', '/dashboard'],
  ['Papers', '/papers'],
  ['Bookmarks', '/bookmarks'],
  ['Attempts', '/attempts'],
];

const adminLinks = [
  ['Admin', '/admin'],
  ['Subjects', '/admin/subjects'],
  ['Sessions', '/admin/sessions'],
  ['Papers', '/admin/papers'],
  ['Topics', '/admin/topics'],
];

export function AppShell() {
  const { profile, signOut } = useAuth();
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link className="font-semibold" to="/dashboard">MYP Practice</Link>
          <nav className="flex gap-3 text-sm">
            {studentLinks.map(([label, href]) => (
              <NavLink key={href} to={href} className="text-slate-600 hover:text-slate-900">{label}</NavLink>
            ))}
            {profile?.role === 'admin' && adminLinks.map(([label, href]) => (
              <NavLink key={href} to={href} className="text-slate-600 hover:text-slate-900">{label}</NavLink>
            ))}
            <button type="button" onClick={() => signOut()} className="text-slate-600 hover:text-slate-900">Logout</button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
