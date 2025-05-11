<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">Progress</div>
      <q-linear-progress :value="moduleProgress" :color="isModuleCompleted ? 'positive' : 'primary'" class="q-mt-md" />
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
      <q-item v-for="(content, index) in contents" :key="content.id" clickable :active="currentStep === index + 1"
        @click="$emit('step-change', index + 1)">
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
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { BaseContent } from 'src/models/module-learning';

const props = defineProps<{
  contents: BaseContent[];
  currentStep: number;
  isModuleCompleted: boolean;
}>();

defineEmits<{
  (e: 'step-change', step: number): void;
}>();

const moduleProgress = computed(() => {
  if (!props.contents.length) return 0;
  const completed = props.contents.filter(c => isStepComplete(c)).length;
  return completed / props.contents.length;
});

const getContentIcon = (type: string) => {
  const icons: Record<string, string> = {
    video: 'play_circle',
    text: 'article',
    quiz: 'quiz',
    assignment: 'assignment',
    file: 'insert_drive_file',
    practice: 'psychology'
  };
  return icons[type] || 'help';
};

const getContentColor = (content: BaseContent): string => {
  if (!content.progress?.status) return 'grey';
  if (content.progress.status === 'completed') return 'positive';
  if (content.progress.status === 'in_progress') return 'warning';
  return 'grey';
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

const isStepComplete = (content: BaseContent): boolean => {
  return content.progress?.status === 'completed';
};
</script>

<style lang="scss" scoped>
.q-item {
  border-radius: 8px;
  margin-bottom: 4px;

  &--active {
    background: rgba(0, 0, 0, 0.05);
  }
}
</style>
