<template>
  <q-page padding>
    <div class="text-h4 q-mb-md">Kursus Saya</div>

    <div v-if="trainerCourseStore.trainerCourses.length === 0">
      <q-card class="q-pa-md text-center">
        <q-card-section>
          <q-icon name="sentiment_dissatisfied" size="xl" color="grey" />
          <div class="text-h6 text-grey-7 q-mt-md">Belum ada kursus yang Anda ampu.</div>
        </q-card-section>
      </q-card>
    </div>

    <div v-else class="row q-col-gutter-md">
      <div class="col-xs-12 col-sm-6 col-md-4" v-for="course in trainerCourseStore.trainerCourses" :key="course.id">
        <q-card class="my-card">
          <q-img :src="course.image || 'https://via.placeholder.com/400x200'" :ratio="16 / 9" />

          <q-card-section>
            <div class="text-h6">{{ course.name }}</div>
            <div class="text-subtitle2 text-grey-8 q-mt-sm">
              <q-icon name="menu_book" class="q-mr-xs" />{{ course.modules_count }} Modul
            </div>
            <div class="text-subtitle2 text-grey-8">
              <q-icon name="group" class="q-mr-xs" />{{ course.enrollments_count }} Siswa Terdaftar
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Lihat Detail" color="primary" :to="{ name: 'TrainerCourseDetail', params: { courseId: course.id } }" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useTrainerCourseStore } from 'src/stores/trainerCourse';
import { useMetaTitle } from 'src/composables/meta';

useMetaTitle('Kursus Saya - Trainer');

const trainerCourseStore = useTrainerCourseStore();

onMounted(async () => {
  await trainerCourseStore.getTrainerCourses();
});
</script>

<style scoped>
.my-card {
  width: 100%;
  max-width: 350px;
}
</style>
