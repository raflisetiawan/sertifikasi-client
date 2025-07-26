<template>
  <q-no-ssr>
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
            <q-item clickable v-ripple :to="{ name: 'HomePage' }">
              <q-item-section avatar>
                <q-icon name="home"></q-icon>
              </q-item-section>

              <q-item-section>
                Home
              </q-item-section>
            </q-item>
          </q-list>
          <q-separator />
          <q-list padding>
            <q-item clickable v-ripple :to="{ name: 'AdminPage' }">
              <q-item-section avatar>
                <q-icon name="dashboard"></q-icon>
              </q-item-section>
              <q-item-section>
                Dashboard
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple :to="{ name: 'AdminCoursePage' }">
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
            <q-item clickable v-ripple @click="$router.push({ name: 'AdminEnrollmentReviewPage' })">
              <q-item-section avatar>
                <q-icon name="rate_review"></q-icon>
              </q-item-section>

              <q-item-section>
                Review Pendaftaran
              </q-item-section>
            </q-item>
          </q-list>
          <q-list padding>
            <q-item clickable v-ripple @click="$router.push({ name: 'AdminLiveSessionPage' })">
              <q-item-section avatar>
                <q-icon name="live_tv"></q-icon>
              </q-item-section>

              <q-item-section>
                Live Session
              </q-item-section>
            </q-item>
          </q-list>
          <q-list padding>
            <q-item clickable v-ripple :to="{ name: 'AdminForumIndexPage' }">
              <q-item-section avatar>
                <q-icon name="forum"></q-icon>
              </q-item-section>

              <q-item-section>
                Manage Forum
              </q-item-section>
            </q-item>
          </q-list>
          <q-separator />
          <q-list padding>
            <q-item clickable v-ripple :to="{ name: 'FaqAdminIndexPage' }">
              <q-item-section avatar>
                <q-icon name="quiz"></q-icon>
              </q-item-section>
              <q-item-section>
                Manage FAQ
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple :to="{ name: 'AdminHelpCenterQuestionsPage' }">
              <q-item-section avatar>
                <q-icon name="help"></q-icon>
              </q-item-section>
              <q-item-section>
                Help Center
              </q-item-section>
            </q-item>
          </q-list>
          <q-list padding>
            <q-item clickable v-ripple :to="{ name: 'TrainerAdminIndexPage' }">
              <q-item-section avatar>
                <q-icon name="person"></q-icon>
              </q-item-section>
              <q-item-section>
                Manage Trainer
              </q-item-section>
            </q-item>
          </q-list>
          <q-separator />
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
  </q-no-ssr>
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
