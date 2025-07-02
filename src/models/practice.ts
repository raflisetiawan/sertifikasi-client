export interface Practice {
  id: string;
  module_id: number;
  title: string;
  description: string;
  order: number;
  is_required: boolean;
  practices: PracticeItem[];
}

export interface PracticeItem {
  id: string;
  question: string;
  type: 'multiple_choice' | 'short_answer' | 'true_false';
  answer_key: string; // Changed to just string since we'll store boolean as string 'true'/'false'
  explanation: string | null;
  options: string[]; // Not optional anymore
}

export interface CreatePracticePayload {
  module_id: number;
  title: string;
  description: string;
  time_limit_minutes: number;
  order: number;
  is_required: boolean;
  questions: PracticeQuestion[];
}
export interface PracticeQuestion {
  question: string;
  type: 'multiple_choice' | 'short_answer' | 'true_false';
  options: string[];
  answer_key: string;
  explanation: string;
}

export interface PracticeContent {
  title: string;
  description: string;
  time_limit_minutes: number;
  is_required: boolean;
  questions: PracticeQuestion[];
}

export interface PracticeAnswer {
  question_id: number;
  answer: string | boolean;
}

export interface PracticeSubmitPayload {
  answers: PracticeAnswer[];
}

export interface PracticeResult {
  score: number;
  feedback: {
    question: string;
    is_correct: boolean;
    explanation: string;
    correct_answer: string;
  }[];
  progress: {
    status: 'completed';
    score: number;
    answers: PracticeAnswer[];
    completed_at: string;
    submission_details: {
      answers: PracticeAnswer[];
      feedback: {
        question: string;
        is_correct: boolean;
        explanation: string;
        correct_answer: string;
      }[];
      submitted_at: string;
    };
  };
}
