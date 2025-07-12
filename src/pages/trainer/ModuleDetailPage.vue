<template>
  <q-page padding>
    <div v-if="isLoading" class="text-center">
      <q-spinner-dots color="primary" size="40px" />
      <p>Memuat detail modul...</p>
    </div>

    <div v-else-if="getError" class="text-center text-negative">
      <q-icon name="error" size="md" />
      <p>{{ getError }}</p>
      <q-btn @click="fetchModuleDetail(moduleId)" label="Coba Lagi" color="primary" />
    </div>

    <div v-else-if="getModule">
      <div class="text-h4 q-mb-md">{{ getModule.title }}</div>
      <div class="text-subtitle1 text-grey-8 q-mb-md">Dari Kursus: {{ getModule.course_name }}</div>
      <p>{{ getModule.description }}</p>

      <q-separator class="q-my-md" />

      <div class="text-h5 q-mb-md">Daftar Konten</div>
      <q-list bordered separator>
        <q-item v-for="content in getModule.contents" :key="content.id">
          <q-item-section>
            <q-item-label>{{ content.order }}. {{ content.title }}</q-item-label>
            <q-item-label caption class="text-capitalize">Tipe: {{ content.type }}</q-item-label>

            <div v-if="content.type === 'video'">
              <q-item-label caption>Durasi: {{ content.duration_minutes }} menit</q-item-label>
              <q-item-label caption>URL: <a :href="content.url" target="_blank">{{ content.url }}</a></q-item-label>
            </div>
            <div v-else-if="content.type === 'text'">
              <q-item-label caption>Konten Teks (HTML/Markdown)</q-item-label>
              <!-- Anda bisa menggunakan v-html untuk merender content.content_html jika aman -->
            </div>
            <div v-else-if="content.type === 'quiz'">
              <q-item-label caption>Jumlah Pertanyaan: {{ content.question_count }}</q-item-label>
              <div v-if="content.trainer_stats">
                <q-item-label caption>Total Percobaan: {{ content.trainer_stats.total_attempts }}</q-item-label>
                <q-item-label caption>Skor Rata-rata: {{ content.trainer_stats.average_score }}</q-item-label>
                <q-item-label caption>Perlu Review Manual: {{ content.trainer_stats.needs_review_count }}</q-item-label>
              </div>
            </div>
            <div v-else-if="content.type === 'assignment'">
              <q-item-label caption>Deskripsi: {{ content.description }}</q-item-label>
              <div v-if="content.trainer_stats">
                <q-item-label caption>Total Submission: {{ content.trainer_stats.total_submissions }}</q-item-label>
                <q-item-label caption>Menunggu Penilaian: {{ content.trainer_stats.pending_grading_count }}</q-item-label>
                <q-item-label caption>Sudah Dinilai: {{ content.trainer_stats.graded_count }}</q-item-label>
              </div>
            </div>
            <div v-else-if="content.type === 'file'">
              <q-item-label caption>Nama File: {{ content.file_name }}</q-item-label>
              <q-item-label caption>URL: <a :href="content.file_url" target="_blank">{{ content.file_url }}</a></q-item-label>
            </div>
            <div v-else-if="content.type === 'practice'">
              <q-item-label caption>Latihan Interaktif</q-item-label>
              <!-- Tambahkan detail spesifik untuk practice jika ada -->
            </div>
          </q-item-section>
        </q-item>
        <q-item v-if="!getModule.contents.length">
          <q-item-section class="text-grey">Tidak ada konten dalam modul ini.</q-item-section>
        </q-item>
      </q-list>
    </div>

    <div v-else class="text-center">
      <p>Modul tidak ditemukan.</p>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTrainerModuleStore } from 'src/stores/trainer-module';
import { storeToRefs } from 'pinia';

const route = useRoute();
const store = useTrainerModuleStore();
const { getModule, isLoading, getError } = storeToRefs(store);
const { fetchModuleDetail } = store;

const moduleId = parseInt(route.params.moduleId as string);

onMounted(() => {
  if (moduleId) {
    fetchModuleDetail(moduleId);
  }
});
</script>
