<template>
  <q-page padding>
    <div class="text-h4 q-mb-md">Detail Kursus</div>
    <p>Detail kursus (nama, deskripsi, gambar) tidak tersedia dari endpoint ini. Hanya modul yang ditampilkan.</p>

    <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify"
      narrow-indicator>
      <q-tab name="modules" label="Modul Kursus" />
      <q-tab name="enrollments" label="Siswa Terdaftar" />
      <q-tab name="forum" label="Forum" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="modules">
        <div v-if="courseModulesList.length > 0">
          <q-list bordered separator class="q-mt-lg">
            <q-item-label header>Modul Kursus</q-item-label>
            <q-item v-for="module in courseModulesList" :key="module.id" clickable v-ripple
              :to="{ name: 'TrainerModuleDetail', params: { moduleId: module.id } }">
              <q-item-section avatar>
                <q-icon name="topic" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ module.title }}</q-item-label>
                <q-item-label caption>{{ module.subtitle }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge color="primary">{{ module.type }}</q-badge>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <div v-else>
          <q-spinner-dots size="lg" color="primary" />
          <p>Memuat modul kursus...</p>
        </div>
      </q-tab-panel>

      <q-tab-panel name="enrollments">
        <div v-if="courseEnrollments.length > 0">
          <q-list bordered separator class="q-mt-lg">
            <q-item-label header>Daftar Siswa</q-item-label>
            <q-item v-for="enrollment in courseEnrollments" :key="enrollment.id" clickable v-ripple
              :to="{ name: 'TrainerStudentProgress', params: { enrollmentId: enrollment.id } }">
              <q-item-section avatar>
                <q-avatar>
                  <img :src="enrollment.user.image || 'https://cdn.quasar.dev/img/avatar.png'">
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ enrollment.user.name }}</q-item-label>
                <q-item-label caption>{{ enrollment.user.email }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge :color="enrollment.status === 'completed' ? 'positive' : 'info'">{{ enrollment.status
                }}</q-badge>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <div v-else>
          <q-spinner-dots size="lg" color="primary" />
          <p>Memuat daftar siswa...</p>
        </div>
      </q-tab-panel>

      <q-tab-panel name="forum">
        <div class="q-mt-md">
          <q-btn color="primary" label="Lihat Forum Kursus"
            :to="{ name: 'TrainerCourseForum', params: { courseId: route.params.courseId } }" />
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTrainerCourseStore } from 'src/stores/trainerCourse';
import { useMetaTitle } from 'src/composables/meta';
import { storeToRefs } from 'pinia';

useMetaTitle('Detail Kursus - Trainer');

const route = useRoute();
const trainerCourseStore = useTrainerCourseStore();
const tab = ref('modules'); // Default tab

// Destructure state properties to maintain reactivity
const { courseModulesList, courseEnrollments } = storeToRefs(trainerCourseStore);

onMounted(async () => {
  const courseId = parseInt(route.params.courseId as string);
  if (!isNaN(courseId)) {
    await trainerCourseStore.getCourseModules(courseId);
    await trainerCourseStore.getCourseEnrollments(courseId);
  }
});
</script>
