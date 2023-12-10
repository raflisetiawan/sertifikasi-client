export interface Trainer {
  id?: number;
  name: string;
  email: string;
  qualification: string;
  description: string;
  image?: null | File;
  starred?: boolean;
  created_at?: Date | null;
  updated_at?: Date | null;
}
