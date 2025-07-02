<template>
  <q-page padding>
    <q-card class="result-container">
      <q-card-section>
        <div class="text-center">
          <q-avatar size="80px" :color="quizResult.passed ? 'positive' : 'negative'" text-color="white">
            <q-icon :name="quizResult.passed ? 'check' : 'close'" size="48px" />
          </q-avatar>

          <div class="text-h4 q-mt-md">
            {{ quizResult.passed ? 'Kuis Lulus!' : 'Kuis Gagal' }}
          </div>

          <div class="text-h6 q-mt-sm">
            Skor Anda: {{ quizResult.score }}%
          </div>

          <div class="text-subtitle1">
            Skor Kelulusan: {{ quizResult.passing_score }}%
          </div>

          <div class="text-caption q-mt-sm" v-if="quizResult.attempts_left > 0">
            Sisa Percobaan: {{ quizResult.attempts_left }}
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <!-- Feedback Section -->
      <q-card-section>
        <div class="text-h6">Tinjauan Pertanyaan</div>
        <div v-for="feedback in quizResult.feedback" :key="feedback.question_id" class="q-my-md">
          <div class="row items-center q-mb-sm">
            <q-icon :name="feedback.correct ? 'check_circle' : 'cancel'"
              :color="feedback.correct ? 'positive' : 'negative'" size="24px" class="q-mr-sm" />
            <div class="text-subtitle1">Pertanyaan {{ feedback.question_id }}</div>
          </div>

          <div v-if="!feedback.correct && feedback.explanation" class="text-body2 q-ml-lg text-negative">
            Penjelasan: {{ feedback.explanation }}
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="center" class="q-pa-md">
        <q-btn v-if="quizResult.attempts_left > 0 && !quizResult.passed" color="primary" label="Coba Lagi Kuis"
          @click="retryQuiz" class="q-mr-sm" />
        <q-btn color="primary" label="Kembali ke Modul" @click="backToModule" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import type { QuizResult } from 'src/models/quiz';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();

const quizResult = ref<QuizResult>({
  score: 0,
  passing_score: 0,
  passed: false,
  attempts_left: 0,
  feedback: []
});

onMounted(() => {
  try {
    const resultString = route.query.result as string;
    if (resultString) {
      quizResult.value = JSON.parse(resultString);
    } else {
      throw new Error('No quiz result found');
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to load quiz results'
    });
    backToModule();
  }
});

const retryQuiz = () => {
  const { enrollmentId, moduleId, contentId } = route.params;
  router.push(`/quiz/${enrollmentId}/${moduleId}/${contentId}`);
};

const backToModule = () => {
  const { enrollmentId, moduleId, courseId } = route.params;
  router.push({ name: 'dashboard.courses.module.learn', params: { courseId, moduleId, enrollmentId } });
};
</script>

<style scoped>
.result-container {
  max-width: 800px;
  margin: 0 auto;
}

.feedback-item {
  border-left: 4px solid;
  padding-left: 16px;
  margin: 16px 0;
}

.feedback-item.correct {
  border-color: var(--q-positive);
}

.feedback-item.incorrect {
  border-color: var(--q-negative);
}
</style>
