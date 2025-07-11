export interface User {
  id: number;
  google_id: string | null;
  name: string;
  email: string;
  email_verified_at: string;
  avatar: string | null;
  created_at: string;
  updated_at: string;
  phone_number: string | null;
  role_id: number;
  image: string;
}

export interface Course {
  id: number;
  name: string;
  description: string;
  key_concepts: string[];
  facility: string[];
  price: string;
  place: string;
  duration: string;
  image: string;
  operational_start: string;
  operational_end: string;
  status: string;
  benefit: string;
  guidelines: string;
  syllabus_path: string | null;
  created_at: string;
  updated_at: string;
}

export interface Forum {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  course_id: number;
  course: Course;
  threads?: Thread[];
}

export interface Post {
  id: number;
  thread_id: number;
  user_id: number;
  body: string;
  created_at: string;
  updated_at: string;
  user: User;
}

export interface Thread {
  id: number;
  forum_id: number;
  user_id: number;
  title: string;
  body: string;
  replies_count: number;
  last_activity_at: string;
  created_at: string;
  updated_at: string;
  user: User;
  posts: Post[];
}