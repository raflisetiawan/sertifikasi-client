import { CourseIdAndNames } from './course';

export interface LiveSession {
  id: number;
  course_id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  join_url: string;
  meeting_link: string;
  meeting_password?: string | null;
  created_at?: string;
  updated_at?: string;
  course?: CourseIdAndNames;
}

export interface LiveSessionForm {
  course_id: number | null;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  meeting_link: string;
  meeting_password?: string | null;
}
