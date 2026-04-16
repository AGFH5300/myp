import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { PageHeader } from '../../components/PageHeader';
import { supabase } from '../../integrations/supabase/client';
import { useAuth } from '../auth/AuthProvider';
import type { AnswerMode } from '../../types/schema';

interface QuestionData {
  id: string;
  prompt_text: string | null;
  answer_mode: AnswerMode;
  marks: number | null;
  image_asset_path: string | null;
  markscheme_text: string | null;
  options_json: unknown;
}

export function QuestionPage() {
  const { questionId } = useParams();
  const { session } = useAuth();
  const [question, setQuestion] = useState<QuestionData | null>(null);
  const [topics, setTopics] = useState<Array<{ topic: { name: string } | null }>>([]);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (!questionId) return;
    supabase.from('questions').select('*').eq('id', questionId).eq('is_published', true).maybeSingle().then(({ data }) => setQuestion(data as QuestionData | null));
    supabase.from('question_topics').select('topic:topics(name)').eq('question_id', questionId).then(({ data }) => setTopics((data as never) ?? []));
  }, [questionId]);

  useEffect(() => {
    if (!session?.user || !questionId) return;
    supabase.from('bookmarks').select('question_id').eq('student_id', session.user.id).eq('question_id', questionId).maybeSingle().then(({ data }) => setBookmarked(Boolean(data)));
    supabase.from('attempts').insert({ student_id: session.user.id, question_id: questionId }).select('id').single().then(({ data }) => {
      if (data?.id) setAttemptId(data.id);
    });
  }, [session, questionId]);

  const input = useMemo(() => {
    if (!question) return null;
    const options = Array.isArray(question.options_json) ? (question.options_json as string[]) : [];
    switch (question.answer_mode) {
      case 'short_text':
      case 'numeric':
        return <input className="w-full rounded border p-2" value={answerText} onChange={(e) => setAnswerText(e.target.value)} />;
      case 'long_text':
        return <textarea className="h-32 w-full rounded border p-2" value={answerText} onChange={(e) => setAnswerText(e.target.value)} />;
      case 'dropdown':
        return <select className="rounded border p-2" onChange={(e) => setAnswerText(e.target.value)}><option>Select</option>{options.map((o) => <option key={o}>{o}</option>)}</select>;
      case 'multiple_choice':
        return <div className="space-y-2">{options.map((o) => <label key={o} className="flex gap-2"><input type="radio" name="mc" onChange={() => setAnswerText(o)} />{o}</label>)}</div>;
      default:
        return <div className="rounded border border-dashed p-3 text-sm text-slate-600">This interaction type will be upgraded later.</div>;
    }
  }, [question, answerText]);


  const toggleBookmark = async () => {
    if (!session?.user || !questionId) return;
    if (bookmarked) {
      await supabase.from('bookmarks').delete().eq('student_id', session.user.id).eq('question_id', questionId);
      setBookmarked(false);
      return;
    }
    await supabase.from('bookmarks').insert({ student_id: session.user.id, question_id: questionId });
    setBookmarked(true);
  };
  const saveAnswer = async (e: FormEvent) => {
    e.preventDefault();
    if (!attemptId) return;
    await supabase.from('attempt_answers').insert({ attempt_id: attemptId, answer_text: answerText || null, answer_json: {} });
  };

  const revealSolution = async () => {
    if (!attemptId) return;
    setShowSolution(true);
    await supabase.from('attempts').update({ revealed_solution_at: new Date().toISOString() }).eq('id', attemptId);
  };

  const submitAttempt = async () => {
    if (!attemptId) return;
    await supabase.from('attempts').update({ status: 'submitted', submitted_at: new Date().toISOString() }).eq('id', attemptId);
  };

  if (!question) return <div>Loading question...</div>;

  return (
    <div>
      <PageHeader title="Practice question" subtitle={`${question.marks ?? 0} marks`} />
      <Card>
        {question.image_asset_path && <img src={question.image_asset_path} alt="Question" className="mb-3 max-h-96 rounded border object-contain" />}
        {question.prompt_text && <p className="mb-3 whitespace-pre-wrap">{question.prompt_text}</p>}
        <div className="mb-3 flex flex-wrap gap-2">{topics.map((t, i) => <span key={i} className="rounded-full bg-slate-100 px-2 py-1 text-xs">{t.topic?.name}</span>)}</div>
        <form onSubmit={saveAnswer} className="space-y-3">
          {input}
          <div className="flex flex-wrap gap-2">
            <Button type="submit">Save draft</Button>
            <Button type="button" className="bg-slate-700" onClick={submitAttempt}>Submit</Button>
            <Button type="button" className="bg-emerald-700" onClick={revealSolution}>Reveal solution</Button>
            <Button type="button" className="bg-amber-700" onClick={toggleBookmark}>{bookmarked ? 'Remove bookmark' : 'Bookmark question'}</Button>
          </div>
        </form>
        {showSolution && question.markscheme_text && (
          <div className="mt-4 rounded border border-emerald-200 bg-emerald-50 p-3">
            <h3 className="font-medium">Markscheme</h3>
            <p className="whitespace-pre-wrap text-sm">{question.markscheme_text}</p>
          </div>
        )}
      </Card>
    </div>
  );
}
