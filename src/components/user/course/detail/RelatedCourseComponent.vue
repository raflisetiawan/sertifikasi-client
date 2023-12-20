<template>
  <div>
    <div class="row q-mt-md justify-center">
      <div class="col-md-3 col-sm-6 col-xs-10" v-for="course in courses" :key="course.id">
        <q-card class="my-card q-ma-md">
          <q-img :src="`${storageBaseUrl}courses/${course.image}`" fit="cover" :ratio="4 / 3" />

          <q-card-section>
            <div class="text-h6 q-mt-sm q-mb-xs">{{ course.name }}</div>
            <div class="text-caption text-grey3">
              {{ new Date(course.operational_start).getDate() }} - {{ useFormatOperationalEnd(course.operational_end) }}
            </div>
            <div class="text-overline text-grey3">
              Rp.{{ useRemoveDecimal(Number(course.price), 2) }}
            </div>
          </q-card-section>
          <q-card-actions>
            <q-btn color="primary" @click="$emit('refreshCourseDetail', course.id)" label="Ikuti"
              :to="{ name: 'DetailCourseUserPage', params: { id: course.id } }" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" async>
import { api, storageBaseUrl } from 'src/boot/axios';
import { useFormatOperationalEnd, useRemoveDecimal } from 'src/composables/format';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const courses = ref();

const response = await api.get(`courses/${route.params.id}/related`)
courses.value = response.data.data;


</script>

<style scoped></style>
