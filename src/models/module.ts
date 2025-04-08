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
  created_at?: string;
  updated_at?: string;
}
