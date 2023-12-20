<template>
  <div id="detail-course-user">
    <div>
      <div class="row q-pa-md">
        <div class="col-12 banner">
          <div class="row justify-between items-center full-height q-pa-md">
            <div class="col-4">
              <q-img :src="`${storageBaseUrl}courses/${course?.image}`" fit="cover" :ratio="4 / 3" height="200px" />
            </div>
            <div class="col-md-6 text-center">
              <div class="text-h3">{{ course.name }}</div>
              <div class="text-overline">Rp.{{ course.price }}</div>
              <div class="text-body1">Online Via : {{ course.place }}
                <div class="text-body2">{{
                  new Date(course?.operational_start).getDate() }} - {{
    useFormatOperationalEnd(course?.operational_end) }}</div>
                <q-btn color="primary" :to="{ name: 'RegisterCourseUserPage', params: { id: course.id } }">Daftar</q-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="q-pa-md">
        <div class="row justify-center">
          <div class="text-h5 q-mt-md text-center ">Deskripsi Kelas</div>
        </div>
        <div class="row justify-center">
          <q-separator color="secondary" class="text-center" width="300px"></q-separator>
        </div>
        <div class="row q-mt-md ">
          <div class="col-12">
            <div v-html="course.description">
            </div>
          </div>
        </div>
      </div>
      <div class="full-width q-pa-md" style="background-color: rgb(255, 208, 216);">
        <div class="row justify-center">
          <div class="text-h5 q-mt-md text-center ">Trainer</div>
        </div>
        <div class="row justify-center">
          <q-separator color="primary" class="text-center" width="300px"></q-separator>
        </div>
        <div class="row q-mt-md justify-center">
          <div class="col-md-6 col-sm-8 col-xs-10">
            <div v-if="course.trainer?.image" class="text-center">
              <div style="cursor: pointer;">
                <q-img @click="$router.push({ name: 'TrainerIndexPage', params: { id: course.trainer.id } })"
                  width="200px" height="200px" style="border-radius: 50%; overflow: hidden; border: solid 1px grey;"
                  :src="getTrainerImage(course.trainer?.image)"></q-img>
                <div @click="$router.push({ name: 'TrainerIndexPage', params: { id: course.trainer.id } })"
                  class="text-h6 text-center">
                  {{ course.trainer.name }}
                </div>
              </div>
              <div class="text-overline text-center">
                {{ course.trainer.qualification }}
              </div>
              <div v-html="course.trainer.description">
              </div>
            </div>
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
import { useFormatOperationalEnd } from 'src/composables/format';
import { Courses } from 'src/models/course';
import { useCourseStore } from 'src/stores/course';
import { defineAsyncComponent, ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import CourseCardSkeleton from '../CourseCardSkeleton.vue';
import FooterCom from '../../home/FooterCom.vue';

const RelatedCourseComponent = defineAsyncComponent(() => import('components/user/course/detail/RelatedCourseComponent.vue'));
const { params: routeParams } = useRoute();
const { showCourse } = useCourseStore()
const course = ref<Courses>({
  name: '',
  description: '',
  facility: '',
  image: null,
  operational_end: '2023/02/02',
  operational_start: '2023/02/02',
  place: '',
  price: 0,
  time: '',
  id: 0
})

const response = await showCourse(routeParams.id)
course.value = response.data;

const getTrainerImage = (image: string | undefined | File) => {
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
</style>
