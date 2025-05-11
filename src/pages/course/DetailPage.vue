<template>
  <div>
    <template v-if="isLoading">
      <DetailComponentSkeleton />
      <KeyConceptSectionSkeleton />
    </template>
    <template v-else>
      <DetailComponent :course="course" />
      <KeyConceptSection :course="course" />
      <FacilitySection :course="course" />
    </template>

    <!-- course benefit -->
    <Suspense>
      <CertifiacateExampleImage />
      <template #fallback>
        Loading...
      </template>
    </Suspense>

    <!-- Course File -->
    <CourseFilesSection :course="course" />

    <!-- module -->
    <Suspense>
      <ModuleExpansionItem />
      <template #fallback>
        <ModuleExpansionItemSkeleton />
      </template>
    </Suspense>

    <!-- trainers -->
    <template v-if="!isLoading">
      <TrainerSection :course="course" />
    </template>
    <template v-else>
      Loading...
    </template>

    <!-- related courses -->
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
    <FooterCom />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { Courses } from 'src/models/course';
import { useCourseStore } from 'src/stores/course';
import { defineAsyncComponent, ref, watchEffect } from 'vue';
import FooterCom from 'src/components/user/home/FooterCom.vue';
import KeyConceptSection from 'src/components/user/course/detail/KeyConceptSection.vue';
import CourseCardSkeleton from 'src/components/user/course/CourseCardSkeleton.vue';
import DetailComponentSkeleton from 'src/components/user/course/detail/DetailComponentSkeleton.vue';
import KeyConceptSectionSkeleton from 'src/components/user/course/detail/KeyConceptSectionSkeleton.vue';
import ModuleExpansionItemSkeleton from 'src/components/user/course/detail/ModuleExpansionItemSkeleton.vue';
import TrainerSection from 'src/components/user/course/detail/TrainerSection.vue';
import CourseFilesSection from 'src/components/user/course/detail/CourseFilesSection.vue';
import FacilitySection from 'src/components/user/course/detail/FacilitySection.vue';

const CertifiacateExampleImage = defineAsyncComponent(() => import('components/user/course/detail/CertifiacateExampleImage.vue'));
const RelatedCourseComponent = defineAsyncComponent(() => import('components/user/course/detail/RelatedCourseComponent.vue'));
const ModuleExpansionItem = defineAsyncComponent(() => import('components/user/course/detail/ModuleExpansionItem.vue'));
const DetailComponent = defineAsyncComponent({
  loader: () => import('components/user/course/detail/DetailComponent.vue'),
});

const { params: routeParams } = useRoute();
const { showCourse } = useCourseStore();
const course = ref<Courses | null>(null);
const isLoading = ref(true);

const listenRefreshCourseDetail = async (id: number) => {
  isLoading.value = true;
  const response = await showCourse(id);
  course.value = response.data;
  isLoading.value = false;
};

watchEffect(async () => {
  isLoading.value = true;
  const response = await showCourse(routeParams.id);
  course.value = response.data;
  isLoading.value = false;
});
</script>

<style scoped></style>
