import { Courses } from './course';

export interface Registration {
  id: number;
  user_id: number;
  course_id: number;
  verification: boolean;
  verified_at: string | null;
  verified_by: number | null;
  status: 'pending' | 'active' | 'cancelled';
  payment?: Payment;
  enrollment?: Enrollment;
}

export interface Payment {
  id: number;
  registration_id: number;
  midtrans_order_id: string;
  transaction_id: string | null;
  payment_type: string | null;
  transaction_time: string | null;
  gross_amount: number;
  transaction_status: string;
  fraud_status: string | null;
  snap_token: string | null;
  payment_url: string | null;
  payment_details: Record<string, unknown> | null;
}

export interface Enrollment {
  id: number;
  user_id: number;
  course_id: number;
  registration_id: number;
  status: string;
  started_at: string | null;
  completed_at: string | null;
  progress_percentage: number;
}

export interface RegistrationResponse {
  data: {
    registration: {
      id: number;
      verification: boolean;
      status: 'pending' | 'active' | 'cancelled';
      user_id: number;
      course_id: number;
      updated_at: string;
      created_at: string;
      course: Courses;
      verified_at: string | null; // Add missing properties
      verified_by: number | null;
    };
    user: {
      name: string;
      email: string;
    };
  };
  message: string;
  success: boolean;
}
