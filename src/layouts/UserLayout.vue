<template>
  <q-layout view="lHh lpR fFf">

    <q-header bordered elevated class="bg-white text-black">
      <q-toolbar>
        <q-btn v-show="$q.screen.lt.md" flat dense round @click="leftDrawer = !leftDrawer" aria-label="Menu"
          icon="menu" />
        <q-toolbar-title>
          <q-avatar>
            <img src="../assets/Logo-Digiclass-Red.png">
          </q-avatar>
          UISI DIGICLASS
        </q-toolbar-title>
        <q-space></q-space>
        <q-tabs v-show="$q.screen.gt.sm" v-model="tab" shrink>
          <q-route-tab :to="{ name: 'HomePage' }" name="Home" label="Home" />
          <q-route-tab :to="{ name: 'CoursePage' }" name="Kelas" label="Kelas" />
          <q-route-tab :to="{ name: 'AboutPage' }" name="Tentang Kami" label="Tentang Kami" />
          <q-route-tab :to="{ name: 'ContactPage' }" name="Kontak" label="Kontak" />
          <q-route-tab :to="{ name: 'FaqIndexPage' }" name="Faq" label="FAQ" />
        </q-tabs>
        <div class="q-mx-md" v-if="!isAuthenticated()">
          <q-btn flat class="text-black" :to="{ name: 'SignInPage' }">Login</q-btn>
          <q-btn flat class="text-black" :to="{ name: 'SignUpPage' }">Daftar</q-btn>
        </div>
        <div class="q-mx-md" v-else>

          <q-btn-dropdown stretch flat icon="fa-solid fa-user">
            <q-list>
              <q-item-label header>{{ getUser.name }}</q-item-label>
              <q-item v-if="isAdmin()">
                <q-item-section>
                  <q-btn class="full-width" flat @click="$router.push({ name: 'AdminPage' })">Admin</q-btn>
                </q-item-section>
              </q-item>
              <q-item v-else>
                <q-item-section>
                  <q-btn dense class="full-width" flat @click="$router.push({ name: 'MyProfileIndexPage' })">Profile
                    Saya</q-btn>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-btn class="full-width" :loading="logoutLoading" flat @click="handleLogout()">Logout</q-btn>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>
    <q-drawer v-model="leftDrawer" :breakpoint="700" bordered side="left">
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
        <q-list padding>
          <q-item clickable v-ripple @click="$router.push({ name: 'HomePage' })">
            <q-item-section avatar>
              <q-icon name="fa-solid fa-house"></q-icon>
            </q-item-section>

            <q-item-section>
              Home
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="$router.push({ name: 'CoursePage' })">
            <q-item-section avatar>
              <q-icon name="local_library"></q-icon>
            </q-item-section>

            <q-item-section>
              Kelas
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="$router.push({ name: 'AboutPage' })">
            <q-item-section avatar>
              <q-icon name="info"></q-icon>
            </q-item-section>

            <q-item-section>
              Tentang Kami
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="$router.push({ name: 'ContactPage' })">
            <q-item-section avatar>
              <q-icon name="contacts"></q-icon>
            </q-item-section>

            <q-item-section>
              Kontak
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="$router.push({ name: 'FaqIndexPage' })">
            <q-item-section avatar>
              <q-icon name="quiz"></q-icon>
            </q-item-section>

            <q-item-section>
              FAQ
            </q-item-section>
          </q-item>
          <div v-if="!isAuthenticated()">
            <q-separator></q-separator>
            <q-item clickable v-ripple @click="$router.push({ name: 'SignInPage' })">
              <q-item-section avatar>
                <q-icon name="fa-solid fa-right-to-bracket"></q-icon>
              </q-item-section>

              <q-item-section>
                Login
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="$router.push({ name: 'SignUpPage' })">
              <q-item-section avatar>
                <q-icon name="fa-solid fa-user-plus"></q-icon>
              </q-item-section>

              <q-item-section>
                Daftar
              </q-item-section>
            </q-item>
          </div>
          <div v-else>
            <q-separator></q-separator>
            <q-item clickable v-ripple :to="{ name: 'MyProfileIndexPage' }">
              <q-item-section avatar>
                <q-icon name="manage_accounts"></q-icon>
              </q-item-section>

              <q-item-section>
                Profile saya
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="logout()">
              <q-item-section avatar>
                <q-icon name="logout"></q-icon>
              </q-item-section>

              <q-item-section>
                Logout
              </q-item-section>
            </q-item>

          </div>
        </q-list>
      </q-scroll-area>
      <q-img v-show="isAuthenticated()" class="absolute-top drawer-user-bg" style="height: 150px">
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <q-icon name="fa-solid fa-user"></q-icon>
          </q-avatar>
          <div class="text-weight-bold">{{ getUser.name }}</div>
          <div>{{ getUser.email }}</div>
        </div>
      </q-img>
    </q-drawer>
    <q-page-container>

      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup lang="ts">
import { isAdmin, isAuthenticated } from 'src/composables/auth';
import { ref } from 'vue';
import { useUserStore } from 'src/stores/user';
const tab = ref();

const { getUser, logout, } = useUserStore();
const leftDrawer = ref(true);
const logoutLoading = ref(false);

const handleLogout = async () => {
  try {
    logoutLoading.value = true;
    await logout();
  } catch (error) {
    throw error;
  } finally {
    logoutLoading.value = false;
  }
}
</script>

<style scoped>
.drawer-user-bg {
  background-image: linear-gradient(120deg, #a6c0fe 0%, #f68084 100%);

}
</style>
