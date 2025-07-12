<template>
  <q-page padding>
    <div v-if="assignmentSubmission">
      <div class="text-h4 q-mb-md">Detail Submisi Penugasan</div>
      <div class="text-subtitle1 q-mb-lg">Status: <q-badge :color="statusColor(assignmentSubmission.status)"
          :label="assignmentSubmission.status" />
      </div>

      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-h6">Detail Submisi</div>
          <div v-if="assignmentSubmission.submission_details">
            <p><strong>File Asli:</strong> {{ assignmentSubmission.submission_details.original_filename }}</p>
            <p><strong>Waktu Submisi:</strong> {{ new Date(assignmentSubmission.submission_details.submitted_at).toLocaleString()
              }}</p>
            <p><strong>File:</strong>
              <a :href="`${storageBaseUrl}/${assignmentSubmission.submission_details.file_path}`" target="_blank"
                rel="noopener noreferrer" class="text-primary" style="text-decoration: none;">
                Unduh File
                <q-icon name="download" />
              </a>
            </p>
          </div>
          <div v-else>
            <p>Belum ada submisi.</p>
          </div>
        </q-card-section>
      </q-card>

      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-h6">Nilai dan Umpan Balik</div>
          <q-form @submit.prevent="onSubmitGrade">
            <q-input v-model.number="score" type="number" label="Nilai (0-100)"
              :rules="[val => (val >= 0 && val <= 100) || 'Nilai harus antara 0 dan 100']" lazy-rules />
            <q-input v-model="feedback" type="textarea" label="Umpan Balik (Opsional)" autogrow />
            <q-btn type="submit" label="Berikan Nilai" color="primary" class="q-mt-md" :loading="isSubmitting" />
          </q-form>
        </q-card-section>
      </q-card>

      <q-card v-if="assignmentSubmission.score !== null || assignmentSubmission.feedback !== null">
        <q-card-section>
          <div class="text-h6">Hasil Penilaian</div>
          <p v-if="assignmentSubmission.score !== null"><strong>Nilai:</strong> {{ assignmentSubmission.score }}</p>
          <p v-if="assignmentSubmission.feedback !== null"><strong>Umpan Balik:</strong> {{ assignmentSubmission.feedback
            }}</p>
        </q-card-section>
      </q-card>
    </div>
    <div v-else class="flex flex-center" style="height: 80vh">
      <q-spinner-dots size="lg" color="primary" />
      <p class="q-ml-md">Memuat submisi penugasan...</p>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTrainerCourseStore } from 'src/stores/trainerCourse';
import { useMetaTitle } from 'src/composables/meta';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import config from 'src/config/env.config';

useMetaTitle('Penilaian Penugasan - Trainer');

const route = useRoute();
const trainerCourseStore = useTrainerCourseStore();
const $q = useQuasar();

const { assignmentSubmission } = storeToRefs(trainerCourseStore);
const storageBaseUrl = config.storageBaseUrl;

const score = ref<number | null>(null);
const feedback = ref<string | null>(null);
const isSubmitting = ref(false);


const statusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'green';
    case 'in_progress':
      return 'orange';
    case 'not_started':
      return 'grey';
    case 'failed':
      return 'red';
    default:
      return 'primary';
  }
};

onMounted(async () => {
  const enrollmentId = parseInt(route.params.enrollmentId as string);
  const moduleContentId = parseInt(route.params.moduleContentId as string);
  if (!isNaN(enrollmentId) && !isNaN(moduleContentId)) {
    await trainerCourseStore.getAssignmentSubmission(enrollmentId, moduleContentId);
    if (assignmentSubmission.value) {
      score.value = assignmentSubmission.value.score || null;
      feedback.value = assignmentSubmission.value.feedback || null;
    }
  }
});

const onSubmitGrade = async () => {
  const enrollmentId = parseInt(route.params.enrollmentId as string);
  const moduleContentId = parseInt(route.params.moduleContentId as string);

  if (isNaN(enrollmentId) || isNaN(moduleContentId) || score.value === null) {
    $q.notify({
      type: 'negative',
      message: 'Nilai tidak boleh kosong.',
    });
    return;
  }

  isSubmitting.value = true;
  try {
    await trainerCourseStore.gradeAssignment(enrollmentId, moduleContentId, score.value, feedback.value || undefined);
    $q.notify({
      type: 'positive',
      message: 'Penugasan berhasil dinilai.',
    });
  } catch (error) {
    console.error(error);
    $q.notify({
      type: 'negative',
      message: 'Gagal menilai penugasan.',
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>