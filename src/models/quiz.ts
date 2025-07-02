export type QuestionType =
  | 'multiple_choice'
  | 'multiple_choice_multiple'
  | 'short_answer';

export interface QuizQuestion {
  id?: number; // Made optional since backend might not always provide it
  question: string;
  type: QuestionType;
  options?: string[];
  score: number;
}

export interface QuizData {
  course_id?: number; // Made optional
  title: string;
  description: string;
  time_limit_minutes: number;
  passing_score: number;
  attempts_left: number;
  questions: QuizQuestion[];
}

export interface QuizAnswer {
  question_id: number;
  answer: string | string[];
}

export interface QuizSubmission {
  answers: QuizAnswer[];
  time_spent_seconds: number;
}

export interface QuizResult {
  score: number;
  passing_score: number;
  passed: boolean;
  attempts_left: number;
  attempts?: number;
  max_attempts?: number;
  feedback: Array<{
    question_id: number;
    correct: boolean;
    explanation: string | null;
  }>;
}

export interface QuizRouteState {
  [key: number]: unknown;
  result?: QuizResult;
}
