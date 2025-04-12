<template>
  <div class="q-pa-md">
    <div class="text-h6 text-center q-mb-md">Modul Pembelajaran</div>
    <q-list bordered separator>
      <div v-for="n in 3" :key="n" class="module-item-skeleton">
        <q-skeleton type="rect" width="100%" height="80px" class="q-mb-md" />
        <q-skeleton type="text" width="60%" class="q-mb-sm" />
        <q-skeleton type="text" width="40%" class="q-mb-sm" />
        <q-skeleton type="rect" width="100%" height="150px" />
      </div>
    </q-list>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.module-item-skeleton {
  padding: 16px;
  border-radius: 8px;
  background-color: #f5f5f5;
  margin-bottom: 16px;
}
</style>
