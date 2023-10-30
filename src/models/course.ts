export interface CreateCourseForm {
  name: string;
  description: string;
  facility: string;
  price: number;
  place: string;
  time: string;
  image: File | null;
  operational: string | null | undefined;
}

export interface Courses {
  id: number;
  name: string;
  description: string;
  facility: string;
  price: number;
  place: string;
  time: string;
  image: File | null;
  operational: string;
  created_at?: Date;
  updated_at?: Date;
}
export interface UpdateCourseForm {
  name: string;
  description: string;
  facility: string;
  price: number;
  place: string;
  time: string;
  image?: File | null;
  operational: string | null | undefined;
  _method?: string;
}
