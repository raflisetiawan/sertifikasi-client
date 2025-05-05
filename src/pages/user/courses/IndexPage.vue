<template>
  <q-page padding>
    <div class="row q-mb-md items-center justify-between">
      <div class="text-h5">Kelas Saya</div>

      <!-- Sort Options -->
      <q-select v-model="sortBy" :options="sortOptions" outlined dense style="width: 200px" label="Urutkan">
        <template v-slot:append>
          <q-icon name="sort" />
        </template>
      </q-select>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="row q-col-gutter-md">
      <div v-for="n in 3" :key="n" class="col-12 col-md-4">
        <q-card>
          <q-skeleton height="200px" square />
          <q-card-section>
            <q-skeleton type="text" class="text-h6" />
            <q-skeleton type="text" width="60%" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center q-pa-md">
      <q-icon name="error" size="50px" color="negative" />
      <div class="text-h6 q-mt-md">{{ error }}</div>
      <q-btn color="primary" label="Coba Lagi" @click="fetchCourses" class="q-mt-sm" />
    </div>

    <!-- Course List -->
    <div v-else class="row q-col-gutter-md">
      <div v-for="course in sortedCourses" :key="course.id" class="col-12 col-sm-6 col-md-4">
        <q-card class="course-card" @click="goToCourseDetail(course.course.id)">
          <!-- Course Image -->
          <q-img :src="storageBaseUrl + 'courses/' + course.course.image || 'default-course.jpg'" :ratio="16 / 9"
            spinner-color="primary" spinner-size="82px">
            <!-- Payment Status Badge -->
            <div class="absolute-top-right q-pa-sm">
              <q-chip :color="getPaymentStatusColor(course.payment_status)" text-color="white">
                {{ getPaymentStatusLabel(course.payment_status) }}
              </q-chip>
            </div>
          </q-img>

          <q-card-section>
            <!-- Course Name -->
            <div class="text-h6 ellipsis-2-lines">{{ course.course.name }}</div>

            <!-- Start Date -->
            <div class="text-subtitle2 q-mt-sm">
              <q-icon name="event" size="sm" />
              Mulai: {{ formatDate(course.course.start_date) }}
            </div>

            <!-- Verification Status -->
            <div class="q-mt-sm">
              <q-chip :color="course.verification ? 'positive' : 'warning'" text-color="white" size="sm">
                {{ course.verification ? 'Terverifikasi' : 'Belum Terverifikasi' }}
              </q-chip>
            </div>

            <!-- Progress Bar -->
            <div v-if="course.progress" class="q-mt-md">
              <div class="row items-center q-gutter-x-sm">
                <q-linear-progress :value="course.progress.percentage / 100" size="md" class="col" color="primary" />
                <div class="text-caption">
                  {{ course.progress.percentage }}%
                </div>
              </div>
              <div class="text-caption q-mt-xs">
                {{ getProgressStatus(course.progress.status) }}
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Empty State -->
      <div v-if="sortedCourses.length === 0" class="col-12 text-center q-pa-xl">
        <q-icon name="school" size="100px" color="grey-4" />
        <div class="text-h6 text-grey-6 q-mt-md">Belum ada kelas yang diambil</div>
        <q-btn color="primary" label="Jelajahi Kelas" to="/courses" class="q-mt-md" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { date } from 'quasar';
import { api, storageBaseUrl } from 'src/boot/axios';
import { qCookies } from 'src/boot/cookies';

interface Progress {
  percentage: number;
  started_at: string;
  completed_at: string | null;
  status: string;
}

interface Course {
  id: number;
  course: {
    id: number;
    name: string;
    image: string | null;
    start_date: string;
  };
  payment_status: string;
  verification: boolean;
  progress: Progress | null;
  registered_at: string;
}

const router = useRouter();
const loading = ref(true);
const error = ref<string | null>(null);
const courses = ref<Course[]>([]);
const sortBy = ref('latest');

const sortOptions = [
  { label: 'Terbaru', value: 'latest' },
  { label: 'Terlama', value: 'oldest' }
];

// Computed property for sorted courses
const sortedCourses = computed(() => {
  return [...courses.value].sort((a, b) => {
    const dateA = new Date(a.registered_at).getTime();
    const dateB = new Date(b.registered_at).getTime();
    return sortBy.value === 'latest' ? dateB - dateA : dateA - dateB;
  });
});

// Helper functions
const formatDate = (dateString: string) => {
  return date.formatDate(dateString, 'D MMMM YYYY');
};

const getPaymentStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    settlement: 'positive',
    pending: 'warning',
    expire: 'negative'
  };
  return colors[status] || 'grey';
};

const getPaymentStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    settlement: 'Lunas',
    pending: 'Menunggu',
    expire: 'Kadaluarsa'
  };
  return labels[status] || status;
};

const getProgressStatus = (status: string) => {
  const labels: Record<string, string> = {
    not_started: 'Belum Dimulai',
    in_progress: 'Sedang Berlangsung',
    completed: 'Selesai'
  };
  return labels[status] || status;
};

const goToCourseDetail = (courseId: number) => {
  router.push({ name: 'dashboard.courses.show', params: { 'id': courseId } });
};

// Fetch courses data
const fetchCourses = async () => {
  try {
    loading.value = true;
    error.value = null;

    const response = await api.get('/user/courses', {
      headers: {
        Authorization: `Bearer ${qCookies.get('token')}`
      },
      params: {
        sort: sortBy.value
      }
    });
    console.log(response.data.data);
    courses.value = response.data.data;
  } catch (err) {
    error.value = 'Gagal memuat data kelas';
    console.error('Error fetching courses:', err);
  } finally {
    loading.value = false;
  }
};

// Watch for sort changes
watch(sortBy, () => {
  fetchCourses();
});

onMounted(() => {
  fetchCourses();
});
</script>

<style lang="scss" scoped>
.course-card {
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
