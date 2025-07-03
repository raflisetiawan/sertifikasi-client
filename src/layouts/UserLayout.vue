<template>
  <q-no-ssr>
    <q-layout view="hHh LpR fFf">
      <!-- Header -->
      <q-header elevated class="bg-primary text-white">
        <q-toolbar>
          <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

          <q-toolbar-title>
            UISI Online Learning
          </q-toolbar-title>

          <q-space />

          <!-- User Menu -->
          <q-btn flat round>
            <q-avatar size="26px">
              <template v-if="userProfileStore.profile?.image">
                <img :src="userProfileStore.profile?.image" />
              </template>
              <template v-else>
                <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
              </template>
            </q-avatar>
            <q-menu>
              <q-list style="min-width: 150px">
                <q-item-label header>{{ userName }}</q-item-label>
                <q-separator />
                <q-item clickable v-close-popup :to="{ name: 'dashboard' }">
                  <q-item-section avatar>
                    <q-icon name="person" />
                  </q-item-section>
                  <q-item-section>Profil</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup @click="handleLogout">
                  <q-item-section avatar>
                    <q-icon name="logout" />
                  </q-item-section>
                  <q-item-section>Keluar</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-toolbar>
      </q-header>

      <!-- Drawer -->
      <q-drawer v-model="leftDrawerOpen" :mini="miniState" :width="240" :breakpoint="768" bordered
        :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'">
        <q-scroll-area class="fit">
          <q-list padding>
            <template v-for="(menuItem, index) in menuList" :key="index">
              <!-- Navigation Links -->
              <q-item :to="menuItem.to" v-ripple clickable :active="route.name === menuItem.to.name"
                active-class="text-primary q-item--active">
                <q-item-section avatar>
                  <q-icon :name="menuItem.icon" />
                </q-item-section>
                <q-item-section>
                  {{ menuItem.label }}
                </q-item-section>
                <q-item-section v-if="menuItem.badge" side>
                  <q-badge color="red" floating>
                    {{ menuItem.badge }}
                  </q-badge>
                </q-item-section>
              </q-item>
              <q-separator v-if="menuItem.separator" class="q-my-sm" />
            </template>
          </q-list>
        </q-scroll-area>

        <!-- Drawer Footer -->
        <q-item clickable v-ripple class="absolute-bottom" @click="miniState = !miniState">
          <q-item-section avatar>
            <q-icon :name="miniState ? 'chevron_right' : 'chevron_left'" />
          </q-item-section>
          <q-item-section>
            {{ miniState ? '' : 'Tutup Menu' }}
          </q-item-section>
        </q-item>
      </q-drawer>

      <!-- Page Container -->
      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </q-no-ssr>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { qCookies } from 'src/boot/cookies';
import { useUserStore } from 'src/stores/user';
import { useUserProfileStore } from 'src/stores/user-proflie-store';

const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const userProfileStore = useUserProfileStore();

// State
const leftDrawerOpen = ref(true);
const miniState = ref(false);
const notificationCount = ref(0);
const userName = ref(userStore.name || 'User');

// Menu Items
// Update menuList constant
const menuList = [
  {
    icon: 'dashboard',
    label: 'Dashboard',
    to: { name: 'dashboard' },
    separator: false
  },
  {
    icon: 'school',
    label: 'Kelas Saya',
    to: { name: 'dashboard.courses.index' },
    separator: false
  },
  {
    icon: 'receipt',
    label: 'Riwayat Pembayaran',
    to: { name: 'dashboard.payments' },
    separator: false
  },
  {
    icon: 'workspace_premium',
    label: 'Sertifikat',
    to: { name: 'dashboard.certificates.index' },
    separator: false
  },
  {
    icon: 'notifications',
    label: 'Notifikasi',
    to: { name: 'dashboard.notifications' },
    separator: false,
    badge: notificationCount // Add ref for notification count
  },
  {
    icon: 'bookmark',
    label: 'Wishlist',
    to: { name: 'dashboard.wishlist' },
    separator: false
  },
  {
    icon: 'help',
    label: 'Pusat Bantuan',
    to: { name: 'dashboard.help' },
    separator: false
  },
  {
    icon: 'person',
    label: 'Profil',
    to: { name: 'user.profile' },
    separator: true
  }
];

// Methods
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const handleLogout = async () => {
  try {
    // Show loading
    $q.loading.show({
      message: 'Logging out...'
    });

    // Remove token
    qCookies.remove('token');

    // Optional: Clear store state
    userStore.$reset();

    // Redirect to login
    await router.push({ name: 'auth.login' });

    $q.notify({
      type: 'positive',
      message: 'Berhasil keluar'
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Gagal keluar'
    });
  } finally {
    $q.loading.hide();
  }
};

// Lifecycle
onMounted(() => {
  // Check auth on mount
  const token = qCookies.get('token');
  if (!token) {
    router.push({ name: 'auth.login' });
    return;
  }

  // Handle responsive drawer
  const handleResize = () => {
    if (window.innerWidth < 768) {
      leftDrawerOpen.value = false;
      miniState.value = true;
    } else {
      leftDrawerOpen.value = true;
      miniState.value = false;
    }
  };

  handleResize();
  window.addEventListener('resize', handleResize);

  // Cleanup
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });
});
</script>

<style lang="scss">
.q-item--active {
  font-weight: 600;
  background: rgba(var(--q-primary), 0.1);
}
</style>
