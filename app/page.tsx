import Link from 'next/link';
import { Button } from '@/components/Button';

export default function LandingPage() {
  return (
    <div className="mx-auto mt-20 max-w-3xl text-center">
      <h1 className="text-4xl font-bold">MYP eAssessment Practice Platform</h1>
      <p className="mt-4 text-slate-600">Practice curated MYP questions by subject, session, paper, and topic with progress tracking.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/auth">
          <Button>Get started</Button>
        </Link>
      </div>
    </div>
  );
}
