<template>
  <div class="flex flex-center" style="height: 100vh">
    <q-spinner-dots size="40px" color="primary" />
    <div class="text-subtitle1 q-ml-md">
      Processing Google Sign In...
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { useUserStore } from 'src/stores/user';
import { qCookies } from 'src/boot/cookies';
import { useUser } from 'src/composables/auth/user';

const router = useRouter();
const route = useRoute();
const $q = useQuasar();
const userStore = useUserStore();

onMounted(async () => {
  const token = route.query.token as string;
  const error = route.query.message as string;

  if (error) {
    $q.notify({
      type: 'negative',
      message: decodeURIComponent(error),
      position: 'top'
    });
    router.push({ name: 'auth.login' });
    return;
  }

  if (token) {
    try {
      // Set token in cookies
      qCookies.set('token', token, {
        path: '/',
        expires: '1d', // Match backend expiration
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        httpOnly: false
      });
      //moved get user data to composables
      const response = await useUser(token);

      // Update user store
      userStore.setUser(response.data.user);

      if (response.data.expires_at) {
        qCookies.set('expires_at', response.data.expires_at, {
          path: '/',
          expires: '1d',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Lax'
        });
      }

      // Show success notification
      $q.notify({
        type: 'positive',
        message: 'Login berhasil',
        position: 'top'
      });

      // Redirect based on user role
      if (response.data.user.role_id === 1) {
        router.push({ name: 'admin.dashboard' });
      } else {
        router.push({ name: 'home' });
      }
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Failed to verify authentication',
        position: 'top'
      });
      qCookies.remove('token', { path: '/' });
      qCookies.remove('expires_at', { path: '/' });
      router.push({ name: 'auth.login' });
    }
  } else {
    router.push({
      name: 'auth.login',
      query: { error: 'Authentication failed' }
    });
  }
});
</script>
