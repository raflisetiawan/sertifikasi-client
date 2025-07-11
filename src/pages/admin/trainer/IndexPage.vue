<template>
  <div>
    <Suspense>
      <TableTrainer />
      <template #fallback>
        <TableTrainerSkeleton />
      </template>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import TableTrainerSkeleton from 'src/components/admin/trainer/TableTrainerSkeleton.vue';
import { useMetaTitle } from 'src/composables/meta';

const TableTrainer = defineAsyncComponent(() => import('src/components/admin/trainer/TableTrainer.vue'))

useMetaTitle('Manage Trainer - Admin')
</script>

<style scoped></style>
