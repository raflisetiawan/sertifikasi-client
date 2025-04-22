<template>
  <q-page padding>
    <!-- Welcome Section -->
    <div class="row q-mb-lg">
      <div class="col-12">
        <div class="text-h4 text-weight-bold q-mb-sm">
          <q-skeleton v-if="loading" type="text" width="300px" />
          <template v-else>
            Halo, {{ dashboardData?.user?.name || 'User' }}! 👋
          </template>
        </div>
        <div class="text-grey-8">
          Selamat datang kembali di UISI Online Learning
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="row q-col-gutter-md q-mb-lg">
      <!-- Active Courses Card -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card>
          <q-card-section>
            <div class="text-subtitle2 text-grey-8">Kelas Aktif</div>
            <div class="text-h4 q-mt-sm">
              <q-skeleton v-if="loading" type="text" width="50px" />
              <template v-else>
                {{ dashboardData?.active_courses?.length || 0 }}
              </template>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Total Registrations -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card>
          <q-card-section>
            <div class="text-subtitle2 text-grey-8">Total Pendaftaran</div>
            <div class="text-h4 q-mt-sm">
              <q-skeleton v-if="loading" type="text" width="50px" />
              <template v-else>
                {{ dashboardData?.registration_history?.length || 0 }}
              </template>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Total Payments -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card>
          <q-card-section>
            <div class="text-subtitle2 text-grey-8">Total Pembayaran</div>
            <div class="text-h4 q-mt-sm">
              <q-skeleton v-if="loading" type="text" width="100px" />
              <template v-else>
                {{ formatCurrency(totalPayments) }}
              </template>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Latest Payment Status -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card>
          <q-card-section>
            <div class="text-subtitle2 text-grey-8">Status Pembayaran Terakhir</div>
            <div class="text-h6 q-mt-sm">
              <q-skeleton v-if="loading" type="text" width="100px" />
              <template v-else>
                <q-chip :color="getPaymentStatusColor(latestPaymentStatus)" text-color="white">
                  {{ getPaymentStatusLabel(latestPaymentStatus) }}
                </q-chip>
              </template>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Active Courses -->
    <div class="row q-mb-xl">
      <div class="col-12">
        <div class="text-h6 q-mb-md">Kelas Aktif</div>
        <div class="row q-col-gutter-md">
          <template v-if="loading">
            <div v-for="n in 3" :key="n" class="col-12 col-md-4">
              <q-card>
                <q-skeleton height="200px" square />
                <q-card-section>
                  <q-skeleton type="text" class="text-h6" />
                  <q-skeleton type="text" width="60%" />
                </q-card-section>
              </q-card>
            </div>
          </template>
          <template v-else-if="dashboardData?.active_courses?.length">
            <div v-for="course in dashboardData.active_courses" :key="course.id" class="col-12 col-md-4">
              <q-card>
                <q-img :src="storageBaseUrl + 'courses/' + course.course.image || 'default-course.jpg'" height="200px">
                  <div class="absolute-bottom bg-transparent">
                    <div class="text-h6">{{ course.course.name }}</div>
                  </div>
                </q-img>
                <q-card-section>
                  <q-linear-progress :value="course.progress.percentage / 100" class="q-mb-sm" />
                  <div class="row items-center justify-between">
                    <div>Progress: {{ course.progress.percentage }}%</div>
                    <q-btn :to="{ name: 'dashboard.courses.show', params: { 'id': course.id } }" color="primary"
                      label="Lanjutkan" flat />
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </template>
          <div v-else class="col-12">
            <q-banner class="bg-grey-3">
              Belum ada kelas aktif
            </q-banner>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Registrations -->
    <div class="row">
      <div class="col-12">
        <div class="text-h6 q-mb-md">Riwayat Pendaftaran Terakhir</div>
        <q-table v-if="!loading" :rows="recentRegistrations" :columns="columns" row-key="id" flat bordered>
          <template v-slot:body-cell-payment_status="props">
            <q-td :props="props">
              <q-chip :color="getPaymentStatusColor(props.value)" text-color="white">
                {{ getPaymentStatusLabel(props.value) }}
              </q-chip>
            </q-td>
          </template>
          <template v-slot:body-cell-amount="props">
            <q-td :props="props">
              {{ formatCurrency(props.value) }}
            </q-td>
          </template>
        </q-table>
        <div v-else>
          <q-skeleton type="text" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { api, storageBaseUrl } from 'src/boot/axios';
import { qCookies } from 'src/boot/cookies';
import { QTableColumn, useQuasar } from 'quasar';
import { date } from 'quasar';
import toRupiah from '@develoka/angka-rupiah-js';
import { DashboardResponse } from 'src/models/dashboard';

const $q = useQuasar();
const loading = ref(true);
const dashboardData = ref<DashboardResponse['data'] | null>(null);

const columns: QTableColumn[] = [
  {
    name: 'course',
    label: 'Nama Kelas',
    field: (row) => row.course.name,
    align: 'left',
  },
  {
    name: 'created_at',
    label: 'Tanggal Daftar',
    field: 'created_at',
    format: (val: string) => date.formatDate(val, 'DD/MM/YYYY'),
  },
  {
    name: 'payment_status',
    label: 'Status Pembayaran',
    field: (row) => row.payment?.status || 'pending',
  },
  {
    name: 'amount',
    label: 'Jumlah',
    field: (row) => row.payment ? parseFloat(row.payment.amount) : 0,
  }
];

// Computed properties
const totalPayments = computed(() => {
  return dashboardData.value?.registration_history.reduce((total: number, reg) => {
    return total + (reg.payment ? parseFloat(reg.payment.amount) : 0);
  }, 0) || 0;
});

const latestPaymentStatus = computed(() => {
  return dashboardData.value?.registration_history[0]?.payment?.status || 'pending';
});

const recentRegistrations = computed(() => {
  return dashboardData.value?.registration_history.slice(0, 5) || [];
});

// Helper functions
const formatCurrency = (amount: number) => {
  return toRupiah(amount, { formal: false });
};

const getPaymentStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    settlement: 'positive',
    pending: 'warning',
    capture: 'info',
    deny: 'negative',
    cancel: 'grey',
    expire: 'grey-7',
    failure: 'negative'
  };
  return colors[status] || 'grey';
};

const getPaymentStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    settlement: 'Selesai',
    pending: 'Menunggu',
    capture: 'Diproses',
    deny: 'Ditolak',
    cancel: 'Dibatalkan',
    expire: 'Kadaluarsa',
    failure: 'Gagal'
  };
  return labels[status] || status;
};

// Fetch dashboard data
const fetchDashboardData = async () => {
  try {
    loading.value = true;
    const response = await api.get<DashboardResponse>('/user/dashboard', {
      headers: {
        Authorization: `Bearer ${qCookies.get('token')}`
      }
    });
    dashboardData.value = response.data.data;
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Gagal memuat data dashboard'
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDashboardData();
});
</script>

<style lang="scss" scoped>
.q-card {
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }
}
</style>
