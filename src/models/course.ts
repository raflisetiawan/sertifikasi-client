import { Trainer } from './trainer';

export interface LiveSession {
  id?: number;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  meeting_link: string;
  meeting_password?: string;
}

export interface CourseForm {
  name: string;
  description: string;
  key_concepts: string[];
  facility: string[];
  price: number;
  image: File | null;
  syllabus: File | null;
  operational_start: string;
  operational_end: string;
  place: string;
  duration: string;
  trainer_ids: number[];
  trainer_selected: number[];
  live_sessions: LiveSession[];
}

export interface TrainerSelect {
  label: string;
  value: number | undefined;
}

export interface Courses {
  id: number;
  name: string;
  description: string;
  key_concepts: string;
  facility: string;
  price: string | number;
  place: string;
  duration: string;
  image: string | null;
  operational_start: string;
  operational_end: string;
  status: string;
  syllabus_path: string | null;
  created_at?: string;
  updated_at?: string;
  trainers?: Trainer[];
}

export interface CourseForUpdate extends Courses {
  live_sessions: LiveSession[];
  publication_readiness: {
    is_ready: boolean;
    errors: string[];
  };
}

export interface DetailCourse {
  name: string;
  description: string;
  facility: string;
  price: number;
  place: string;
  image?: File | null;
  operational_start: string | null | undefined;
  operational_end: string | null | undefined;
  benefit?: string;
  guidelines: File | null;
}

export interface CreateRegisterForm {
  name: string;
  phone: number;
  email: string;
  price: number;
  bank: null | string;
  priceRupiah: string;
}

export interface UserCourses {
  id: number;
  name: string;
  description: string;
  facility: string;
  price: number;
  place: string;
  time: string;
  image: File | null;
  operational_start: string;
  operational_end: string;
  created_at?: Date;
  updated_at?: Date;
  trainer?: Trainer;
  status?: string;
}

export interface RegisteredCourse {
  id: number;
  name: string;
  image: string;
  operational_start: string;
  place: string;
  status: string;
  verification: boolean;
}

export interface CourseTable {
  id: number;
  name: string;
  operational_start: string;
  operational_end: string;
  status: string;
  publication_readiness: {
    is_ready: boolean;
    errors: string[];
  };
}

export interface CourseRows {
  id: number;
  name: string;
  operational_start: string;
  operational_end: string;
  status: string;
}

export interface CourseIdAndNames {
  id: number;
  name: string;
}

export interface CourseIdAndNameOptions {
  value: number;
  label: string;
}

export interface MyProfileDetailCourse {
  name: string;
  description: string;
  duration: string;
  facility: string;
  id: number;
}
export interface CourseDetail {
  id: number;
  name: string;
  description: string;
  status: string;
  modules: Module[];
}

export interface Module {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  type: 'prework' | 'module' | 'final';
  order: number;
  estimated_time_min: number;
  thumbnail_url: string;
  concepts: Concept[];
  exercises: Exercise[];
}

export interface Concept {
  id: number;
  title: string;
  order: number;
}

export interface Exercise {
  id: number;
  description: string;
  order: number;
}
