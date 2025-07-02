<template>
  <div class="module-learning q-pa-md">
    <div class="row q-col-gutter-md">
      <!-- Content Area -->
      <div class="col-12 col-md-9">
        <q-card>
          <q-card-section>
            <div class="text-h5">{{ moduleData?.module.title }}</div>
            <div class="text-subtitle2">{{ moduleData?.module.subtitle }}</div>
          </q-card-section>

          <div :style="{ opacity: loading ? 0.5 : 1 }" class="q-pa-md">
            <template v-for="(content, index) in moduleData?.contents" :key="content.id">
              <div v-if="step === index + 1">
                <!-- Content Display -->
                <div class="content-container q-pa-md">
                  <!-- Video Content -->
                  <VideoContentPartial v-if="content.type === 'video' && isVideoContent(content.content)"
                    :content="content.content" />

                  <!-- Text Content -->
                  <TextContentPartial v-else-if="content.type === 'text' && isTextContent(content.content)"
                    :content="content.content" />

                  <!-- Quiz Content -->
                  <QuizContentPartial v-else-if="content.type === 'quiz' && isQuizContent(content.content)"
                    :content="content.content" :content-id="content.id" :quizModuleData="content"
                    :is-completed="content.progress?.status === 'completed'" @start-quiz="startQuiz" />

                  <!-- Assignment Content -->
                  <AssignmentContentPartial
                    v-else-if="content.type === 'assignment' && isAssignmentContent(content.content)"
                    :content="content.content" :content-id="content.id"
                    @submit-success="updateContentProgress(content.id)" />

                  <!-- Practice Content -->
                  <PracticeContentPartial v-else-if="content.type === 'practice' && isPracticeContent(content.content)"
                    :content="content.content" :content-id="content.id"
                    :is-completed="content.progress?.status === 'completed'"
                    @submit-success="updateContentProgress(content.id)" />

                  <!-- File Content -->
                  <FileContentPartial v-else-if="content.type === 'file' && isFileContent(content.content)"
                    :content="content.content" :title="content.title" />
                </div>

                <!-- Navigation -->
                <div class="row justify-between q-mt-md">
                  <q-btn v-if="step > 1" flat color="primary" label="Sebelumnya" @click="prevStep" />
                  <q-space />
                  <template v-if="moduleData?.progress.status !== 'completed'">
                    <q-btn :loading="progressLoading" color="primary" :label="isLastContent ? 'Selesai' : 'Lanjut'"
                      @click="nextStep(content)" :disable="isLastContent && !allRequiredCompleted" />
                  </template>
                </div>
                <div v-if="isLastContent && !allRequiredCompleted" class="text-caption text-negative q-mt-sm">
                  Selesaikan semua konten yang wajib untuk menyelesaikan modul ini.
                </div>
              </div>
            </template>
          </div>

          <q-inner-loading :showing="loading">
            <q-spinner-dots size="50px" color="primary" />
          </q-inner-loading>
        </q-card>
      </div>

      <!-- Progress Sidebar -->
      <div class="col-12 col-md-3">
        <ProgressSidebar :contents="moduleData?.contents || []" :current-step="step"
          :is-module-completed="isModuleCompleted" @step-change="handleStepChange" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import type { ModuleLearning, VideoContent, TextContent, QuizContent, AssignmentContent, FileContent, BaseContent, ProgressResponse } from 'src/models/module-learning';
import { qCookies } from 'src/boot/cookies';
import { PracticeContent } from 'src/models/practice';
import VideoContentPartial from './partials/VideoContent.vue';
import TextContentPartial from './partials/TextContent.vue';
import QuizContentPartial from './partials/QuizContent.vue';
import AssignmentContentPartial from './partials/AssignmentContent.vue';
import PracticeContentPartial from './partials/PracticeContent.vue';
import FileContentPartial from './partials/FileContent.vue';
import ProgressSidebar from './partials/ProgressSidebar.vue';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const step = ref<number>(1);
const maxStep = computed(() => moduleData.value?.contents?.length ?? 1);
const moduleData = ref<ModuleLearning | null>(null);
const loading = ref<boolean>(false);
const progressLoading = ref<boolean>(false);

const getStepStorageKey = (enrollmentId: string, moduleId: string): string => {
  return `module_step_${enrollmentId}_${moduleId}`;
};

const saveStep = (step: number, enrollmentId: string, moduleId: string): void => {
  localStorage.setItem(getStepStorageKey(enrollmentId, moduleId), step.toString());
};

const loadStep = (enrollmentId: string, moduleId: string): number => {
  const savedStep = localStorage.getItem(getStepStorageKey(enrollmentId, moduleId));
  return savedStep ? parseInt(savedStep) : 1;
};

const isVideoContent = (content: VideoContent | TextContent | QuizContent | AssignmentContent | FileContent | PracticeContent): content is VideoContent => {
  return 'video_url' in content;
};

const isTextContent = (content: VideoContent | TextContent | QuizContent | AssignmentContent | FileContent | PracticeContent): content is TextContent => {
  return 'format' in content && 'content' in content;
};

const isQuizContent = (content: VideoContent | TextContent | QuizContent | AssignmentContent | FileContent | PracticeContent): content is QuizContent => {
  return 'time_limit_minutes' in content;
};

const isAssignmentContent = (content: VideoContent | TextContent | QuizContent | AssignmentContent | FileContent | PracticeContent): content is AssignmentContent => {
  return 'instructions' in content;
};

const isPracticeContent = (content: VideoContent | TextContent | QuizContent | AssignmentContent | FileContent | PracticeContent): content is PracticeContent => {
  return 'questions' in content && Array.isArray(content.questions);
};

const isFileContent = (content: VideoContent | TextContent | QuizContent | AssignmentContent | FileContent | PracticeContent): content is FileContent => {
  return 'file_url' in content;
};

const isLastContent = computed(() => {
  return step.value === maxStep.value;
});

const allRequiredCompleted = computed(() => {
  if (!moduleData.value?.contents) return false;
  return moduleData.value.contents
    .filter(c => c.is_required)
    .every(c => c.progress?.status === 'completed');
});

const nextStep = async (content: BaseContent) => {
  await updateContentProgress(content.id);
  if (isLastContent.value) {
    if (allRequiredCompleted.value) {
      await completeModule();
    } else {
      $q.notify({
        type: 'negative',
        message: 'Please complete all required content before finishing the module.'
      });
    }
  } else {
    const nextStepValue = step.value + 1;
    if (nextStepValue <= maxStep.value) {
      step.value = nextStepValue;
    }
  }
};

const prevStep = () => {
  const prevStepValue = step.value - 1;
  if (prevStepValue >= 1) {
    step.value = prevStepValue;
  }
};

const handleStepChange = (newStep: number) => {
  step.value = newStep;
};

const isModuleCompleted = computed(() => {
  return moduleData.value?.progress?.status === 'completed';
});

const startQuiz = async (contentId: number) => {
  try {
    router.push(`/quiz/${route.params.courseId}/${route.params.enrollmentId}/${route.params.moduleId}/${contentId}`);
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to start quiz'
    });
  }
};

const fetchModuleData = async () => {
  try {
    loading.value = true;
    const response = await api.get(
      `/enrollments/${route.params.enrollmentId}/modules/${route.params.moduleId}`,
      {
        headers: {
          Authorization: `Bearer ${qCookies.get('token')}`
        }
      });
    moduleData.value = response.data.data;
    if (moduleData.value?.contents) {
      const savedStep = loadStep(
        route.params.enrollmentId.toString(),
        route.params.moduleId.toString()
      );

      if (savedStep > 0 && savedStep <= moduleData.value.contents.length) {
        step.value = savedStep;
      }
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to load module content'
    });
  } finally {
    loading.value = false;
  }
};

const updateContentProgress = async (contentId: number) => {
  try {
    progressLoading.value = true;
    const response = await api.post<ProgressResponse>(
      `/enrollments/${route.params.enrollmentId}/modules/${route.params.moduleId}/progress`,
      {
        content_id: contentId,
        content_status: 'completed',
        completed: true
      },
      {
        headers: {
          Authorization: `Bearer ${qCookies.get('token')}`
        }
      }
    );

    if (response.data.success) {
      const content = moduleData.value?.contents.find(c => c.id === contentId);
      if (content && response.data.data.content_progress) {
        content.progress = response.data.data.content_progress;
      }

      if (moduleData.value?.module && response.data.data.module_progress) {
        moduleData.value.progress = response.data.data.module_progress;
      }
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to update progress'
    });
  } finally {
    progressLoading.value = false;
  }
};

const completeModule = async () => {
  try {
    const response = await api.post<ProgressResponse>(
      `/enrollments/${route.params.enrollmentId}/modules/${route.params.moduleId}/progress`,
      {
        completed: true
      },
      {
        headers: {
          Authorization: `Bearer ${qCookies.get('token')}`
        }
      }
    );

    if (response.data.success) {
      if (moduleData.value?.module && response.data.data.module_progress) {
        moduleData.value.progress = response.data.data.module_progress;
      }

      $q.notify({
        type: 'positive',
        message: 'Module completed successfully!'
      });
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to complete module'
    });
  }
};

onMounted(() => {
  fetchModuleData();
});

watch(step, (newStep) => {
  if (!moduleData.value || !route.params.enrollmentId || !route.params.moduleId) return;

  if (newStep < 1) {
    step.value = 1;
    return;
  }

  if (newStep > maxStep.value) {
    step.value = maxStep.value;
    return;
  }

  saveStep(
    newStep,
    route.params.enrollmentId.toString(),
    route.params.moduleId.toString()
  );
});
</script>

<style lang="scss" scoped>
.content-container {
  max-width: 800px;
  margin: 0 auto;
}

.markdown-content {
  white-space: pre-wrap;
}
</style>
