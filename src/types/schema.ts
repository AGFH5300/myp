export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type AnswerMode =
  | 'short_text'
  | 'long_text'
  | 'numeric'
  | 'dropdown'
  | 'multiple_choice'
  | 'drawing'
  | 'file_upload'
  | 'table'
  | 'graph';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          myp_year: number | null;
          role: 'student' | 'admin';
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          myp_year?: number | null;
          role?: 'student' | 'admin';
          onboarding_completed?: boolean;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      subjects: {
        Row: { id: string; name: string; code: string; is_published: boolean; created_at: string };
        Insert: { id?: string; name: string; code: string; is_published?: boolean };
        Update: Partial<Database['public']['Tables']['subjects']['Insert']>;
      };
      student_subjects: {
        Row: { student_id: string; subject_id: string; created_at: string };
        Insert: { student_id: string; subject_id: string };
        Update: { subject_id?: string };
      };
      exam_sessions: {
        Row: { id: string; exam_year: number; exam_month: 'May' | 'November'; created_at: string };
        Insert: { id?: string; exam_year: number; exam_month: 'May' | 'November' };
        Update: Partial<Database['public']['Tables']['exam_sessions']['Insert']>;
      };
      papers: {
        Row: {
          id: string;
          subject_id: string;
          session_id: string;
          title: string;
          paper_code: string | null;
          description: string | null;
          paper_pdf_path: string | null;
          markscheme_pdf_path: string | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          subject_id: string;
          session_id: string;
          title: string;
          paper_code?: string | null;
          description?: string | null;
          paper_pdf_path?: string | null;
          markscheme_pdf_path?: string | null;
          is_published?: boolean;
        };
        Update: Partial<Database['public']['Tables']['papers']['Insert']>;
      };
      topics: {
        Row: { id: string; subject_id: string | null; name: string; description: string | null; is_published: boolean; created_at: string };
        Insert: { id?: string; subject_id?: string | null; name: string; description?: string | null; is_published?: boolean };
        Update: Partial<Database['public']['Tables']['topics']['Insert']>;
      };
      questions: {
        Row: {
          id: string;
          paper_id: string;
          question_number: string;
          subpart: string | null;
          prompt_text: string | null;
          answer_mode: AnswerMode;
          marks: number | null;
          source_page_start: number | null;
          source_page_end: number | null;
          image_asset_path: string | null;
          markscheme_text: string | null;
          notes: string | null;
          options_json: Json | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          paper_id: string;
          question_number: string;
          subpart?: string | null;
          prompt_text?: string | null;
          answer_mode: AnswerMode;
          marks?: number | null;
          source_page_start?: number | null;
          source_page_end?: number | null;
          image_asset_path?: string | null;
          markscheme_text?: string | null;
          notes?: string | null;
          options_json?: Json | null;
          is_published?: boolean;
        };
        Update: Partial<Database['public']['Tables']['questions']['Insert']>;
      };
      question_topics: {
        Row: { question_id: string; topic_id: string; created_at: string };
        Insert: { question_id: string; topic_id: string };
        Update: { topic_id?: string };
      };
      attempts: {
        Row: { id: string; student_id: string; question_id: string; status: 'in_progress' | 'submitted'; started_at: string; submitted_at: string | null; revealed_solution_at: string | null };
        Insert: { id?: string; student_id: string; question_id: string; status?: 'in_progress' | 'submitted'; submitted_at?: string | null; revealed_solution_at?: string | null };
        Update: Partial<Database['public']['Tables']['attempts']['Insert']>;
      };
      attempt_answers: {
        Row: { id: string; attempt_id: string; answer_text: string | null; answer_json: Json | null; saved_at: string };
        Insert: { id?: string; attempt_id: string; answer_text?: string | null; answer_json?: Json | null };
        Update: Partial<Database['public']['Tables']['attempt_answers']['Insert']>;
      };
      bookmarks: {
        Row: { student_id: string; question_id: string; created_at: string };
        Insert: { student_id: string; question_id: string };
        Update: { question_id?: string };
      };
    };
  };
}

export type Subject = Database['public']['Tables']['subjects']['Row'];
export type Question = Database['public']['Tables']['questions']['Row'];
