<template>
  <div>
    <Suspense>
      <TableFaq />
      <template #fallback>
        <TableFaqSkeleton />
      </template>
    </Suspense>
    <AddDialog />
    <UpdateDialog />
    <DeleteDialog />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import TableFaqSkeleton from 'src/components/admin/faq/TableFaqSkeleton.vue';
import AddDialog from 'src/components/admin/faq/AddDialog.vue';
import UpdateDialog from 'src/components/admin/faq/EditDialog.vue';
import DeleteDialog from 'src/components/admin/faq/DeleteDialog.vue';

const TableFaq = defineAsyncComponent(() => import('src/components/admin/faq/TableFaq.vue'))
</script>

<style scoped></style>
