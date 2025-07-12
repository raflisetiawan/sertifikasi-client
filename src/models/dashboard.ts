import { Courses } from './course';
import { User } from './user';

export interface DashboardData {
  statistics: Statistics;
  trends: Trends;
  recent_activities: RecentActivities;
}

export interface Statistics {
  total_users: number;
  total_active_courses: number;
  new_registrations_last_month: number;
  total_revenue: number;
}

export interface Trends {
  registration_trends: RegistrationTrend[];
}

export interface RegistrationTrend {
  date: string;
  count: number;
}

export interface RecentActivities {
  recently_updated_courses: Courses[];
  recently_registered_users: User[];
}