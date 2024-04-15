interface User {
  id: number;
  email: string;
}

interface Course {
  id: number;
  name: string;
}

export interface Registrant {
  id: number;
  user_id: number;
  course_id: number;
  user: User;
  course: Course;
  verification: boolean;
}

export interface DetailRegistration {
  email: string;
  registration_date: string;
  phone_number: number;
  name: string;
  course_name: string;
  course_price: string;
  payment_proof_url: string;
}
