<template>
  <div id="course-card" class="q-pa-md">
    <div class="row justify-around">
      <div v-if="!courseState.courses || courseState.courses.length === 0" class="text-center q-pa-xl">
        <q-icon name="sentiment_dissatisfied" size="3em" color="grey" />
        <div class="text-h6 text-grey">Kursus tidak ditemukan</div>
      </div>
      <div class="col-md-3 col-sm-4 col-xs-10 q-px-md" v-for="course in courseState.courses" :key="course.id">
        <q-card class="my-card q-ma-md cursor-pointer" bordered
          @click="$router.push({ name: 'courses.show', params: { id: course.id } })">
          <q-img :src="`${storageBaseUrl}courses/${course.image}`" fit="cover" :ratio="4 / 3" />

          <q-card-section>
            <div class="text-h6 q-mt-sm q-mb-xs">{{ course.name }}</div>
            <div class="text-caption text-grey3">
              {{ useFormatDateRange(course.operational_start, course.operational_end) }}
            </div>
            <div class="text-overline text-primary text-weight-bold">
              <template v-if="Number(course.price) === 0">Gratis</template>
              <template v-else>{{ formatPrice(Number(course.price)) }}</template>
            </div>
          </q-card-section>
          <q-card-actions>
            <q-btn color="primary" label="Lihat Detail" :to="{ name: 'courses.show', params: { id: course.id } }" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storageBaseUrl } from 'src/boot/axios';
import { useFormatDateRange } from 'src/composables/format/index'
import { useFormatters } from 'src/composables/useFormatters';
import { useCourseStore } from 'src/stores/course';

const { setCourses, $state: courseState } = useCourseStore();
const { formatPrice } = useFormatters();


if (!courseState.courses) {
  try {
    await setCourses()
  } catch (error) {
    throw error;
  }
}


</script>

<style scoped></style>
