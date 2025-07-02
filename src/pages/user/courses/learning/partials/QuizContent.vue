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
    <q-btn
      v-if="!isQuizCompleted || canRetakeQuiz"
      color="primary"
      :label="isQuizCompleted ? 'Ulangi Kuis' : 'Mulai Kuis'"
      @click="onStartQuiz"
    />

    <!-- Quiz Status -->
    <div v-if="isQuizCompleted" class="status-section q-mt-lg">
      <q-chip :color="hasPassedQuiz ? 'positive' : 'negative'" text-color="white">
        {{ hasPassedQuiz ? 'Lulus' : 'Tidak Lulus' }}
      </q-chip>
      <div class="text-subtitle1 q-mt-sm">
        Skor Anda: {{ quizModuleData.progress?.score !== null ? quizModuleData.progress?.score + '%' : 'Belum Tersedia'
        }}
      </div>
      <div v-if="!hasPassedQuiz && !canRetakeQuiz" class="text-negative q-mt-sm">
        Anda telah mencapai batas maksimal percobaan.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { BaseContent, QuizContent } from 'src/models/module-learning';

const props = defineProps<{
  content: QuizContent;
  contentId: number;
  quizModuleData: BaseContent;
}>();

const emit = defineEmits<{
  (e: 'start-quiz', contentId: number): void;
}>();

const isQuizCompleted = computed(() => {
  return props.quizModuleData.progress?.status === 'completed';
});

const hasPassedQuiz = computed(() => {
  return isQuizCompleted.value && (props.quizModuleData.progress?.score ?? 0) >= props.content.passing_score;
});

const canRetakeQuiz = computed(() => {
  return isQuizCompleted.value && !hasPassedQuiz.value && (props.quizModuleData.content.attempts ?? 0) < props.content.max_attempts;
});

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
