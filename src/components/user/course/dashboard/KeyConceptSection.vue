<template>
  <section class="q-mt-xl">
    <div class="text-h5 q-mb-md">Konsep Utama</div>
    <div class="row q-col-gutter-md">
      <div v-for="(concept, index) in concepts" :key="index" class="col-12 col-sm-6 col-md-4">
        <q-card class="concept-card">
          <q-card-section class="row items-center no-wrap">
            <q-icon name="school" color="primary" size="sm" class="q-mr-sm" />
            <div class="text-body1">{{ concept }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  concepts: string[];
}>();
</script>

<style scoped>
.concept-card {
  background: #f5f5f5;
  transition: transform 0.2s;
}

.concept-card:hover {
  transform: translateY(-2px);
  background: #e3f2fd;
}
</style>
