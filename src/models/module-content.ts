export interface Question {
  question: string;
  type: 'multiple_choice' | 'true_false' | 'essay';
  options: string[];
  correct_answer: string | boolean | null;
  score: number;
}

export interface QuizContent {
  id?: number;
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
  id?: number;
  module_id: number;
  title: string;
  content: string;
  format: 'markdown' | 'html';
  order: number;
  is_required: boolean;
}

import { PracticeQuestion } from './practice';

export interface PracticeContent {
  id?: number;
  module_id: number;
  title: string;
  description: string;
  time_limit_minutes: number;
  order: number;
  is_required: boolean;
  questions: PracticeQuestion[];
}

export interface BaseContent {
  id: number;
  title: string;
  content_type: 'text' | 'quiz' | 'video' | 'assignment' | 'file' | 'practice';
  order: number;
  is_required: boolean;
  minimum_duration_seconds: number;
  completion_rules: Record<string, unknown>;
  content: TextContent | QuizContent | PracticeContent | VideoContent | AssignmentContent | FileContent;
}

export interface AssignmentContent {
  id?: number;
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
  id?: number;
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
  id?: number;
  module_id: number;
  title: string;
  description?: string;
  file: File | null;
  order: number;
  is_required: boolean;
  file_url?: string; // Add file_url for existing files
}