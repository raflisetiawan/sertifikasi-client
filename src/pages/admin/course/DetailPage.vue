<template>
  <div id="detail-course-page">
    <q-ajax-bar ref="bar" color="pink-11" position="top" size="5px" skip-hijack />
    <div class="q-pa-md">
      <div class="row justify-center">
        <div class="col-md-8 col-sm-10 col-xs-12">
          <q-img v-show="course.image !== null" :src="`${storageBaseUrl}courses/${course.image}`" loading="eager"
            spinner-color="white" style="height: 140px; max-width: 150px" />
        </div>
      </div>
      <div class="row q-mt-md">
        <div class="col-md-2 col-sm-4 col-xs-4">
          <div class="text-subtitle1">Nama Kelas: </div>
        </div>
        <div class="col-md-10 col-sm-8 col-xs-8">
          <div class="text-subtitle1">{{ course.name }}</div>
        </div>
      </div>
      <div class="row q-mt-md">
        <div class="col-md-2 col-sm-4 col-xs-4">
          <div class="text-subtitle1">Deskripsi: </div>
        </div>
        <div class="col-md-10 col-sm-8 col-xs-8">
          <div v-html="course.description"></div>
        </div>
      </div>
      <div class="row q-mt-md">
        <div class="col-md-2 col-sm-4 col-xs-4">
          <div class="text-subtitle1">Fasilitas: </div>
        </div>
        <div class="col-md-10 col-sm-8 col-xs-8">
          <div class="text-body1 ">{{ course.facility }}</div>
        </div>
      </div>
      <div class="row q-mt-md">
        <div class="col-md-2 col-sm-4 col-xs-4">
          <div class="text-subtitle1">Waktu: </div>
        </div>
        <div class="col-md-10 col-sm-8 col-xs-8">
          <div class="text-body1 ">{{ useFormatOperational(course.operational_start) }} - {{
            useFormatOperational(course.operational_end) }}</div>
        </div>
      </div>
      <div class="row q-mt-md">
        <div class="col-md-2 col-sm-4 col-xs-4">
          <div class="text-subtitle1">Tempat: </div>
        </div>
        <div class="col-md-10 col-sm-8 col-xs-8">
          <div class="text-body1 ">{{ course.place }}</div>
        </div>
      </div>
      <div class="row q-mt-md">
        <div class="col-md-2 col-sm-4 col-xs-4">
          <div class="text-subtitle1">Durasi: </div>
        </div>
        <div class="col-md-10 col-sm-8 col-xs-8">
          <div class="text-body1 ">{{ course.time }}</div>
        </div>
      </div>
      <div class="row q-mt-md">
        <div class="col-md-2 col-sm-4 col-xs-4">
          <div class="text-subtitle1">Harga: </div>
        </div>
        <div class="col-md-10 col-sm-8 col-xs-8">
          <div class="text-body1 ">Rp.{{ course.price }}</div>
        </div>
      </div>
      <div class="row q-mt-md">
        <div class="col-md-2 col-sm-4 col-xs-4">
          <div class="text-subtitle1">Di buat pada: </div>
        </div>
        <div class="col-md-10 col-sm-8 col-xs-8">
          <div class="text-body1 ">{{ formatCreatedUpdatedAt(course.created_at) }}</div>
        </div>
      </div>
      <div class="row q-mt-md">
        <div class="col-md-2 col-sm-4 col-xs-4">
          <div class="text-subtitle1">Terakhir di ubah: </div>
        </div>
        <div class="col-md-10 col-sm-8 col-xs-8">
          <div class="text-body1 ">{{ formatCreatedUpdatedAt(course.updated_at) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storageBaseUrl } from 'src/boot/axios';
import { Courses } from 'src/models/course';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { date } from 'quasar'
import { useMetaTitle } from 'src/composables/meta';
import { useFormatOperational } from 'src/composables/format'
import { useCourseStore } from 'src/stores/course';

const { params: routeParams } = useRoute();
const bar = ref();
const loadData = ref(false);
useMetaTitle('Detail Kelas - Admin')
const { showCourse } = useCourseStore()

const course = ref<Courses>({
  name: '',
  description: '',
  facility: '',
  id: 0,
  image: null,
  operational_start: '',
  operational_end: '',
  place: '',
  price: 0,
  time: '',
  created_at: undefined
});
onMounted(async () => {
  try {
    bar.value.start();
    loadData.value = true;
    await getData();
  } catch (error) {
    throw error;
  } finally {
    loadData.value = false;
    bar.value.stop();
  }
})

const getData = async () => {
  const response = await showCourse(routeParams.id)

  course.value = response.data;
}


const formatCreatedUpdatedAt = (data: Date | undefined) => {
  return date.formatDate(data, 'dddd MMMM YYYY HH:mm A')
}
</script>

<style scoped></style>
