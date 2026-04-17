import { AdminQuestionEditor } from '@/components/AdminQuestionEditor';

export default async function AdminQuestionEditPage({ params }: { params: Promise<{ questionId: string }> }) {
  const { questionId } = await params;
  return <AdminQuestionEditor questionId={questionId} />;
}
