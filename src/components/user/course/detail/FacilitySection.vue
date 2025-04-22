<template>
  <div class="q-pa-md">
    <div class="row justify-center">
      <div class="col-md-10 col-xs-12">
        <div class="text-h5 q-mb-md text-center">Fasilitas</div>
        <div class="row q-col-gutter-md">
          <div v-for="(facility, index) in parsedFacilities" :key="index" class="col-12 col-sm-6 col-md-4">
            <q-card class="facility-card">
              <q-card-section class="row items-center no-wrap">
                <q-icon name="check_circle" color="positive" size="sm" class="q-mr-sm" />
                <div class="text-body1">{{ facility }}</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps(['course'])

const parsedFacilities = computed(() => {
  if (!props.course?.facility) return [];

  try {
    return typeof props.course.facility === 'string'
      ? JSON.parse(props.course.facility)
      : props.course.facility;
  } catch {
    return [];
  }
});
</script>

<style scoped>
.facility-card {
  background: #f5f5f5;
  transition: transform 0.2s;
}

.facility-card:hover {
  transform: translateY(-2px);
  background: #e3f2fd;
}
</style>
