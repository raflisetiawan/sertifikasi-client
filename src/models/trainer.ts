export interface Trainer {
  id: number;
  name: string;
  email: string;
  qualification: string;
  description: string;
  image: string | File | null;
  starred: boolean;
  created_at: string;
  updated_at: string;
  pivot?: {
    course_id: number;
    trainer_id: number;
  };
}
