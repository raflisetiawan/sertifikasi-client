<template>
  <section class="q-mt-xl">
    <div class="text-h5 q-mb-md">Fasilitas</div>
    <div class="row q-col-gutter-md">
      <div v-for="(facility, index) in facilities" :key="index" class="col-12 col-sm-6 col-md-4">
        <q-card class="facility-card">
          <q-card-section class="row items-center no-wrap">
            <q-icon name="check_circle" color="positive" size="sm" class="q-mr-sm" />
            <div class="text-body1">{{ facility }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  facilities: string[];
}>();
</script>

<style scoped>
.facility-card {
  background: #f5f5f5;
  transition: transform 0.2s;
}

.facility-card:hover {
  transform: translateY(-2px);
  background: #e8f5e9;
}
</style>
