<template>
  <q-page padding>
    <div v-if="loading" class="text-center">
      <q-spinner-dots color="primary" size="40px" />
      <p>Memuat data dashboard...</p>
    </div>

    <div v-else-if="error" class="text-center text-negative">
      <q-icon name="error" size="md" />
      <p>{{ error }}</p>
      <q-btn @click="fetchDashboardData" label="Coba Lagi" color="primary" />
    </div>

    <div v-else>
      <div class="text-h4 q-mb-md">Selamat Datang, Trainer!</div>

      <!-- Statistics Section -->
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-12 col-sm-6 col-md-3" v-for="(value, key) in statistics" :key="key">
          <q-card>
            <q-card-section>
              <div class="text-subtitle2 text-grey">{{ formatStatisticTitle(key) }}</div>
              <div class="text-h6">{{ value }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Action Required Section -->
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-12 col-md-6">
          <q-card>
            <q-card-section>
              <div class="text-h6">Perlu Tindakan Segera</div>
            </q-card-section>
            <q-list bordered separator>
              <q-item-label header>Tugas Perlu Dinilai</q-item-label>
              <q-item v-for="(item, index) in action_required.assignments_needing_grading" :key="index">
                <q-item-section>
                  <q-item-label>{{ item.title }}</q-item-label>
                  <q-item-label caption>{{ item.course_name }} - {{ item.module_name }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-if="!action_required.assignments_needing_grading.length">
                <q-item-section class="text-grey">Tidak ada tugas yang perlu dinilai.</q-item-section>
              </q-item>

              <q-item-label header>Pertanyaan Forum Baru</q-item-label>
              <q-item v-for="(item, index) in action_required.new_forum_questions" :key="index">
                <q-item-section>
                  <q-item-label>{{ item.thread_title }}</q-item-label>
                  <q-item-label caption>{{ item.course_name }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-if="!action_required.new_forum_questions.length">
                <q-item-section class="text-grey">Tidak ada pertanyaan baru di forum.</q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>

        <!-- Quick Links Section -->
        <div class="col-12 col-md-6">
          <q-card>
            <q-card-section>
              <div class="text-h6">Tautan Cepat</div>
            </q-card-section>
            <q-card-section class="q-gutter-sm">
              <q-btn v-for="link in quick_links" :key="link.name" :to="mapQuickLinkToRoute(link.url)" color="primary" :label="link.name" />
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Class Activity Summary Section -->
      <q-card>
        <q-card-section>
          <div class="text-h6">Ringkasan Aktivitas Kelas</div>
        </q-card-section>
        <q-table :rows="class_activity_summary" :columns="classActivityColumns" row-key="course_id">
          <template v-slot:body-cell-average_progress="props">
            <q-td :props="props">
              <q-linear-progress :value="parseFloat(props.row.average_progress) / 100" size="25px" stripe rounded>
                <div class="absolute-full flex flex-center">
                  <q-badge color="white" text-color="black" :label="props.row.average_progress" />
                </div>
              </q-linear-progress>
            </q-td>
          </template>
        </q-table>
      </q-card>

    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useTrainerDashboardStore } from 'src/stores/trainer-dashboard';
import { storeToRefs } from 'pinia';

const store = useTrainerDashboardStore();
const { statistics, action_required, class_activity_summary, quick_links, loading, error } = storeToRefs(store);
const { fetchDashboardData } = store;

const classActivityColumns = [
  { name: 'course_name', required: true, label: 'Nama Kelas', align: 'left', field: 'course_name', sortable: true },
  { name: 'student_count', label: 'Jumlah Siswa', align: 'center', field: 'student_count', sortable: true },
  { name: 'average_progress', label: 'Rata-rata Progres', align: 'left', field: 'average_progress', sortable: true },
];

const formatStatisticTitle = (key: string) => {
  const titles: Record<string, string> = {
    total_active_classes: 'Kelas Aktif',
    total_students: 'Total Siswa',
    assignments_to_grade_count: 'Tugas Perlu Dinilai',
    unread_forum_posts_count: 'Forum Belum Dibaca',
  };
  return titles[key] || key.replace(/_/g, ' ').toUpperCase();
};

const mapQuickLinkToRoute = (url: string) => {
  switch (url) {
    case '/trainer/my-classes':
      return { name: 'TrainerCourses' };
    case '/trainer/forums':
      return { name: 'TrainerForum' };
    case '/trainer/student-grades':
      return { name: 'TrainerEnrollments' };
    default:
      return { path: url }; // Fallback to path if no named route is found
  }
};

onMounted(() => {
  fetchDashboardData();
});

</script>
