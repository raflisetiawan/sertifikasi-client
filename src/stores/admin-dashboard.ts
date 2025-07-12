import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { DashboardData } from 'src/models/dashboard';
import { qCookies } from 'src/boot/cookies';

export const useAdminDashboardStore = defineStore('admin-dashboard', {
  state: () => ({
    dashboardData: null as DashboardData | null,
    loading: false,
    error: null as string | null,
  }),
  getters: {
    getStatistics: (state) => state.dashboardData?.statistics,
    getTrends: (state) => state.dashboardData?.trends,
    getRecentActivities: (state) => state.dashboardData?.recent_activities,
  },
  actions: {
    async fetchDashboardData() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/admin/dashboard', {
          headers: {
            Authorization: 'Bearer ' + qCookies.get('token'),
          },
        });
        this.dashboardData = response.data;
      } catch (e: any) {
        this.error = 'Failed to fetch dashboard data.';
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
  },
});
