<template>
  <q-card v-if="readiness" :class="cardClass" flat bordered>
    <q-card-section>
      <div class="row items-center no-wrap">
        <div class="col-auto">
          <q-icon :name="iconName" :color="iconColor" size="2em" class="q-mr-md" />
        </div>
        <div class="col">
          <div class="text-subtitle1 text-weight-bold">{{ title }}</div>
          <div v-if="!readiness.is_ready" class="text-caption">
            <ul class="q-pl-md q-my-sm">
              <li v-for="(error, index) in readiness.errors" :key="index">
                {{ error }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Readiness {
  is_ready: boolean;
  errors: string[];
}

const props = defineProps<{
  readiness: Readiness | null | undefined;
}>();

const cardClass = computed(() => {
  if (!props.readiness) return '';
  return props.readiness.is_ready ? 'bg-green-1 text-green-8' : 'bg-orange-1 text-orange-8';
});

const iconName = computed(() => {
  if (!props.readiness) return '';
  return props.readiness.is_ready ? 'check_circle' : 'warning';
});

const iconColor = computed(() => {
  if (!props.readiness) return '';
  return props.readiness.is_ready ? 'positive' : 'warning';
});

const title = computed(() => {
  if (!props.readiness) return '';
  return props.readiness.is_ready
    ? 'Kursus ini siap untuk dipublikasikan.'
    : 'Kursus ini belum memenuhi syarat untuk dipublikasikan.';
});
</script>

<style scoped>
ul {
  list-style-type: disc;
}
</style>
