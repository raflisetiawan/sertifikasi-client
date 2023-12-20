<template>
  <!-- get material by course id -->
  <div>
    <suspense>
      <MaterialCard />
      <template #fallback>
        <MaterialCardSkeleton></MaterialCardSkeleton>
      </template>
    </suspense>
    <EditDialog></EditDialog>
    <DeleteDialog />
  </div>
</template>

<script setup lang="ts">
import MaterialCardSkeleton from 'src/components/admin/material/MaterialCardSkeleton.vue';
import EditDialog from 'components/admin/material/EditDialog.vue';
import DeleteDialog from 'components/admin/material/DeleteDialog.vue';
import { defineAsyncComponent } from 'vue';

const MaterialCard = defineAsyncComponent(() => import('components/admin/material/MaterialCard.vue'));
</script>

<style scoped></style>
