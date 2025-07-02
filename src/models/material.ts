export interface Material {
  id?: number;
  title: string;
  description: string;
  file: string;
  course_id?: number;
}

export interface MaterialForm {
  title: string;
  description: string;
  file: File[] | FileList | File | null | undefined;
  course_id?: number;
  _method?: string;
}
