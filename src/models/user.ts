export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
  email_verified_at?: Date | null;
  updated_at?: Date | null;
}
