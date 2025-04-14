export interface Question {
  question: string;
  type: 'multiple_choice' | 'true_false' | 'essay';
  options: string[];
  correct_answer: string | boolean | null;
  score: number;
}

export interface QuizContent {
  module_id: number;
  title: string;
  description: string;
  time_limit_minutes: number;
  passing_score: number;
  max_attempts: number;
  questions: Question[];
  order: number;
  is_required: boolean;
}

export interface TextContent {
  module_id: number;
  title: string;
  content: string;
  format: 'markdown' | 'html';
  order: number;
  is_required: boolean;
}

export interface BaseContent {
  id: number;
  title: string;
  content_type: 'text' | 'quiz' | 'video' | 'assignment';
  order: number;
  is_required: boolean;
  minimum_duration_seconds: number;
  completion_rules: Record<string, unknown>;
  content: TextContent | QuizContent;
}

export interface AssignmentContent {
  module_id: number;
  title: string;
  description: string;
  instructions: string;
  submission_requirements: string[];
  due_date: string;
  max_file_size_mb: number;
  allowed_file_types: string;
  order: number;
  is_required: boolean;
}

export interface VideoContent {
  module_id: number;
  title: string;
  description?: string;
  video_url: string;
  provider: 'youtube' | 'vimeo';
  video_id: string;
  duration_seconds: number;
  thumbnail_url?: string;
  is_downloadable: boolean;
  captions?: string[];
  order: number;
  is_required: boolean;
}

export interface FileContent {
  module_id: number;
  title: string;
  description?: string;
  file: File;
  order: number;
  is_required: boolean;
}
