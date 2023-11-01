<template>
  <div>
    <Suspense>
      <DetailComponent />
      <template #fallback>
        <DetailSkeleton />
      </template>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import DetailSkeleton from 'src/components/user/course/detail/DetailSkeleton.vue';
const DetailComponent = defineAsyncComponent({
  loader: () => import('components/user/course/detail/DetailComponent.vue'),
})
</script>

<style scoped></style>
