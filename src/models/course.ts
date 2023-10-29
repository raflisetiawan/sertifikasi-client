export interface CreateCourseForm {
  name: string;
  description: string;
  facility: string;
  price: number;
  place: string;
  time: string;
  image: File | string;
  operational: string | number | null | undefined;
}
