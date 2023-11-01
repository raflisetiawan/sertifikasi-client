<template>
  <div id="register-course">
    <Suspense>
      <Register />
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const Register = defineAsyncComponent(() => import('components/user/course/register/RegisterComponent.vue'))
</script>

<style scoped></style>
