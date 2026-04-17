import { AdminPaperForm } from '@/components/AdminPaperForm';

export default async function AdminPaperEditPage({ params }: { params: Promise<{ paperId: string }> }) {
  const { paperId } = await params;
  return <AdminPaperForm paperId={paperId} />;
}
