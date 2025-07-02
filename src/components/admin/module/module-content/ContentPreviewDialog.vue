<template>
  <q-dialog v-model="showDialog" persistent maximized>
    <q-card class="q-pa-md">
      <q-bar class="bg-primary text-white">
        <q-icon name="visibility" />
        <div>Pratinjau Konten</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-bar>

      <q-card-section v-if="content">
        <div class="text-h4 q-mb-md">{{ content.title }}</div>

        <!-- Text Content -->
        <div v-if="textContent" v-html="textContent.content" />

        <!-- Video Content -->
        <div v-if="videoContent">
          <q-video :src="videoEmbedUrl" :ratio="16 / 9" />
        </div>

        <!-- Quiz Content -->
        <div v-if="quizContent">
          <div class="text-body1 q-mb-md">{{ quizContent.description }}</div>
          <q-list bordered separator>
            <q-item v-for="(question, index) in quizContent.questions" :key="index">
              <q-item-section>
                <q-item-label class="text-weight-bold">{{ index + 1 }}. {{ question.question }}</q-item-label>
                <q-item-label v-if="question.type === 'multiple_choice'">
                  <q-option-group :model-value="null" :options="question.options.map(opt => ({ label: opt, value: opt }))" type="radio" />
                </q-item-label>
                <q-item-label v-if="question.type === 'true_false'">
                  <q-option-group :model-value="null" :options="[{ label: 'Benar', value: true }, { label: 'Salah', value: false }]"
                    type="radio" />
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <!-- Assignment Content -->
        <div v-if="assignmentContent">
          <div class="text-h6">Instruksi</div>
          <div v-html="assignmentContent.instructions" />
          <div class="q-mt-md">
            <strong>Deadline:</strong> {{ new Date(assignmentContent.due_date).toLocaleString() }}
          </div>
        </div>

        <!-- File Content -->
        <div v-if="fileContent">
          <q-banner class="bg-grey-2">
            <template v-slot:avatar>
              <q-icon name="description" />
            </template>
            File siap untuk diunduh.
            <template v-slot:action>
              <q-btn v-if="fileContent.file_url" flat color="primary" label="Unduh" :href="fileContent.file_url"
                target="_blank" />
              <q-btn v-else flat color="grey" label="File tidak tersedia" disable />
            </template>
          </q-banner>
        </div>

        <!-- Practice Content -->
        <div v-if="practiceContent">
          <div class="text-body1 q-mb-md">{{ practiceContent.description }}</div>
          <q-list bordered separator>
            <q-item v-for="(question, index) in practiceContent.questions" :key="index">
              <q-item-section>
                <q-item-label class="text-weight-bold">{{ index + 1 }}. {{ question.question }}</q-item-label>
                <!-- Add more details for practice questions as needed -->
              </q-item-section>
            </q-item>
          </q-list>
        </div>

      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  BaseContent,
  TextContent,
  VideoContent,
  QuizContent,
  AssignmentContent,
  FileContent,
  PracticeContent
} from 'src/models/module-content';

const showDialog = ref(false);
const content = ref<BaseContent | null>(null);

const textContent = computed(() => {
  return content.value?.content_type === 'text' ? content.value.content as TextContent : null;
});

const videoContent = computed(() => {
  return content.value?.content_type === 'video' ? content.value.content as VideoContent : null;
});

const quizContent = computed(() => {
  return content.value?.content_type === 'quiz' ? content.value.content as QuizContent : null;
});

const assignmentContent = computed(() => {
  return content.value?.content_type === 'assignment' ? content.value.content as AssignmentContent : null;
});

const fileContent = computed(() => {
  return content.value?.content_type === 'file' ? content.value.content as FileContent : null;
});

const practiceContent = computed(() => {
  return content.value?.content_type === 'practice' ? content.value.content as PracticeContent : null;
});

const videoEmbedUrl = computed(() => {
  if (!videoContent.value) return '';
  if (videoContent.value.provider === 'youtube') {
    return `https://www.youtube.com/embed/${videoContent.value.video_id}`;
  }
  if (videoContent.value.provider === 'vimeo') {
    return `https://player.vimeo.com/video/${videoContent.value.video_id}`;
  }
  return videoContent.value.video_url || '';
});


defineExpose({
  show: (contentToShow: BaseContent) => {
    content.value = contentToShow;
    showDialog.value = true;
  }
});
</script>