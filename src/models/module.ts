export interface Module {
  id: number;
  course_id: number;
  order: number;
  type: 'prework' | 'module' | 'final';
  estimated_time_min: number;
  title: string;
  subtitle: string | null;
  description: string;
  thumbnail: string | null;
  thumbnail_url: string | undefined;
  is_locked: boolean;
  access_restriction: {
    is_restricted: boolean;
    start_at: string | null;
    end_at: string | null;
    status: 'available' | 'upcoming' | 'expired';
  };
  progress: {
    status: 'completed' | 'in_progress' | 'not_started';
    percentage: number;
    started_at: string | null;
    completed_at: string | null;
  };
  created_at?: string;
  updated_at?: string;
}
