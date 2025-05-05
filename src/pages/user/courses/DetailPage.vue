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
      <template v-if="courseDetail">
        <!-- Course Header -->
        <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-8">
            <h1 class="text-h4 q-mb-md">{{ courseDetail?.course.name }}</h1>
            <p class="text-grey-8">{{ courseDetail?.course.description }}</p>

            <!-- Key Concepts -->
            <KeyConceptSection v-if="courseDetail?.course.key_concepts" :concepts="courseDetail.course.key_concepts" />
            <FacilitySection v-if="courseDetail?.course.facility" :facilities="courseDetail.course.facility" />
            <!-- Facilities -->
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
                <q-linear-progress class="q-py-md" :value="(courseDetail.enrollment?.progress_percentage || 0) / 100"
                  :color="getProgressColor(courseDetail.enrollment?.status)">
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
              <q-card @click="handleModuleClick(module.id, courseDetail.enrollment.id)"
                class="module-card cursor-pointer" v-ripple>
                <q-card-section>
                  <div class="row items-center">
                    <div class="col">
                      <div class="text-h6">{{ module.title }}</div>
                      <div class="text-grey-8 q-mt-sm" v-html="module.description"></div>
                    </div>
                    <div class="col-auto">
                      <q-chip :color="getModuleTypeColor(module.type)" text-color="white">
                        {{ getModuleTypeLabel(module.type) }}
                      </q-chip>
                    </div>
                  </div>

                  <div v-if="module.progress" class="q-mt-md">
                    <q-linear-progress :value="(module.progress.percentage || 0) / 100"
                      :color="getProgressColor(module.progress.status)" size="22px">
                      <div class="absolute-full flex flex-center">
                        <q-badge color="white" text-color="black" :label="`${module.progress.percentage}%`" />
                      </div>
                    </q-linear-progress>
                    <div class="row justify-between q-mt-sm">
                      <div class="text-caption">
                        {{ getProgressStatusLabel(module.progress.status) }}
                      </div>
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
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { date } from 'quasar';
import { api } from 'src/boot/axios';
import { qCookies } from 'src/boot/cookies';
import toRupiah from '@develoka/angka-rupiah-js';
import KeyConceptSection from 'src/components/user/course/dashboard/KeyConceptSection.vue';
import FacilitySection from 'src/components/user/course/dashboard/FacilitySection.vue';
import { CourseDetail } from 'src/models/dashboard';

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const error = ref<string | null>(null);
const courseDetail = ref<CourseDetail | null>(null);

const formatDate = (dateString: string | undefined | null): string => {
  return dateString ? date.formatDate(dateString, 'D MMMM YYYY') : '-';
};

const formatCurrency = (amount: string | undefined | null): string => {
  return amount ? toRupiah(amount) : 'Rp 0';
};

const getPaymentStatusColor = (status: string | undefined): string => {
  if (!status) return 'grey';

  const colors: Record<string, string> = {
    settlement: 'positive',
    pending: 'warning',
    expire: 'negative',
    cancel: 'grey'
  };
  return colors[status] || 'grey';
};

const getPaymentStatusLabel = (status: string | undefined): string => {
  if (!status) return '-';

  const labels: Record<string, string> = {
    settlement: 'Lunas',
    pending: 'Menunggu',
    expire: 'Kadaluarsa',
    cancel: 'Dibatalkan'
  };
  return labels[status] || status;
};

const getProgressColor = (status: string | undefined): string => {
  if (!status) return 'grey';

  const colors: Record<string, string> = {
    completed: 'positive',
    in_progress: 'info',
    not_started: 'grey'
  };
  return colors[status] || 'grey';
};

const getProgressStatusLabel = (status: string | undefined): string => {
  if (!status) return 'Belum Dimulai';

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

const handleModuleClick = (moduleId: number, enrollmentId: number | undefined) => {
  // Navigate to the module detail page
  router.push({
    name: 'dashboard.courses.module.learn',
    params: { courseId: route.params.id, moduleId, enrollmentId }
  });
};

const fetchCourseDetail = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await api.get<{ data: CourseDetail }>(`/user/courses/${route.params.id}`, {
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

.module-card {
  transition: all 0.3s ease;
  border: 1px solid transparent;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-color: $primary;

    // Optional: Change background on hover
    background: linear-gradient(to right, rgba(25, 118, 210, 0.05), transparent);
  }

  // Optional: Add active state
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  // Add cursor indicator
  &::after {
    content: '';
    position: absolute;
    top: 16px;
    right: 16px;
    width: 24px;
    height: 24px;
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%231976d2"><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/></svg>');
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::after {
    opacity: 1;
  }
}

// Add focus styles for accessibility
.module-card:focus {
  outline: none;
  border-color: $primary;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
}

// Progress bar enhancements
.q-linear-progress {
  transition: all 0.3s ease;

  .module-card:hover & {
    height: 24px !important;
  }
}

// Optional: Enhance chip animation
.q-chip {
  transition: transform 0.3s ease;

  .module-card:hover & {
    transform: scale(1.05);
  }
}
</style>
