<template>
  <div class="quiz-content text-center">
    <!-- Quiz Info -->
    <div class="text-subtitle1 q-mb-md">
      Time Limit: {{ content.time_limit_minutes }} minutes
    </div>
    <div class="text-subtitle1 q-mb-md">
      Passing Score: {{ content.passing_score }}%
    </div>
    <div class="text-subtitle1 q-mb-lg">
      Maximum Attempts: {{ content.max_attempts }}
    </div>

    <!-- Start Button -->
    <q-btn color="primary" label="Start Quiz" :disable="isCompleted" @click="onStartQuiz" />

    <!-- Quiz Status -->
    <div v-if="isCompleted" class="status-section q-mt-lg">
      <q-chip color="positive" text-color="white">
        Completed
      </q-chip>
      <div class="text-subtitle1 q-mt-sm">
        Your Score: {{ content.progress?.score }}%
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QuizContent } from 'src/models/module-learning';

const props = defineProps<{
  content: QuizContent;
  contentId: number;
  isCompleted?: boolean;
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
