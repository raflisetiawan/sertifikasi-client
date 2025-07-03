import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { qCookies } from 'src/boot/cookies';
import { LiveSession, LiveSessionForm } from 'src/models/live-session';

export const useLiveSessionStore = defineStore('live-session', {
  state: () => ({
    liveSessions: [] as LiveSession[],
    pagination: {
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
      sortBy: '',
      descending: false,
    },
    formDialog: false,
    deleteDialog: false,
    editedLiveSession: null as LiveSession | null,
  }),

  actions: {
    async fetchLiveSessions(params: { page: number; limit: number; courseId?: number; sortBy?: string | null; descending?: boolean }) {
      try {
        const response = await api.get('live-sessions', {
          params: {
            page: params.page,
            limit: params.limit,
            courseId: params.courseId,
            sortBy: params.sortBy,
            descending: params.descending,
          },
          headers: {
            Authorization: `Bearer ${qCookies.get('token')}`,
          },
        });
        this.liveSessions = response.data.data;
        this.pagination.page = response.data.meta.current_page;
        this.pagination.rowsPerPage = response.data.meta.per_page;
        this.pagination.rowsNumber = response.data.meta.total;
      } catch (error) {
        console.error('Error fetching live sessions:', error);
      }
    },

    async createLiveSession(data: LiveSessionForm) {
      try {
        await api.post('live-sessions', data, {
          headers: {
            Authorization: `Bearer ${qCookies.get('token')}`,
          },
        });
        this.formDialog = false;
        await this.fetchLiveSessions({ page: 1, limit: this.pagination.rowsPerPage });
      } catch (error) {
        console.error('Error creating live session:', error);
      }
    },

    async updateLiveSession(id: number, data: LiveSessionForm) {
      try {
        await api.put(`live-sessions/${id}`, data, {
          headers: {
            Authorization: `Bearer ${qCookies.get('token')}`,
          },
        });
        this.formDialog = false;
        await this.fetchLiveSessions({ page: this.pagination.page, limit: this.pagination.rowsPerPage });
      } catch (error) {
        console.error('Error updating live session:', error);
      }
    },

    async deleteLiveSession(id: number) {
      try {
        await api.delete(`live-sessions/${id}`, {
          headers: {
            Authorization: `Bearer ${qCookies.get('token')}`,
          },
        });
        this.deleteDialog = false;
        await this.fetchLiveSessions({ page: this.pagination.page, limit: this.pagination.rowsPerPage });
      } catch (error) {
        console.error('Error deleting live session:', error);
      }
    },

    async fetchLiveSessionsByCourse(courseId: number): Promise<LiveSession[]> {
      try {
        const response = await api.get(`courses/${courseId}/live-sessions`, {
          headers: {
            Authorization: `Bearer ${qCookies.get('token')}`,
          },
        });
        return response.data.data;
      } catch (error) {
        console.error(`Error fetching live sessions for course ${courseId}:`, error);
        return [];
      }
    },
  },
});
