<template>
  <div id="detail-course-user">
    <div>
      <div class="row q-pa-md">
        <div class="col-12 banner">
          <div class="row justify-between items-center full-height q-pa-md">
            <div class="col-md-4 col-sm-4 col-xs-12">
              <q-img :src="`${storageBaseUrl}courses/${course?.image}`" fit="cover" :ratio="4 / 3" height="200px" />
            </div>
            <div class="col-md-6 col-sm-6 col-xs-12 text-center">
              <div :class="$q.screen.lt.sm ? 'text-h4' : 'text-h3'">{{ course.name }}</div>
              <div class="text-body1">{{ course.description }}</div>
              <div class="text-overline">{{ toRupiah(course.price) }}</div>
              <div class="text-body1">Online Via : {{ course.place }}
                <div class="text-body2">{{ useFormatDateRange(course.operational_start, course.operational_end) }}</div>
                <q-btn color="primary"
                  :to="{ name: 'RegisterCourseUserPage', params: { id: course.id } }">Daftar</q-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Key Concepts Section -->
      <div class="row q-mt-lg justify-center">
        <div class="col-md-2 col-sm-3 col-xs-4">
          <div class="text-h6 text-center">Konsep Utama</div>
        </div>
      </div>
      <div class="row justify-center q-mt-md q-mb-md">
        <div class="col-md-10 col-sm-9 col-xs-8">
          <div class="text-body1" v-html="course?.key_concepts"></div>
        </div>
      </div>

      <!-- Trainers Section -->
      <div class="full-width q-pa-md" style="background-color: rgb(255, 208, 216);">
        <div class="row justify-center">
          <div class="text-h5 q-mt-md text-center">Trainers</div>
        </div>
        <div class="row justify-center">
          <q-separator color="primary" class="text-center" width="300px"></q-separator>
        </div>
        <div class="row q-mt-md justify-center q-gutter-md">
          <div v-for="trainer in course.trainers" :key="trainer.id" class="col-md-4 col-sm-6 col-xs-12">
            <div class="text-center">
              <div style="cursor: pointer;">
                <q-img @click="$router.push({ name: 'TrainerIndexPage', params: { id: trainer.id } })" width="200px"
                  height="200px" style="border-radius: 50%; overflow: hidden; border: solid 1px grey;"
                  :src="trainer.image ? getTrainerImage(trainer.image) : 'path/to/default/image.jpg'">
                </q-img>
                <div @click="$router.push({ name: 'TrainerIndexPage', params: { id: trainer.id } })"
                  class="text-h6 text-center">
                  {{ trainer.name }}
                </div>
              </div>
              <div class="text-overline text-center">
                {{ trainer.qualification }}
              </div>
              <div v-html="trainer.description">
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Course Files Section -->
      <div class="row q-mt-lg justify-around">
        <div class="col-12">
          <div class="row q-gutter-md justify-center">
            <q-btn v-if="course.guidelines" color="primary" icon="picture_as_pdf"
              :href="`${storageBaseUrl}courses/guideline/${course.guidelines}`" target="_blank">
              Guidelines
            </q-btn>
            <q-btn v-if="course.syllabus_path" color="primary" icon="picture_as_pdf"
              :href="`${storageBaseUrl}courses/syllabus/${course.syllabus_path}`" target="_blank">
              Syllabus
            </q-btn>
            <q-btn v-if="course.schedule_path" color="primary" icon="picture_as_pdf"
              :href="`${storageBaseUrl}courses/schedules/${course.schedule_path}`" target="_blank">
              Schedule
            </q-btn>
            <q-btn v-if="course.certificate_example_path" color="primary" icon="image"
              :href="`${storageBaseUrl}courses/certificates/${course.certificate_example_path}`" target="_blank">
              Certificate Example
            </q-btn>
          </div>
        </div>
      </div>

      <div class="q-pa-md">
        <div class="row justify-center">
          <div class="text-h5 q-mt-md text-center ">Kelas Terkait</div>
        </div>
        <div class="row justify-center">
          <q-separator color="secondary" class="text-center" width="300px"></q-separator>
        </div>
        <suspense>
          <RelatedCourseComponent @refreshCourseDetail="(id) => listenRefreshCourseDetail(id)" />
          <template #fallback>
            <CourseCardSkeleton />
          </template>
        </suspense>
      </div>
    </div>
    <FooterCom />
  </div>
</template>

<script setup lang="ts" async>
import { storageBaseUrl } from 'src/boot/axios';
import { useFormatDateRange } from 'src/composables/format';
import { Courses } from 'src/models/course';
import { useCourseStore } from 'src/stores/course';
import { defineAsyncComponent, ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import CourseCardSkeleton from '../CourseCardSkeleton.vue';
import FooterCom from '../../home/FooterCom.vue';
import toRupiah from '@develoka/angka-rupiah-js';

const RelatedCourseComponent = defineAsyncComponent(() => import('components/user/course/detail/RelatedCourseComponent.vue'));
const { params: routeParams } = useRoute();
const { showCourse } = useCourseStore()
const course = ref<Courses>({
  id: 0,
  name: '',
  description: '',
  key_concepts: '',
  facility: '',
  price: 0,
  image: null,
  operational_end: '',
  operational_start: '',
  place: '',
  duration: '',
  status: 'not_started',
  benefit: '',
  guidelines: null,
  syllabus_path: null,
  certificate_example_path: null,
  certificate_template_path: null,
  schedule_path: null,
  trainers: []
})

const response = await showCourse(routeParams.id)
course.value = response.data;

const getTrainerImage = (image: string | File | undefined | null) => {
  return storageBaseUrl + image;
}

watchEffect(async () => {

  const response = await showCourse(routeParams.id)
  course.value = response.data;
})

const listenRefreshCourseDetail = async (id: number) => {
  const response = await showCourse(id);

  course.value = response.data;
}
</script>

<style scoped>
.banner {
  height: 250px;
  border-radius: 5px;
  border: solid 2px #ff4d5f;
}

@media (max-width: 600px) {
  .banner {
    height: 80vh;
  }
}
</style>
