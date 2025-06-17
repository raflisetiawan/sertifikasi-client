<template>
  <q-no-ssr>
    <div class="auth-layout">
      <!-- Left Side - Illustration -->
      <div class="auth-layout__left" v-if="$q.screen.gt.sm">
        <div class="illustration-container">
          <div class="app-brand q-mb-lg">
            <img src="~/assets/Logo-Digiclass-Red.png" alt="Logo" style="height: 40px">
            <span class="text-h5 q-ml-md">{{ appName }}</span>
          </div>
          <q-img src="~/assets/Login.svg" class="auth-illustration" />
          <div class="text-h5 text-weight-bold q-mt-xl text-primary">
            Tingkatkan Skillmu Bersama Kami
          </div>
          <div class="text-subtitle1 q-mt-md text-grey-7">
            Platform pembelajaran online terbaik untuk masa depanmu
          </div>
        </div>
      </div>

      <!-- Right Side - Auth Form -->
      <div class="auth-layout__right">
        <router-view></router-view>
      </div>
    </div>
  </q-no-ssr>
</template>

<script setup lang="ts">
const appName = import.meta.env.VITE_APP_NAME;
</script>

<style lang="scss">
.auth-layout {
  display: flex;
  min-height: 100vh;

  &__left {
    flex: 1;
    background: linear-gradient(135deg, #f5f7fa 0%, #eef1f5 100%);
    padding: 2rem;

    .illustration-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      max-width: 600px;
      margin: 0 auto;
    }

    .auth-illustration {
      max-width: 80%;
      margin: 2rem 0;
    }
  }

  &__right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background-color: white;
  }
}

@media (max-width: 1023px) {
  .auth-layout {
    flex-direction: column;

    &__right {
      padding: 1rem;
    }
  }
}
</style>
