<template>
  <div>
    <Suspense>
      <ExpansionDrawer />
      <template #fallback>
        <ExpansionDrawerSkeleton />
      </template>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import ExpansionDrawerSkeleton from 'src/components/user/faq/ExpansionDrawerSkeleton.vue';
import { defineAsyncComponent } from 'vue';

const ExpansionDrawer = defineAsyncComponent(() => import('components/user/faq/ExpansionDrawer.vue'))
</script>

<style scoped></style>
