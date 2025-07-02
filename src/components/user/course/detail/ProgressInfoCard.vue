<template>
  <q-card>
    <q-card-section>
      <div class="text-subtitle1">Progress Kelas</div>
      <q-linear-progress class="q-py-md" :value="(progressPercentage || 0) / 100"
        :color="getProgressColor(progressStatus)">
        <div class="absolute-full flex flex-center">
          <q-badge color="white" text-color="black" :label="`${progressPercentage}%`" />
        </div>
      </q-linear-progress>
      <div class="row q-col-gutter-sm q-mt-md">
        <div class="col-12">
          <q-chip :color="getProgressStatusColor(progressStatus)" text-color="white">
            {{ getProgressStatusLabel(progressStatus) }}
          </q-chip>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useStatusUtils } from 'src/composables/useStatusUtils';

const props = defineProps({
  progressPercentage: { type: Number, required: true },
  progressStatus: { type: String, required: true },
});
console.log(props);

const { getProgressColor, getProgressStatusLabel, getProgressStatusColor } = useStatusUtils();
</script>
