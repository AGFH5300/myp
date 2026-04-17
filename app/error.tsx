'use client';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto mt-16 max-w-xl rounded border bg-white p-6">
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="mt-2 text-sm text-slate-600">Please try again.</p>
      <button onClick={reset} className="mt-4 rounded bg-slate-900 px-4 py-2 text-sm text-white">
        Retry
      </button>
    </div>
  );
}
