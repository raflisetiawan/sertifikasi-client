import { Module } from './module';

export interface DashboardResponse {
  data: {
    user: {
      id: number;
      name: string;
      email: string;
      image: string;
    };
    active_courses: Array<{
      id: number;
      course: {
        id: number;
        name: string;
        description: string;
        start_date: string;
        status: string;
        image: string | null;
        place: string;
      };
      progress: {
        percentage: number;
        started_at: string;
        last_activity: string;
        status: string;
      };
    }>;
    registration_history: Array<{
      id: number;
      course: {
        id: number;
        name: string;
        price: string;
      };
      status: string;
      created_at: string;
      payment?: {
        status: string;
        type: string;
        amount: string;
        date: string;
      };
    }>;
  };
}

export interface CourseDetail {
  course: {
    id: number;
    name: string;
    description: string;
    key_concepts: string[];
    facility: string[];
    start_date: string;
    end_date: string;
    status: string;
  };
  modules: Module[];
  enrollment: {
    id: number;
    status: string;
    progress_percentage: number;
    started_at: string;
    completed_at: string | null;
  };
  payment?: {
    status: string;
    amount: string;
    date: string;
  };
  registered_at: string;
  verification: boolean;
  verified_at: string | null;
}
