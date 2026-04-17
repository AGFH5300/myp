import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto mt-16 max-w-xl rounded border bg-white p-6">
      <h2 className="text-xl font-semibold">Page not found</h2>
      <p className="mt-2 text-sm text-slate-600">The page you requested does not exist.</p>
      <Link href="/" className="mt-4 inline-block text-sm text-blue-600">
        Go home
      </Link>
    </div>
  );
}
