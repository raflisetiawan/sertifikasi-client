import { Module as CourseModule, Courses as CourseDetailType } from './course';

export interface StudentEnrollment {
  id: number;
  user_id: number;
  course_id: number;
  registration_id: number;
  status: string; // e.g., 'active', 'completed'
  started_at: string | null;
  completed_at: string | null;
  progress_percentage: number;
  final_score: number | null;
  admin_reviewed_at: string | null;
  certificate_number: string | null;
  certificate_path: string | null;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    google_id: string | null;
    name: string;
    email: string;
    email_verified_at: string | null;
    avatar: string | null;
    created_at: string;
    updated_at: string;
    phone_number: string | null;
    role_id: number;
    image: string;
  };
  module_progresses: EnrollmentModuleProgress[];
  content_progresses: EnrollmentContentProgress[];
  course: CourseDetailType; // Add course detail here
}

export interface EnrollmentModuleProgress {
  id: number;
  enrollment_id: number;
  module_id: number;
  status: 'active' | 'locked' | 'completed';
  progress_percentage: number;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  module: CourseModule;
}

export interface EnrollmentContentProgress {
  id: number; // Add this
  enrollment_id: number; // Add this
  module_content_id: number;
  status: 'completed' | 'in_progress' | 'not_started';
  score?: number | null; // For quizzes and assignments
  feedback?: string | null; // For assignments
  submission_details?: {
    type: 'text' | 'file';
    text_submission?: string;
    file_submission?: string; // URL to the file
  } | null;
  module_content: ModuleContentDetail; // Nested module_content
}

export interface ModuleContentDetail {
  id: number;
  module_id: number;
  title: string;
  content_type: string; // e.g., 'text', 'assignment', 'quiz'
  content_id: number;
  order: number;
  is_required: boolean;
  minimum_duration_seconds: number | null;
  completion_rules: any | null; // Adjust type as needed
  created_at: string;
  updated_at: string;
  content: any; // This will be a union type or specific interface based on content_type
}

// Example for Assignment content type
export interface AssignmentContent {
  id: number;
  title: string;
  description: string;
  instructions: string;
  submission_requirements: string[];
  due_date: string;
  max_file_size_mb: number;
  allowed_file_types: string;
  created_at: string;
  updated_at: string;
}
