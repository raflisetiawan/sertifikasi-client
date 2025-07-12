import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';

// Definisikan tipe data untuk state
interface Statistics {
  total_active_classes: number;
  total_students: number;
  assignments_to_grade_count: number;
  unread_forum_posts_count: number;
}

interface ActionRequired {
  assignments_needing_grading: {
    title: string;
    course_name: string;
    module_name: string;
  }[];
  new_forum_questions: { thread_title: string; course_name: string }[];
}

interface ClassActivity {
  course_id: number;
  course_name: string;
  student_count: number;
  average_progress: string;
}

interface QuickLink {
  name: string;
  url: string;
}

interface TrainerDashboardState {
  statistics: Statistics | null;
  action_required: ActionRequired | null;
  class_activity_summary: ClassActivity[];
  quick_links: QuickLink[];
  loading: boolean;
  error: string | null;
}

export const useTrainerDashboardStore = defineStore('trainer-dashboard', {
  state: (): TrainerDashboardState => ({
    statistics: null,
    action_required: {
      assignments_needing_grading: [],
      new_forum_questions: [],
    },
    class_activity_summary: [],
    quick_links: [],
    loading: false,
    error: null,
  }),

  getters: {
    getStatistics: (state) => state.statistics,
    getActionRequired: (state) => state.action_required,
    getClassActivitySummary: (state) => state.class_activity_summary,
    getQuickLinks: (state) => state.quick_links,
    isLoading: (state) => state.loading,
  },

  actions: {
    async fetchDashboardData() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('trainer/dashboard');
        const data = response.data;
        this.statistics = data.statistics;
        this.action_required = data.action_required;
        this.class_activity_summary = data.class_activity_summary;
        this.quick_links = data.quick_links;
      } catch (error: any) {
        this.error = 'Gagal mengambil data dashboard. Silakan coba lagi.';
        console.error('Error fetching trainer dashboard data:', error);
      } finally {
        this.loading = false;
      }
    },
  },
});
