import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';

interface ContentTrainerStats {
  total_attempts?: number;
  average_score?: string;
  needs_review_count?: number;
  total_submissions?: number;
  pending_grading_count?: number;
  graded_count?: number;
}

interface ModuleContent {
  id: number;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'assignment' | 'file' | 'practice';
  order: number;
  url?: string; // For video
  duration_minutes?: number; // For video
  content_html?: string; // For text
  question_count?: number; // For quiz
  description?: string; // For assignment
  file_url?: string; // For file
  file_name?: string; // For file
  trainer_stats?: ContentTrainerStats;
}

interface ModuleDetail {
  id: number;
  title: string;
  description: string;
  course_id: number;
  course_name: string;
  order: number;
  contents: ModuleContent[];
}

interface TrainerModuleState {
  module: ModuleDetail | null;
  loading: boolean;
  error: string | null;
}

export const useTrainerModuleStore = defineStore('trainer-module', {
  state: (): TrainerModuleState => ({
    module: null,
    loading: false,
    error: null,
  }),

  getters: {
    getModule: (state) => state.module,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
  },

  actions: {
    async fetchModuleDetail(moduleId: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(`trainer/modules/${moduleId}`);
        this.module = response.data.module;
      } catch (error: any) {
        this.error = 'Gagal memuat detail modul. Silakan coba lagi.';
        console.error('Error fetching trainer module detail:', error);
      } finally {
        this.loading = false;
      }
    },
  },
});
