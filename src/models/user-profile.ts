export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  image: string | null;
}

export interface UpdateProfileForm {
  name?: string;
  phone_number?: string;
  current_password?: string;
  new_password?: string;
  new_password_confirmation?: string;
}
