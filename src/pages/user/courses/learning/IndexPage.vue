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

          <q-stepper v-model="step" ref="stepper" color="primary" :contracted="$q.screen.lt.md" class="no-shadow"
            :style="{ opacity: loading ? 0.5 : 1 }">
            <!-- Generate steps from module contents -->
            <q-step v-for="(content, index) in moduleData?.contents" :key="content.id" :name="index + 1"
              :title="content.title" :caption="getContentTypeLabel(content.type)" :done="isStepComplete(content)"
              :prefix="getPrefixForContent(content)">

              <!-- Content Display -->
              <div class="content-container q-pa-md">
                <!-- Video Content -->
                <template v-if="content.type === 'video' && isVideoContent(content.content)">
                  <div class="video-wrapper">
                    <q-video :src="getVideoEmbedUrl(content.content.video_url)" :ratio="16 / 9" />
                  </div>
                  <div v-if="content.content.is_downloadable" class="q-mt-md">
                    <q-btn color="primary" icon="download" :href="content.content.video_url" target="_blank"
                      label="Download Video" />
                  </div>
                </template>

                <!-- Text Content -->
                <template v-else-if="content.type === 'text' && isTextContent(content.content)">
                  <div v-if="content.content.format === 'html'" v-html="content.content.content"></div>
                  <div v-else class="markdown-content">{{ content.content.content }}</div>
                </template>
                <!-- Quiz Content -->
                <template v-if="content.type === 'quiz' && isQuizContent(content.content)">
                  <div class="text-center">
                    <div class="text-subtitle1 q-mb-md">
                      Time Limit: {{ content.content.time_limit_minutes }} minutes
                    </div>
                    <div class="text-subtitle1 q-mb-md">
                      Passing Score: {{ content.content.passing_score }}%
                    </div>
                    <div class="text-subtitle1 q-mb-lg">
                      Remaining Attempts: {{ content.content.max_attempts }}
                    </div>
                    <q-btn color="primary" label="Start Quiz" :disable="content.progress?.status === 'completed'"
                      @click="startQuiz(content.id)" />
                  </div>
                </template>


                <!-- Assignment Content -->
                <template v-else-if="content.type === 'assignment' && isAssignmentContent(content.content)">
                  <div class="assignment-details q-pa-md">
                    <!-- Instructions -->
                    <div class="text-subtitle1 q-mb-md">Instructions:</div>
                    <div class="instructions q-mb-lg" v-html="content.content.instructions"></div>

                    <!-- Submission Requirements -->
                    <div class="text-subtitle1 q-mb-sm">Submission Requirements:</div>
                    <q-list dense padding class="rounded-borders bg-grey-1 q-mb-lg">
                      <q-item v-for="(req, index) in content.content.submission_requirements" :key="index"
                        class="text-body2">
                        <q-item-section avatar>
                          <q-icon name="check_circle_outline" color="primary" />
                        </q-item-section>
                        <q-item-section>{{ req }}</q-item-section>
                      </q-item>
                    </q-list>

                    <!-- Submission Info -->
                    <div class="row q-col-gutter-md q-mb-lg">
                      <div class="col-12 col-sm-6">
                        <q-card flat bordered>
                          <q-card-section class="q-pa-sm">
                            <div class="text-caption">Deadline</div>
                            <div class="text-subtitle2">
                              {{ formatDate(content.content.due_date) }}
                            </div>
                          </q-card-section>
                        </q-card>
                      </div>
                      <div class="col-12 col-sm-6">
                        <q-card flat bordered>
                          <q-card-section class="q-pa-sm">
                            <div class="text-caption">Maximum File Size</div>
                            <div class="text-subtitle2">
                              {{ content.content.max_file_size_mb }} MB
                            </div>
                          </q-card-section>
                        </q-card>
                      </div>
                    </div>

                    <!-- File Upload -->
                    <div class="upload-section">
                      <q-file v-model="assignmentFiles[content.id]" label="Upload Your Assignment" filled bottom-slots
                        counter :max-file-size="content.content.max_file_size_mb * 1024 * 1024"
                        @rejected="onFileRejected">
                        <template v-slot:prepend>
                          <q-icon name="attach_file" />
                        </template>
                        <template v-slot:hint>
                          Max file size: {{ content.content.max_file_size_mb }}MB
                        </template>
                      </q-file>

                      <div class="row justify-end q-mt-md">
                        <q-btn color="primary" :loading="submitting" :disable="!assignmentFiles[content.id]"
                          @click="submitAssignment(content.id)" icon-right="send" label="Submit Assignment" />
                      </div>
                    </div>
                  </div>
                </template>

                <!-- File Content -->
                <template v-else-if="content.type === 'file' && isFileContent(content.content)">
                  <div class="text-center">
                    <q-btn color="primary" icon="download" :href="content.content.file_url" target="_blank"
                      :label="`Download (${formatFileSize(content.content.file_size)})`" />
                  </div>
                </template>
              </div>

              <!-- Step Navigation -->
              <q-stepper-navigation>
                <div class="row justify-between">
                  <q-btn v-if="index > 0" flat color="primary" label="Sebelumnya" @click="prevStep" />
                  <q-space />
                  <template v-if="moduleData?.progress.status !== 'completed'">
                    <q-btn :loading="progressLoading" color="primary" :label="isLastStep(index) ? 'Selesai' : 'Lanjut'"
                      @click="nextStep(content)" />
                  </template>
                </div>
              </q-stepper-navigation>
            </q-step>
          </q-stepper>
          <q-inner-loading :showing="loading">
            <q-spinner-dots size="50px" color="primary" />
          </q-inner-loading>
        </q-card>
      </div>

      <!-- Progress Sidebar -->
      <div class="col-12 col-md-3">
        <q-card>
          <q-card-section>
            <div class="text-h6">Progress</div>
            <q-linear-progress :value="moduleProgress" :color="isModuleCompleted ? 'positive' : 'primary'"
              class="q-mt-md" />
            <div class="text-caption q-mt-sm">
              {{ Math.round(moduleProgress * 100) }}% Selesai
              <template v-if="isModuleCompleted">
                <q-badge color="positive" class="q-ml-sm">
                  Completed
                </q-badge>
              </template>
            </div>
          </q-card-section>

          <q-list padding>
            <q-item v-for="(content, index) in moduleData?.contents" :key="content.id" clickable
              @click="step = index + 1" :active="step === index + 1">
              <q-item-section avatar>
                <q-icon :name="getContentIcon(content.type)" :color="getContentColor(content)" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ content.title }}</q-item-label>
                <q-item-label caption>{{ getContentProgress(content) }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar, date } from 'quasar';
import { api } from 'src/boot/axios';
import type { ModuleLearning, VideoContent, TextContent, QuizContent, AssignmentContent, FileContent, BaseContent, ProgressResponse } from 'src/models/module-learning';
import { qCookies } from 'src/boot/cookies';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const step = ref<number>(1);
const maxStep = computed(() => moduleData.value?.contents?.length ?? 1);
const moduleData = ref<ModuleLearning | null>(null);
const assignmentFiles = ref<Record<number, File>>({});
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

const isVideoContent = (content: VideoContent | TextContent | QuizContent | AssignmentContent | FileContent): content is VideoContent => {
  return 'video_url' in content;
};

const isTextContent = (content: VideoContent | TextContent | QuizContent | AssignmentContent | FileContent): content is TextContent => {
  return 'format' in content && 'content' in content;
};

const isQuizContent = (content: VideoContent | TextContent | QuizContent | AssignmentContent | FileContent): content is QuizContent => {
  return 'time_limit_minutes' in content;
};

const isAssignmentContent = (content: VideoContent | TextContent | QuizContent | AssignmentContent | FileContent): content is AssignmentContent => {
  return 'instructions' in content;
};

const isFileContent = (content: VideoContent | TextContent | QuizContent | AssignmentContent | FileContent): content is FileContent => {
  return 'file_url' in content;
};

const moduleProgress = computed(() => {
  if (!moduleData.value?.contents) return 0;
  const completed = moduleData.value.contents.filter(c => isStepComplete(c)).length;
  return completed / moduleData.value.contents.length;
});

// Content Type Helpers
const getContentTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    video: 'Video',
    text: 'Teks',
    quiz: 'Kuis',
    assignment: 'Tugas',
    file: 'File'
  };
  return labels[type] || type;
};

const getContentIcon = (type: string) => {
  const icons: Record<string, string> = {
    video: 'play_circle',
    text: 'article',
    quiz: 'quiz',
    assignment: 'assignment',
    file: 'insert_drive_file'
  };
  return icons[type] || 'help';
};

const getContentColor = (content: BaseContent): string => {
  if (!content.progress?.status) return 'grey';

  if (content.progress.status === 'completed') return 'positive';
  if (content.progress.status === 'in_progress') return 'warning';
  return 'grey';
};

const getPrefixForContent = (content: BaseContent) => {
  if (content.progress?.status === 'completed') return '✓';
  return content.order.toString();
};

const isStepComplete = (content: BaseContent): boolean => {
  return content.progress?.status === 'completed';
};

const isLastStep = (index: number) => {
  return !moduleData.value?.contents || index === moduleData.value.contents.length - 1;
};

const nextStep = async (content: BaseContent) => {
  await updateContentProgress(content.id);
  if (isLastStep(step.value - 1)) {
    await completeModule();
  } else {
    const nextStepValue = step.value + 1;
    if (nextStepValue <= maxStep.value) {
      step.value = nextStepValue;
    }
  }
};

const getVideoEmbedUrl = (url: string): string => {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.includes('v=')
      ? url.split('v=')[1]?.split('&')[0]
      : url.split('/').pop();
    return videoId
      ? `https://www.youtube.com/embed/${videoId}`
      : url;
  }
  if (url.includes('vimeo.com')) {
    const videoId = url.split('/').pop();
    return videoId
      ? `https://player.vimeo.com/video/${videoId}`
      : url;
  }
  return url;
};

const getContentProgress = (content: BaseContent): string => {
  if (!content.progress?.status) return 'Belum Dimulai';

  switch (content.progress.status) {
    case 'completed':
      return 'Selesai';
    case 'in_progress':
      return 'Sedang Dikerjakan';
    default:
      return 'Belum Dimulai';
  }
};

const isModuleCompleted = computed(() => {
  return moduleData.value?.progress?.status === 'completed';
});

const startQuiz = async (contentId: number) => {
  try {
    // Just navigate to quiz page, actual quiz start happens there
    router.push(`/quiz/${route.params.courseId}/${route.params.enrollmentId}/${route.params.moduleId}/${contentId}`);
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to start quiz'
    });
  }
};

interface RejectedEntry {
  failedPropValidation: string;
}

const onFileRejected = (rejectedEntries: RejectedEntry[]) => {
  $q.notify({
    type: 'negative',
    message: `File rejected: ${rejectedEntries[0].failedPropValidation}`
  });
};

const prevStep = () => {
  const prevStepValue = step.value - 1;
  if (prevStepValue >= 1) {
    step.value = prevStepValue;
  }
};

// API Integration
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
    console.log(response.data.data)
    moduleData.value = response.data.data;
    if (moduleData.value?.contents) {
      const savedStep = loadStep(
        route.params.enrollmentId.toString(),
        route.params.moduleId.toString()
      );

      // Validate saved step
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

    // Update local state with new progress data
    if (response.data.success) {
      const content = moduleData.value?.contents.find(c => c.id === contentId);
      if (content && response.data.data.content_progress) {
        content.progress = response.data.data.content_progress;
      }

      // Update module progress
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

    console.log('Complete Module Response:', response.data);

    if (response.data.success) {
      // Update module progress
      if (moduleData.value?.module && response.data.data.module_progress) {
        moduleData.value.progress = response.data.data.module_progress;
      }

      $q.notify({
        type: 'positive',
        message: 'Module completed successfully!'
      });

      // Optional: Redirect to next module or course overview
      // router.push(...);
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to complete module'
    });
  }
};

// Utilities
const formatDate = (dateString: string) => {
  return date.formatDate(dateString, 'D MMMM YYYY');
};

const formatFileSize = (bytes: number) => {
  return bytes < 1024 * 1024
    ? `${Math.round(bytes / 1024)} KB`
    : `${Math.round(bytes / (1024 * 1024))} MB`;
};

// Add submitting state
const submitting = ref(false);

// Update submitAssignment function
const submitAssignment = async (contentId: number) => {
  if (submitting.value) return;

  try {
    submitting.value = true;
    const formData = new FormData();
    if (assignmentFiles.value[contentId]) {
      formData.append('submission_file', assignmentFiles.value[contentId]);
      await api.post(`/enrollments/${route.params.enrollmentId}/modules/${route.params.moduleId}/contents/${contentId}/submit-assignment`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${qCookies.get('token')}`
        }
      });

      // Clear file after successful upload
      delete assignmentFiles.value[contentId];

      $q.notify({
        type: 'positive',
        message: 'Assignment submitted successfully'
      });

      // Update progress
      await updateContentProgress(contentId);
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to submit assignment'
    });
  } finally {
    submitting.value = false;
  }
};
onMounted(() => {
  fetchModuleData();
});
watch(step, (newStep) => {
  if (!moduleData.value || !route.params.enrollmentId || !route.params.moduleId) return;

  // Validate step bounds
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
.video-wrapper {
  position: relative;
  padding-bottom: 56.25%;
  /* 16:9 */
  height: 0;
}

.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.content-container {
  max-width: 800px;
  margin: 0 auto;
}

.markdown-content {
  white-space: pre-wrap;
}

.assignment-details {
  .instructions {
    border-left: 4px solid $primary;
    padding-left: 16px;
    background: rgba(0, 0, 0, 0.02);
    padding: 16px;
    border-radius: 4px;
  }

  .upload-section {
    border-top: 1px solid rgba(0, 0, 0, 0.12);
    padding-top: 16px;
    margin-top: 16px;
  }

  :deep(ol) {
    padding-left: 20px;
  }

  :deep(li) {
    margin-bottom: 8px;
  }
}
</style>
