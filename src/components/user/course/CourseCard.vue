<template>
  <div id="course-card" class="q-pa-md">
    <div class="row justify-around">
      <div class="col-md-3 col-sm-4 col-xs-10 q-px-md" v-for="course in courseState.courses" :key="course.id">
        <q-card class="my-card q-ma-md" bordered>
          <q-img :src="`${storageBaseUrl}courses/${course.image}`" fit="cover" :ratio="4 / 3" />

          <q-card-section>
            <div class="text-h6 q-mt-sm q-mb-xs">{{ course.name }}</div>
            <div class="text-caption text-grey3">
              {{ new Date(course.operational_start).getDate() }} - {{ useFormatOperationalEnd(course.operational_end) }}
            </div>
            <div class="text-overline text-grey3" v-if="courseState">
              Rp.{{ useRemoveDecimal(Number(course.price), 2) }}
            </div>
          </q-card-section>
          <q-card-actions>
            <q-btn color="primary" label="Ikuti" :to="{ name: 'DetailCourseUserPage', params: { id: course.id } }" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" async>
import { storageBaseUrl } from 'src/boot/axios';
import { useFormatOperationalEnd, useRemoveDecimal } from 'src/composables/format';
import { useCourseStore } from 'src/stores/course';

const { setCourses, $state: courseState } = useCourseStore();

if (!courseState.courses) {
  try {
    await setCourses()
  } catch (error) {
    throw error;
  }
}
</script>

<style scoped></style>
