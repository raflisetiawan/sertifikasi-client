import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { qCookies } from 'src/boot/cookies';
import { PracticeItem, CreatePracticePayload } from 'src/models/practice';

export const usePracticeStore = defineStore('practice', {
  state: () => ({
    practices: [] as CreatePracticePayload[],
    loading: false,
    error: null as string | null,
    selectedPractice: null as PracticeItem | null,
    addPracticeDialog: false,
    selectedContentId: null as string | null,
  }),

  actions: {
    async fetchPractices(moduleId: number) {
      this.loading = true;
      try {
        const response = await api.get(`/admin/modules/${moduleId}/practices`);
        this.practices = response.data.data;
      } catch (error) {
        this.error = 'Failed to fetch practices';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createPractice(practice: CreatePracticePayload) {
      try {
        const response = await api.post('/admin/practices', practice, {
          headers: {
            Authorization: `Bearer ${qCookies.get('token')}`,
          },
        });
        return response.data;
      } catch (error) {
        this.error = 'Failed to create practice';
        throw error;
      }
    },

    async updatePractice(id: string, practice: Partial<CreatePracticePayload>) {
      try {
        const response = await api.put(`/admin/practices/${id}`, practice, {
          headers: {
            Authorization: `Bearer ${qCookies.get('token')}`,
          },
        });
        return response.data;
      } catch (error) {
        this.error = 'Failed to update practice';
        throw error;
      }
    },

    async deletePractice(id: string) {
      try {
        await api.delete(`/admin/practices/${id}`, {
          headers: {
            Authorization: `Bearer ${qCookies.get('token')}`,
          },
        });
      } catch (error) {
        this.error = 'Failed to delete practice';
        throw error;
      }
    },
  },
});
