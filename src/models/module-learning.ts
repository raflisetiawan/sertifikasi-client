export interface BaseContent {
  id: number;
  title: string;
  type: 'text' | 'video' | 'quiz' | 'assignment' | 'file';
  order: number;
  is_required: boolean;
  minimum_duration_seconds: number | null;
  content:
    | TextContent
    | VideoContent
    | QuizContent
    | AssignmentContent
    | FileContent;
  progress: ContentProgress | null;
}

export interface ContentProgress {
  status: 'not_started' | 'in_progress' | 'completed';
  score: number | null;
  completed_at: string | null;
  last_accessed_at: string | null;
}

export interface VideoContent {
  video_url: string;
  duration_seconds: number;
  thumbnail_url: string | null;
  is_downloadable: boolean;
}

export interface TextContent {
  content: string;
  format: 'markdown' | 'html';
}

export interface QuizContent {
  time_limit_minutes: number;
  passing_score: number;
  max_attempts: number;
}

export interface AssignmentContent {
  instructions: string;
  due_date: string;
  max_file_size_mb: number;
  submission_requirements: string[];
}

export interface FileContent {
  file_url: string;
  file_size: number;
  mime_type: string;
}

export interface ModuleLearning {
  module: {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    type: 'prework' | 'module' | 'final';
    estimated_time_min: number;
    order: number;
    thumbnail_url: string | null;
  };
  progress: {
    status: 'active' | 'locked' | 'completed';
    progress_percentage: number;
    started_at: string | null;
    completed_at: string | null;
  };
  contents: BaseContent[];
}

export interface ModuleProgress {
  status: 'active' | 'locked' | 'completed';
  progress_percentage: number;
  started_at: string | null;
  completed_at: string | null;
}

export interface ProgressResponse {
  success: boolean;
  message: string;
  data: {
    module_progress: ModuleProgress;
    content_progress: ContentProgress | null;
    enrollment_progress: EnrollmentProgress;
  };
}

export interface EnrollmentProgress {
  progress_percentage: number;
  status: 'active' | 'completed';
  completed_at: string | null;
}
