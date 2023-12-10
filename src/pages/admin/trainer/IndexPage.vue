<template>
  <div>
    <Suspense>
      <TableTrainer />
      <template #fallback>
        <TableTrainerSkeleton />
      </template>
    </Suspense>
    <AddDialog />
    <UpdateDialog />
    <DeleteDialog />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import TableTrainerSkeleton from 'src/components/admin/trainer/TableTrainerSkeleton.vue';
import AddDialog from 'src/components/admin/trainer/AddDialog.vue';
import UpdateDialog from 'src/components/admin/trainer/EditDialog.vue';
import DeleteDialog from 'src/components/admin/trainer/DeleteDialog.vue';
import { useMetaTitle } from 'src/composables/meta';

const TableTrainer = defineAsyncComponent(() => import('src/components/admin/trainer/TableTrainer.vue'))

useMetaTitle('Manage Trainer - Admin')
</script>

<style scoped></style>
