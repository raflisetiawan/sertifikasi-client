<template>
  <q-card @click="!module.is_locked && handleModuleClick(module)" :class="[
    'module-card',
    { 'cursor-pointer': !module.is_locked, 'disabled': module.is_locked }
  ]" v-ripple>
    <q-card-section>
      <div class="row items-center">
        <div class="col">
          <div class="text-h6">
            {{ module.title }}
            <q-chip v-if="module.is_locked" :color="getModuleAccessStatus(module).color" text-color="white"
              size="sm" class="q-ml-sm">
              <q-icon :name="getModuleAccessStatus(module).icon" left />
              {{ getModuleAccessStatus(module).label }}
            </q-chip>
          </div>
          <div class="text-grey-8 q-mt-sm" v-html="module.description"></div>
        </div>
        <div class="col-auto">
          <q-chip :color="getModuleTypeColor(module.type)" text-color="white">
            {{ getModuleTypeLabel(module.type) }}
          </q-chip>
        </div>
      </div>

      <!-- Progress Section -->
      <div v-if="!module.is_locked" class="q-mt-md">
        <template v-if="module.progress">
          <q-linear-progress :value="(module.progress.percentage || 0) / 100"
            :color="getProgressColor(module.progress.status)" size="22px">
            <div class="absolute-full flex flex-center">
              <q-badge color="white" text-color="black" :label="`${module.progress.percentage}%`" />
            </div>
          </q-linear-progress>
          <div class="row justify-between q-mt-sm">
            <div class="text-caption">
              {{ getProgressStatusLabel(module.progress.status) }}
            </div>
            <div class="text-caption">
              <template v-if="module.progress.completed_at">
                Selesai: {{ formatDate(module.progress.completed_at) }}
              </template>
              <template v-else-if="module.progress.started_at">
                Mulai: {{ formatDate(module.progress.started_at) }}
              </template>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="text-grey q-mt-sm">
            <q-icon name="schedule" /> Belum dimulai
          </div>
        </template>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { useFormatters } from 'src/composables/useFormatters';
import { useStatusUtils } from 'src/composables/useStatusUtils';
import { Module } from 'src/models/module';
import { CourseDetail } from 'src/models/dashboard';

const props = defineProps({
  module: { type: Object as PropType<Module>, required: true },
  courseDetail: { type: Object as PropType<CourseDetail>, required: true },
});

const router = useRouter();
const route = useRoute();
const { formatDate } = useFormatters();
const { getProgressColor, getProgressStatusLabel, getModuleTypeColor, getModuleTypeLabel } = useStatusUtils();

const getModuleAccessStatus = (module: Module) => {
  if (!module.is_locked) return { color: 'positive', icon: 'lock_open', label: 'Tersedia' };

  if (module.access_restriction?.status === 'upcoming') {
    return {
      color: 'warning',
      icon: 'schedule',
      label: `Tersedia ${formatDate(module.access_restriction.start_at)}`
    };
  }

  if (module.access_restriction?.status === 'expired') {
    return {
      color: 'negative',
      icon: 'block',
      label: 'Akses Berakhir'
    };
  }

  return {
    color: 'grey',
    icon: 'lock',
    label: 'Terkunci'
  };
};

const handleModuleClick = (module: Module) => {
  router.push({
    name: 'dashboard.courses.module.learn',
    params: { courseId: route.params.id, moduleId: module.id, enrollmentId: props.courseDetail.enrollment.id }
  });
};
</script>

<style lang="scss" scoped>
.module-card {
  transition: all 0.3s ease;
  border: 1px solid transparent;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-color: $primary;
    background: linear-gradient(to right, rgba(25, 118, 210, 0.05), transparent);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &::after {
    content: '';
    position: absolute;
    top: 16px;
    right: 16px;
    width: 24px;
    height: 24px;
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%231976d2"><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/></svg>');
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::after {
    opacity: 1;
  }
}

.module-card:focus {
  outline: none;
  border-color: $primary;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
}

.q-linear-progress {
  transition: all 0.3s ease;

  .module-card:hover & {
    height: 24px !important;
  }
}

.q-chip {
  transition: transform 0.3s ease;

  .module-card:hover & {
    transform: scale(1.05);
  }
}
</style>
