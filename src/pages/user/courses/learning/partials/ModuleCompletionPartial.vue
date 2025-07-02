<template>
  <div class="module-completion-container text-center q-pa-md">
    <q-icon name="check_circle" color="positive" size="64px" class="q-mb-md" />
    <div class="text-h5 q-mb-sm">Selamat!</div>
    <div class="text-body1 q-mb-lg">
      Anda telah menyelesaikan semua konten yang diperlukan dalam modul ini.
      Sekarang Anda dapat menyelesaikan modul.
    </div>
    <q-btn color="primary" label="Selesaikan Modul" @click="emit('complete-module')" />
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'complete-module'): void;
}>();
</script>

<style scoped>
.module-completion-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f9f9f9;
}
</style>
