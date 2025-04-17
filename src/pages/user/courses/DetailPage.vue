<template>
  <q-page padding>
    <!-- Loading State -->
    <div v-if="loading" class="row q-col-gutter-md">
      <div class="col-12">
        <q-skeleton type="text" class="text-h4" />
        <q-skeleton type="text" class="q-mt-sm" width="60%" />
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center q-pa-md">
      <q-icon name="error" size="50px" color="negative" />
      <div class="text-h6 q-mt-md">{{ error }}</div>
      <q-btn color="primary" label="Coba Lagi" @click="fetchCourseDetail" class="q-mt-sm" />
    </div>

    <template v-else>
      <!-- Course Header -->
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-8">
          <h1 class="text-h4 q-mb-md">{{ courseDetail.course.name }}</h1>
          <p class="text-grey-8">{{ courseDetail.course.description }}</p>

          <!-- Key Concepts -->
          <div class="q-mt-lg">
            <div class="text-h6">Konsep Utama</div>
            <div class="row q-col-gutter-sm q-mt-sm">
              <div v-for="(concept, index) in parsedKeyConcepts" :key="index" class="col-12 col-sm-6">
                <q-item class="bg-blue-1 rounded-borders">
                  <q-item-section avatar>
                    <q-icon name="school" color="primary" />
                  </q-item-section>
                  <q-item-section>{{ concept }}</q-item-section>
                </q-item>
              </div>
            </div>
          </div>

          <!-- Facilities -->
          <div class="q-mt-lg">
            <div class="text-h6">Fasilitas</div>
            <div class="row q-col-gutter-sm q-mt-sm">
              <div v-for="(facility, index) in parsedFacilities" :key="index" class="col-12 col-sm-6">
                <q-item class="bg-green-1 rounded-borders">
                  <q-item-section avatar>
                    <q-icon name="check_circle" color="positive" />
                  </q-item-section>
                  <q-item-section>{{ facility }}</q-item-section>
                </q-item>
              </div>
            </div>
          </div>
        </div>

        <!-- Course Status Cards -->
        <div class="col-12 col-md-4">
          <!-- Course Timeline -->
          <q-card class="q-mb-md">
            <q-card-section>
              <div class="text-subtitle1">Periode Kelas</div>
              <div class="row q-col-gutter-sm q-mt-sm">
                <div class="col-6">
                  <q-item class="bg-grey-2 rounded-borders">
                    <q-item-section>
                      <q-item-label caption>Mulai</q-item-label>
                      <q-item-label>{{ formatDate(courseDetail.course.start_date) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
                <div class="col-6">
                  <q-item class="bg-grey-2 rounded-borders">
                    <q-item-section>
                      <q-item-label caption>Selesai</q-item-label>
                      <q-item-label>{{ formatDate(courseDetail.course.end_date) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Registration Info -->
          <q-card class="q-mb-md">
            <q-card-section>
              <div class="text-subtitle1">Informasi Pendaftaran</div>
              <q-list>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Tanggal Daftar</q-item-label>
                    <q-item-label>{{ formatDate(courseDetail.registered_at) }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Status Verifikasi</q-item-label>
                    <q-item-label>
                      <q-chip :color="courseDetail.verification ? 'positive' : 'warning'" text-color="white">
                        {{ courseDetail.verification ? 'Terverifikasi' : 'Belum Terverifikasi' }}
                      </q-chip>
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item v-if="courseDetail.verified_at">
                  <q-item-section>
                    <q-item-label caption>Tanggal Verifikasi</q-item-label>
                    <q-item-label>{{ formatDate(courseDetail.verified_at) }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>

          <!-- Payment Info -->
          <q-card class="q-mb-md">
            <q-card-section>
              <div class="text-subtitle1">Informasi Pembayaran</div>
              <q-list>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Status Pembayaran</q-item-label>
                    <q-item-label>
                      <q-chip :color="getPaymentStatusColor(courseDetail.payment?.status)" text-color="white">
                        {{ getPaymentStatusLabel(courseDetail.payment?.status) }}
                      </q-chip>
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Jumlah Dibayar</q-item-label>
                    <q-item-label>{{ formatCurrency(courseDetail.payment?.amount) }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item v-if="courseDetail.payment?.date">
                  <q-item-section>
                    <q-item-label caption>Tanggal Pembayaran</q-item-label>
                    <q-item-label>{{ formatDate(courseDetail.payment.date) }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>

          <!-- Progress Info -->
          <q-card v-if="courseDetail.enrollment">
            <q-card-section>
              <div class="text-subtitle1">Progress Kelas</div>
              <q-linear-progress :value="courseDetail.enrollment.progress_percentage / 100" class="q-mt-sm" size="20px"
                :color="getProgressColor(courseDetail.enrollment.status)">
                <div class="absolute-full flex flex-center">
                  <q-badge color="white" text-color="black"
                    :label="`${courseDetail.enrollment.progress_percentage}%`" />
                </div>
              </q-linear-progress>
              <div class="row q-col-gutter-sm q-mt-md">
                <div class="col-12">
                  <q-chip :color="getProgressStatusColor(courseDetail.enrollment.status)" text-color="white">
                    {{ getProgressStatusLabel(courseDetail.enrollment.status) }}
                  </q-chip>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Modules Section -->
      <div class="q-mt-xl">
        <div class="text-h5 q-mb-md">Modul Pembelajaran</div>
        <div class="row q-col-gutter-md">
          <div v-for="module in courseDetail.modules" :key="module.id" class="col-12">
            <q-card>
              <q-card-section>
                <div class="row items-center">
                  <div class="col">
                    <div class="text-h6">{{ module.title }}</div>
                    <div class="text-grey-8 q-mt-sm">{{ module.description }}</div>
                  </div>
                  <div class="col-auto">
                    <q-chip :color="getModuleTypeColor(module.type)" text-color="white">
                      {{ getModuleTypeLabel(module.type) }}
                    </q-chip>
                  </div>
                </div>

                <div v-if="module.progress" class="q-mt-md">
                  <q-linear-progress :value="module.progress.percentage / 100" size="10px"
                    :color="getProgressColor(module.progress.status)">
                    <div class="absolute-full flex flex-center">
                      <q-badge color="white" text-color="black" :label="`${module.progress.percentage}%`" />
                    </div>
                  </q-linear-progress>
                  <div class="row justify-between q-mt-sm">
                    <div class="text-caption">{{ getProgressStatusLabel(module.progress.status) }}</div>
                    <div class="text-caption">
                      <template v-if="module.progress.completed_at">
                        Selesai: {{ formatDate(module.progress.completed_at) }}
                      </template>
                      <template v-else-if="module.progress.started_at">
                        Mulai: {{ formatDate(module.progress.started_at) }}
                      </template>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { date } from 'quasar';
import { api } from 'src/boot/axios';
import { qCookies } from 'src/boot/cookies';
import toRupiah from '@develoka/angka-rupiah-js';

const route = useRoute();
const loading = ref(true);
const error = ref<string | null>(null);
const courseDetail = ref<any>(null);

const parsedKeyConcepts = computed(() => {
  try {
    return JSON.parse(courseDetail.value?.course?.key_concepts || '[]');
  } catch {
    return [];
  }
});

const parsedFacilities = computed(() => {
  try {
    return JSON.parse(courseDetail.value?.course?.facility || '[]');
  } catch {
    return [];
  }
});

const formatDate = (dateString: string) => {
  return dateString ? date.formatDate(dateString, 'D MMMM YYYY') : '-';
};

const formatCurrency = (amount: string) => {
  return amount ? toRupiah(amount) : 'Rp 0';
};

const getPaymentStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    settlement: 'positive',
    pending: 'warning',
    expire: 'negative',
    cancel: 'grey'
  };
  return colors[status] || 'grey';
};

const getPaymentStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    settlement: 'Lunas',
    pending: 'Menunggu',
    expire: 'Kadaluarsa',
    cancel: 'Dibatalkan'
  };
  return labels[status] || status || '-';
};

const getProgressColor = (status: string) => {
  const colors: Record<string, string> = {
    completed: 'positive',
    in_progress: 'info',
    not_started: 'grey'
  };
  return colors[status] || 'grey';
};

const getProgressStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    completed: 'Selesai',
    in_progress: 'Sedang Berlangsung',
    not_started: 'Belum Dimulai'
  };
  return labels[status] || status;
};

const getProgressStatusColor = getProgressColor;

const getModuleTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    module: 'primary',
    prework: 'purple',
    final: 'deep-orange'
  };
  return colors[type] || 'grey';
};

const getModuleTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    module: 'Modul',
    prework: 'Prework',
    final: 'Final'
  };
  return labels[type] || type;
};

const fetchCourseDetail = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await api.get(`/user/courses/${route.params.id}`, {
      headers: {
        Authorization: `Bearer ${qCookies.get('token')}`
      }
    });
    courseDetail.value = response.data.data;
  } catch (err) {
    error.value = 'Gagal memuat detail kelas';
    console.error('Error fetching course detail:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchCourseDetail();
});
</script>

<style lang="scss" scoped>
.q-item {
  min-height: 40px;
}

.progress-label {
  position: absolute;
  width: 100%;
  text-align: center;
  font-size: 12px;
  color: white;
}
</style>
