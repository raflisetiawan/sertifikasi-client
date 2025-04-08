import { Trainer } from './trainer';
export interface CreateCourseForm {
  name: string;
  description: string;
  key_concepts: string;
  facility: string;
  price: number;
  image: File | null;
  operational_start: string;
  operational_end: string;
  place: string;
  duration: string;
  benefit: string;
  guidelines: File | null;
  syllabus?: File | null;
  certificate_example?: File | null;
  schedule?: File | null;
  trainerSelect: Array<{ label: string; value: number }>;
  trainer_ids: number[];
  trainer_selected: {
    label: string;
    value: number;
  }[];
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
  benefit: string;
  guidelines: string | null;
  syllabus_path: string | null;
  certificate_example_path: string | null;
  certificate_template_path: string | null;
  schedule_path: string | null;
  created_at?: string;
  updated_at?: string;
  trainers?: Trainer[];
}
export interface UpdateCourseForm {
  name: string;
  description: string;
  key_concepts: string;
  facility: string;
  price: number;
  place: string;
  duration: string;
  image: File | null;
  benefit: string;
  guidelines: File | null;
  syllabus?: File | null;
  certificate_example?: File | null;
  schedule?: File | null;
  operational_start: string;
  operational_end: string;
  trainerSelect: Array<{ label: string; value: number }>;
  trainer_ids: number[];
  trainer_selected: Array<{ label: string; value: number }>;
  _method?: string;
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
  priceRupiah: number;
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
  guidelines: File | null;
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
  guidelines: string;
}

export interface CourseTable {
  id: number;
  name: string;
  operational_start: string;
  operational_end: string;
  status: string;
  zoom_link?: ZoomLink;
}

export interface ZoomLink {
  id: number;
  link: string;
  courseId: number;
}

export interface CourseRows {
  id: number;
  name: string;
  operational_start: string;
  operational_end: string;
  status: string;
  zoom_link?: string;
  zoom_link_id?: number;
}

export interface CourseIdAndNames {
  id: number;
  name: string;
}

export interface CourseIdAndNameOptions {
  value: number;
  label: string;
}

interface Material {
  title: string;
  file: string;
  course_id: number;
  description: string;
}

export interface MyProfileDetailCourse {
  name: string;
  description: string;
  duration: string;
  facility: string;
  id: number;
  materials: Material[];
  zoom_link: {
    courseId: number;
    link: string;
  };
}
