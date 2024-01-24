<template>
  <div>
    <Suspense>
      <CourseTable />
      <template #fallback>Loading...</template>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';


const CourseTable = defineAsyncComponent(() => import('components/admin/course/CourseTable.vue'));

</script>

<style scoped></style>
