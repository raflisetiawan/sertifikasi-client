export interface Faqs {
  id?: number;
  question: string;
  answer: string;
  category?: string;
  created_at?: Date | null;
  updated_at?: Date | null;
}
