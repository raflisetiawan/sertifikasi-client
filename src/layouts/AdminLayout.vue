<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-btn flat :to="{ name: 'AdminPage' }">
            Admin
          </q-btn>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-scroll-area style="height: calc(100% - 150px);  border-right: 1px solid #ddd">
        <q-list padding>
          <q-item clickable v-ripple @click="$router.push({ name: 'HomePage' })">
            <q-item-section avatar>
              <q-icon name="home"></q-icon>
            </q-item-section>

            <q-item-section>
              Home
            </q-item-section>
          </q-item>
        </q-list>
        <q-list padding>
          <q-item clickable v-ripple @click="$router.push({ name: 'AdminCoursePage' })">
            <q-item-section avatar>
              <q-icon name="local_library"></q-icon>
            </q-item-section>

            <q-item-section>
              Manage Kelas
            </q-item-section>
          </q-item>
        </q-list>
        <q-list padding>
          <q-item clickable v-ripple @click="$router.push({ name: 'CourseRegistrantIndexPage' })">
            <q-item-section avatar>
              <q-icon name="group"></q-icon>
            </q-item-section>

            <q-item-section>
              Pendaftar Kelas
            </q-item-section>
          </q-item>
        </q-list>
        <q-list padding>
          <q-item clickable v-ripple @click="logout">
            <q-item-section avatar>
              <q-icon name="logout"></q-icon>
            </q-item-section>

            <q-item-section>
              Logout
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from 'src/stores/user';
const { logout } = useUserStore();

const leftDrawerOpen = ref(false)
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

</script>
