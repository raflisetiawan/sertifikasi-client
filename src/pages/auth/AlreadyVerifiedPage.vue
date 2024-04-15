<template>
  <div class="fullscreen bg-primary text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">
      </div>

      <div class="text-h2" style="opacity:.4">
        Akun anda sudah ter verifikasi
      </div>

      <q-btn class="q-mt-xl" color="white" text-color="primary" unelevated :to="{ name: 'SignInPage' }" label="Sign In"
        no-caps />
    </div>
  </div>
</template>

<script setup lang="ts">

</script>
