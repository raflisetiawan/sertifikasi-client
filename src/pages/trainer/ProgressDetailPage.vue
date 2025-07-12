<template>
  <q-page padding>
    <div v-if="selectedEnrollmentProgress">
      <div class="text-h4 q-mb-md">Progres Siswa: {{ selectedEnrollmentProgress.user.name }}</div>
      <div class="text-subtitle1 q-mb-lg">Email: {{ selectedEnrollmentProgress.user.email }}</div>

      <q-list bordered separator class="q-mt-lg">
        <q-item-label header>Progres Modul</q-item-label>
        <q-item v-for="moduleProgress in selectedEnrollmentProgress.module_progresses" :key="moduleProgress.id">
          <q-item-section>
            <q-item-label>{{ moduleProgress.module.title }}</q-item-label>
            <q-item-label caption>Status: {{ moduleProgress.status }} - {{ moduleProgress.progress_percentage }}%</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-badge :color="moduleProgress.status === 'completed' ? 'positive' : 'info'">{{ moduleProgress.status }}</q-badge>
          </q-item-section>
        </q-item>
      </q-list>

      <q-list bordered separator class="q-mt-lg">
        <q-item-label header>Progres Konten</q-item-label>
        <q-item v-for="contentProgress in selectedEnrollmentProgress.content_progresses" :key="contentProgress.id">
          <q-item-section>
            <q-item-label>{{ contentProgress.module_content.title }}</q-item-label>
            <q-item-label caption>Status: {{ contentProgress.status }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-badge :color="contentProgress.status === 'completed' ? 'positive' : 'info'">{{ contentProgress.status }}</q-badge>
            <q-btn
              v-if="contentProgress.module_content.content_type === 'assignment'"
              flat
              dense
              icon="edit"
              color="primary"
              :to="{ name: 'TrainerAssignmentSubmission', params: { enrollmentId: selectedEnrollmentProgress.id, moduleContentId: contentProgress.module_content_id } }"
            >
              Nilai
            </q-btn>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <div v-else>
      <q-spinner-dots size="lg" color="primary" />
      <p>Memuat progres siswa...</p>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTrainerCourseStore } from 'src/stores/trainerCourse';
import { useMetaTitle } from 'src/composables/meta';
import { storeToRefs } from 'pinia';

useMetaTitle('Progres Siswa - Trainer');

const route = useRoute();
const trainerCourseStore = useTrainerCourseStore();

const { selectedEnrollmentProgress } = storeToRefs(trainerCourseStore);

onMounted(async () => {
  const enrollmentId = parseInt(route.params.enrollmentId as string);
  if (!isNaN(enrollmentId)) {
    await trainerCourseStore.getEnrollmentProgress(enrollmentId);
  }
});
</script>
