<template>
  <div id="course-page">
    <q-ajax-bar ref="bar" color="pink-11" position="top" size="5px" skip-hijack />
    <div class="banner">
      <q-img src="~/assets/banner-bg-02.jpg" fit="cover" position="center" height="382px">
        <div class="absolute-center bg-transparent">
          <div class="text-h4 text-white text-center">Daftar Kelas</div>
          <q-separator size="5px" class="q-mt-md" color="primary"></q-separator>
          <div class="text-body1 q-mt-md text-center">Daftar kelas yang bisa anda ikuti :</div>
          <div class="row justify-center q-mt-md">
            <q-btn outline color="white" :to="{ name: 'ContactPage' }">Contact Us</q-btn>
          </div>
        </div>
      </q-img>
    </div>
    <div class="container q-pa-md">
      <Suspense>
        <CourseCard />
        <template #fallback>
          <CourseCardSkeleton />
        </template>
      </Suspense>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMetaTitle } from 'src/composables/meta';
import { defineAsyncComponent, ref } from 'vue';
import CourseCardSkeleton from 'components/user/course/CourseCardSkeleton.vue'

useMetaTitle('Kelas')

const bar = ref();

const CourseCard = defineAsyncComponent(() => import('components/user/course/CourseCard.vue'))

</script>

<style scoped></style>
