import { Link } from 'react-router-dom';
import { Card } from '../../components/Card';
import { PageHeader } from '../../components/PageHeader';

export function AdminDashboardPage() {
  return (
    <div>
      <PageHeader title="Admin" subtitle="Content management" />
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ['Subjects', '/admin/subjects'],
          ['Exam Sessions', '/admin/sessions'],
          ['Papers', '/admin/papers'],
          ['Topics', '/admin/topics'],
        ].map(([label, href]) => (
          <Link key={href} to={href}><Card><h3 className="font-semibold">{label}</h3></Card></Link>
        ))}
      </div>
    </div>
  );
}
