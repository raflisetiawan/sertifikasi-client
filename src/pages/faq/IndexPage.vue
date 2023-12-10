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
import { useMetaTitle } from 'src/composables/meta';
import { defineAsyncComponent } from 'vue';

const ExpansionDrawer = defineAsyncComponent(() => import('components/user/faq/ExpansionDrawer.vue'))

useMetaTitle('FAQ')
</script>

<style scoped></style>
