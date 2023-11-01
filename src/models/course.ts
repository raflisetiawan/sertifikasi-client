export interface CreateCourseForm {
  name: string;
  description: string;
  facility: string;
  price: number;
  place: string;
  time: string;
  image: File | null;
  operational_start: string | null | undefined;
  operational_end: string | null | undefined;
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
  operational_start: string;
  operational_end: string;
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
  operational_start: string | null | undefined;
  operational_end: string | null | undefined;
  _method?: string;
}

export interface DetailCourse {
  name: string;
  description: string;
  facility: string;
  price: number;
  place: string;
  time: string;
  image?: File | null;
  operational_start: string | null | undefined;
  operational_end: string | null | undefined;
}

export interface CreateRegisterForm {
  name: string;
  phone: number;
  email: string;
  price: number;
  bank: null | string;
  voucher_code: string;
}
