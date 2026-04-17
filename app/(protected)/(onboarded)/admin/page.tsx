import Link from 'next/link';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';

export default function AdminDashboardPage() {
  return (
    <div>
      <PageHeader title="Admin" subtitle="Content management" />
      <div className="grid gap-4 md:grid-cols-3">
        {[['Subjects', '/admin/subjects'], ['Exam Sessions', '/admin/sessions'], ['Papers', '/admin/papers'], ['Topics', '/admin/topics']].map(([label, href]) => (
          <Link key={href} href={href}><Card><h3 className="font-semibold">{label}</h3></Card></Link>
        ))}
      </div>
    </div>
  );
}
