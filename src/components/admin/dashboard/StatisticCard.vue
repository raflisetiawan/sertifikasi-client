<template>
  <q-card class="statistic-card">
    <q-card-section class="flex items-center">
      <q-icon :name="icon" size="lg" class="q-mr-md" :color="color" />
      <div>
        <div class="text-h4 text-weight-bolder">{{ value }}</div>
        <div class="text-subtitle2 text-grey">{{ label }}</div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
defineProps<{
  icon: string;
  label: string;
  value: number | string;
  color: string;
}>();
</script>

<style scoped>
.statistic-card {
  flex-grow: 1;
}
</style>
