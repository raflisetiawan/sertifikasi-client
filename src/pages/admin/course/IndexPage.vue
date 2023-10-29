<template>
  <div>
    <h1>Halo</h1>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" :to="{ name: 'CreateCoursePage' }" />
    </q-page-sticky>
  </div>
</template>

<script setup lang="ts">
import { useMetaTitle } from 'src/composables/meta';

useMetaTitle('Manage Kelas')
</script>

<style scoped></style>
