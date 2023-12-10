<template>
  <div id="trainer-detail" class="q-pa-md">
    <Suspense>
      <DetailComponent />
      <template #fallback>
        <DetailSkeletonVue />
      </template>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import DetailSkeletonVue from 'src/components/user/trainer/DetailSkeletonComponent.vue';
import { useMetaTitle } from 'src/composables/meta';

const DetailComponent = defineAsyncComponent(() => import('components/user/trainer/DetailComponent.vue'));
useMetaTitle('Trainer')
</script>

<style scoped></style>
