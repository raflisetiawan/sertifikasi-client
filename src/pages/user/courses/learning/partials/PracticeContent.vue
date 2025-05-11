<template>
  <div class="practice-content">
    <!-- Practice Info Section -->
    <div class="text-center" v-if="!started">
      <div class="text-h6 q-mb-md">{{ content.title }}</div>
      <div class="text-subtitle1 q-mb-md">
        Time Limit: {{ content.time_limit_minutes }} minutes
      </div>
      <!-- Previous Score Display -->
      <div v-if="isCompleted" class="q-mb-md">
        <q-badge color="primary">
          Previous Score: {{ content.progress?.score }}%
        </q-badge>
      </div>
      <div class="text-subtitle2 q-mb-lg" v-if="content.description">
        {{ content.description }}
      </div>
      <q-btn color="primary" label="Start Practice" @click="startPractice" />
    </div>

    <!-- Questions Section -->
    <div v-else class="practice-container">
      <div v-for="(question, qIndex) in questions" :key="qIndex" class="q-mb-lg">
        <div class="text-subtitle1 q-mb-md">
          {{ qIndex + 1 }}. {{ question.question }}
        </div>

        <!-- Multiple Choice -->
        <template v-if="question.type === 'multiple_choice'">
          <q-option-group v-model="answers[qIndex]"
            :options="question.options?.map(opt => ({ label: opt, value: opt })) || []" type="radio" />
        </template>

        <!-- True/False -->
        <template v-if="question.type === 'true_false'">
          <q-option-group v-model="answers[qIndex]" :options="[
            { label: 'True', value: 'true' },
            { label: 'False', value: 'false' }
          ]" type="radio" />
        </template>

        <!-- Short Answer -->
        <template v-if="question.type === 'short_answer'">
          <q-input v-model="answers[qIndex]" outlined label="Your Answer" />
        </template>
      </div>


      <!-- Submit Button -->
      <div class="row justify-end q-mt-lg">
        <q-btn color="primary" label="Submit Practice" :loading="submitting" @click="submitPractice" />
      </div>
    </div>

    <!-- Results Dialog -->
    <q-dialog v-model="showResults">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Practice Results</div>
          <div class="text-h5 text-primary q-mt-md">
            Score: {{ results?.score }}%
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div v-for="(feedback, index) in results?.feedback" :key="index" class="q-mb-md">
            <div class="text-subtitle2">Question {{ index + 1 }}</div>
            <q-chip :color="feedback.is_correct ? 'positive' : 'negative'" text-color="white" class="q-mb-sm">
              {{ feedback.is_correct ? 'Correct' : 'Incorrect' }}
            </q-chip>
            <div class="text-body2 q-mb-sm">
              Correct Answer: {{ feedback.correct_answer }}
            </div>
            <div class="text-caption">{{ feedback.explanation }}</div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { qCookies } from 'src/boot/cookies';
import { useRoute } from 'vue-router';
import { PracticeContent, PracticeQuestion, PracticeResult, PracticeAnswer } from 'src/models/practice';

const props = defineProps<{
  content: PracticeContent;
  contentId: number;
  isCompleted?: boolean;
}>();
const questionIds = ref<number[]>([]);
const emit = defineEmits<{
  (e: 'submit-success'): void;
}>();

const $q = useQuasar();
const route = useRoute();
const started = ref(false);
const submitting = ref(false);
const questions = ref<PracticeQuestion[]>([]);
const answers = ref<string[]>([]);
const showResults = ref(false);
const results = ref<PracticeResult | null>(null);

const startPractice = async () => {
  try {
    const response = await api.get(
      `/enrollments/${route.params.enrollmentId}/modules/${route.params.moduleId}/contents/${props.contentId}/start-practice`,
      {
        headers: {
          Authorization: `Bearer ${qCookies.get('token')}`
        }
      }
    );

    if (response.data.success) {
      questions.value = response.data.data.questions;
      // Store question IDs
      questionIds.value = questions.value.map((q, index) => q.id || index + 1);
      answers.value = new Array(response.data.data.questions.length).fill('');
      started.value = true;
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to start practice'
    });
  }
};


const submitPractice = async () => {
  if (submitting.value) return;

  // Validate all questions are answered
  if (answers.value.some(answer => answer === '')) {
    $q.notify({
      type: 'negative',
      message: 'Please answer all questions'
    });
    return;
  }

  try {
    submitting.value = true;

    // Format answers according to backend requirements
    const formattedAnswers: PracticeAnswer[] = answers.value.map((answer, index) => ({
      question_id: questionIds.value[index],
      answer: questions.value[index].type === 'true_false'
        ? answer === 'true'
        : answer
    }));

    const response = await api.post(
      `/enrollments/${route.params.enrollmentId}/modules/${route.params.moduleId}/contents/${props.contentId}/submit-practice`,
      {
        answers: formattedAnswers
      },
      {
        headers: {
          Authorization: `Bearer ${qCookies.get('token')}`
        }
      }
    );

    if (response.data.success) {
      results.value = response.data.data;
      showResults.value = true;
      emit('submit-success');
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to submit practice'
    });
  } finally {
    submitting.value = false;
  }
};
</script>

<style lang="scss" scoped>
.practice-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;

  .practice-container {
    .q-option-group {
      margin-left: 20px;
    }
  }
}
</style>
