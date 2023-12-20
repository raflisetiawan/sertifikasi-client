export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
  email_verified_at?: Date | null;
  updated_at?: Date | null;
  phone_number: number;
  role: string;
  image?: string;
}

export interface UserEditForm {
  name: string;
  phone_number: number;
  image?: null | File;
  _method?: string;
}
