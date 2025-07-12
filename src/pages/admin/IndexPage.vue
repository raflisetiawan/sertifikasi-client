<template>
  <q-page padding>
    <div v-if="dashboardStore.loading" class="flex flex-center">
      <q-spinner-dots color="primary" size="40px" />
    </div>
    <div v-else-if="dashboardStore.error" class="text-center text-negative">
      {{ dashboardStore.error }}
    </div>
    <div v-else-if="dashboardStore.dashboardData" class="q-gutter-y-md">
      <!-- Statistics Cards -->
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6 col-md-3">
          <StatisticCard icon="people" label="Total Pengguna" :value="statistics?.total_users ?? 0" color="primary" />
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <StatisticCard icon="school" label="Kursus Aktif" :value="statistics?.total_active_courses ?? 0" color="secondary" />
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <StatisticCard icon="person_add" label="Pendaftar Baru (Bulan Ini)" :value="statistics?.new_registrations_last_month ?? 0" color="accent" />
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <StatisticCard icon="monetization_on" label="Total Pendapatan" :value="toRupiah(statistics?.total_revenue ?? 0)" color="positive" />
        </div>
      </div>

      <!-- Registration Trend Chart -->
      <div class="row">
        <div class="col-12">
          <RegistrationTrendChart v-if="trends" :trends="trends.registration_trends" />
        </div>
      </div>

      <!-- Recent Activities Tables -->
      <div class="row q-col-gutter-md">
        <div class="col-12 col-lg-6">
          <RecentCoursesTable v-if="recentActivities" :courses="recentActivities.recently_updated_courses" />
        </div>
        <div class="col-12 col-lg-6">
          <RecentUsersTable v-if="recentActivities" :users="recentActivities.recently_registered_users" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useMetaTitle } from 'src/composables/meta';
import { onMounted, computed } from 'vue';
import { useAdminDashboardStore } from 'src/stores/admin-dashboard';
import StatisticCard from 'src/components/admin/dashboard/StatisticCard.vue';
import RegistrationTrendChart from 'src/components/admin/dashboard/RegistrationTrendChart.vue';
import RecentCoursesTable from 'src/components/admin/dashboard/RecentCoursesTable.vue';
import RecentUsersTable from 'src/components/admin/dashboard/RecentUsersTable.vue';
import toRupiah from '@develoka/angka-rupiah-js';

useMetaTitle('Dashboard - Admin');

const dashboardStore = useAdminDashboardStore();

const statistics = computed(() => dashboardStore.getStatistics);
const trends = computed(() => dashboardStore.getTrends);
const recentActivities = computed(() => dashboardStore.getRecentActivities);

onMounted(() => {
  dashboardStore.fetchDashboardData();
});
</script>
