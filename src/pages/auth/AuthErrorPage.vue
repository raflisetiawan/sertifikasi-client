<template>
  <div class="flex flex-center column" style="height: 100vh">
    <q-icon name="error" size="4rem" color="negative" />
    <h5 class="text-negative q-mt-md">{{ title }}</h5>
    <p class="text-body1">{{ errorMessage }}</p>
    <q-btn color="primary" label="Kembali ke Login" :to="{ name: 'auth.login' }" class="q-mt-md" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const title = computed(() => {
  return route.query.title || 'Authentication Error';
});

const errorMessage = computed(() => {
  return decodeURIComponent(route.query.message as string) || 'Authentication failed';
});
</script>
