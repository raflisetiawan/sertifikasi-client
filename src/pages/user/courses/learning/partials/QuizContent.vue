<template>
  <div class="quiz-content text-center">
    <!-- Quiz Info -->
    <div class="text-subtitle1 q-mb-md">
      Batas Waktu: {{ content.time_limit_minutes }} menit
    </div>
    <div class="text-subtitle1 q-mb-md">
      Skor Kelulusan: {{ content.passing_score }}%
    </div>
    <div class="text-subtitle1 q-mb-lg">
      Percobaan Maksimal: {{ content.max_attempts }}
    </div>

    <!-- Start Button -->
    <q-btn color="primary" label="Mulai Kuis" :disable="isCompleted" @click="onStartQuiz" />

    <!-- Quiz Status -->
    <div v-if="isCompleted" class="status-section q-mt-lg">
      <q-chip color="positive" text-color="white">
        Selesai
      </q-chip>
      <div class="text-subtitle1 q-mt-sm">
        Skor Anda: {{ quizModuleData.progress?.score !== null ? quizModuleData.progress?.score + '%' : 'Belum Tersedia'
        }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BaseContent, QuizContent } from 'src/models/module-learning';

const props = defineProps<{
  content: QuizContent;
  contentId: number;
  isCompleted?: boolean;
  quizModuleData: BaseContent;
}>();

const emit = defineEmits<{
  (e: 'start-quiz', contentId: number): void;
}>();

const onStartQuiz = () => {
  emit('start-quiz', props.contentId);
};
</script>

<style lang="scss" scoped>
.quiz-content {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;

  .status-section {
    border-top: 1px solid rgba(0, 0, 0, 0.12);
    padding-top: 20px;
  }
}
</style>
