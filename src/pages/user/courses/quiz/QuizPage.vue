<template>
  <q-page padding>
    <div v-if="loading || !quizData" class="full-width row justify-center items-center" style="height: 400px;">
      <q-spinner color="primary" size="3em" />
    </div>

    <template v-else>
      <q-card class="quiz-container">
        <q-card-section>
          <div class="text-h5">{{ quizData?.title }}</div>
          <div class="text-subtitle2">{{ quizData?.description }}</div>

          <!-- Quiz Info Banner -->
          <q-banner class="bg-blue-1 q-mt-md">
            <template v-slot:avatar>
              <q-icon name="info" color="primary" />
            </template>
            <div class="text-body2">
              Time Limit: {{ quizData?.time_limit_minutes }} minutes<br>
              Passing Score: {{ quizData?.passing_score }}%<br>
              Attempts Left: {{ quizData?.attempts_left }}
            </div>
          </q-banner>

          <!-- Timer -->
          <q-banner class="bg-orange-1 q-mt-md">
            <template v-slot:avatar>
              <q-icon name="timer" color="orange" />
            </template>
            <div class="text-subtitle1">
              Time Remaining: {{ formatTime(timeRemaining) }}
            </div>
          </q-banner>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
            <!-- Questions -->
            <div v-for="(question, index) in quizData.questions" :key="index" class="q-mb-lg">
              <div class="text-subtitle1 q-mb-sm">
                {{ index + 1 }}. {{ question.question }}
                <q-badge color="primary" class="q-ml-sm">
                  {{ question.score }} points
                </q-badge>
              </div>

              <!-- Multiple Choice -->
              <template v-if="question.type === 'multiple_choice'">
                <q-radio v-for="option in question.options" :key="option" v-model="answers[index]" :val="option"
                  :label="option" class="q-mb-sm" />
              </template>
            </div>

            <div class="row justify-between q-mt-lg">
              <q-btn label="Back to Module" flat color="primary" @click="confirmExit" />
              <q-btn type="submit" label="Submit Quiz" color="primary" :loading="submitting"
                :disable="!isAllAnswered" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </template>

    <!-- Confirm Exit Dialog -->
    <q-dialog v-model="showExitDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="warning" text-color="white" />
          <span class="q-ml-sm">Are you sure you want to exit? Your progress will be lost.</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Exit Quiz" color="negative" @click="backToModule" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showTimeUpDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="timer_off" color="negative" text-color="white" />
          <span class="q-ml-sm">Time's up! Your quiz is being submitted automatically.</span>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Max Attempts Dialog -->
    <q-dialog v-model="showMaxAttemptsDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="block" color="negative" text-color="white" />
          <span class="q-ml-sm">You have reached the maximum number of attempts for this quiz.</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Back to Module" color="primary" @click="backToModule" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { qCookies } from 'src/boot/cookies';
import type { QuizAnswer, QuizSubmission, QuizResult, QuizData } from 'src/models/quiz';
import { AxiosError } from 'axios';
import { useQuizTimer } from 'src/composables/useQuizTimer';
import { useUserStore } from 'src/stores/user';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const loading = ref(true);
const submitting = ref(false);
const showMaxAttemptsDialog = ref(false);
const quizData = ref<QuizData | null>(null);
const answers = ref<Record<number, string>>({});
const showExitDialog = ref(false);
const showTimeUpDialog = ref(false);

const { timeRemaining, start, clearTimer, formatTime } = useQuizTimer(() => {
  showTimeUpDialog.value = true;
  setTimeout(() => {
    showTimeUpDialog.value = false;
    submitQuiz(true);
  }, 2000);
});

const isAllAnswered = computed(() => {
  if (!quizData.value) return false;
  return quizData.value.questions.every((_, index) => answers.value[index] !== undefined);
});

const confirmExit = () => {
  showExitDialog.value = true;
};

const fetchQuizData = async () => {
  try {
    const { enrollmentId, moduleId, contentId } = route.params;
    const response = await api.get<{ success: boolean; data: QuizData }>(
      `/enrollments/${enrollmentId}/modules/${moduleId}/contents/${contentId}/start-quiz`,
      {
        headers: { Authorization: `Bearer ${qCookies.get('token')}` }
      }
    );

    if (response.data.success) {
      quizData.value = response.data.data;
      if (quizData.value) {
        const userId = userStore.id ?? 0;
        const quizId = Number(route.params.contentId);
        start(userId, quizId, quizData.value.time_limit_minutes);
      }
    }
  } catch (error) {
    console.error('Error fetching quiz data:', error);
    if (error instanceof AxiosError) {
      if (error.response?.status === 403) {
        showMaxAttemptsDialog.value = true;
      } else {
        $q.notify({
          type: 'negative',
          message: 'Failed to load quiz'
        });
        backToModule();
      }
    }
  } finally {
    loading.value = false;
  }
};

const handleSubmit = (evt: Event) => {
  evt.preventDefault();
  submitQuiz(false);
};

const submitQuiz = async (isAutoSubmit = false) => {
  if (submitting.value || (!isAutoSubmit && !isAllAnswered.value)) return;

  submitting.value = true;

  try {
    // Clear timer before submitting
    clearTimer();

    // Format answers - use index as question_id if question doesn't have id
    const formattedAnswers: QuizAnswer[] = Object.entries(answers.value).map(([index, answer]) => ({
      question_id: quizData.value?.questions[Number(index)].id ?? Number(index),
      answer: answer
    }));

    const submission: QuizSubmission = {
      answers: formattedAnswers,
      time_spent_seconds: (quizData.value?.time_limit_minutes ?? 0) * 60 - timeRemaining.value
    };

    const { enrollmentId, moduleId, contentId, courseId } = route.params;
    const response = await api.post<{ success: boolean; data: QuizResult }>(
      `/enrollments/${enrollmentId}/modules/${moduleId}/contents/${contentId}/submit-quiz`,
      submission,
      { headers: { Authorization: `Bearer ${qCookies.get('token')}` } }
    );

    if (response.data.success) {
      router.push({
        path: `/quiz-result/${courseId}/${enrollmentId}/${moduleId}/${contentId}`,
        query: {
          result: JSON.stringify(response.data.data)
        }
      });
    }
  } catch (error) {
    console.error('Error submitting quiz:', error);
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.status === 403 && error.response?.data?.message === 'Time limit exceeded'
        ? 'Time limit exceeded. Quiz auto-submitted.'
        : 'Failed to submit quiz';

      $q.notify({
        type: 'negative',
        message: errorMessage
      });

      if (error.response?.status === 403) {
        backToModule();
      }
    }
  } finally {
    submitting.value = false;
  }
};

const backToModule = () => {
  clearTimer();
  const { enrollmentId, moduleId, courseId } = route.params;
  router.push({ name: 'dashboard.courses.module.learn', params: { courseId, moduleId, enrollmentId } });
};

onMounted(() => {
  fetchQuizData();
});

onBeforeUnmount(() => {
  clearTimer();
});
</script>

<style scoped>
.quiz-container {
  max-width: 800px;
  margin: 0 auto;
}
</style>
