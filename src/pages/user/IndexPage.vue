<template>
  <div>
    <!-- <CarouselCom /> -->
    <HeroCom />
    <CourseTitle />
    <Suspense>
      <CourseCard />
      <template #fallback>
        <CourseCardSkeleton />
      </template>
    </Suspense>
    <SeeMore />
    <Suspense>
      <TrainerCard />
      <template #fallback>
        <TrainerSkeletonVue />
      </template>
    </Suspense>
    <!-- <PartnerCom /> -->
    <FooterCom />
  </div>
</template>

<script setup lang="ts">
// import CarouselCom from 'components/user/home/CarouselCom.vue';
// import PartnerCom from 'components/user/home/PartnerCom.vue';
import FooterCom from 'components/user/home/FooterCom.vue';
import CourseTitle from 'components/user/course/CourseTitle.vue';
import SeeMore from 'src/components/user/course/SeeMore.vue';
import { useMetaTitle } from 'src/composables/meta';
import { defineAsyncComponent } from 'vue';
import CourseCardSkeleton from 'components/user/course/CourseCardSkeleton.vue';
import TrainerSkeletonVue from 'src/components/user/home/TrainerSkeleton.vue';
import HeroCom from 'src/components/user/home/HeroCom.vue';

const CourseCard = defineAsyncComponent(
  () => import('components/user/course/CourseCard.vue')
);

const TrainerCard = defineAsyncComponent(() => import('components/user/home/TrainerCard.vue'))

useMetaTitle('Home');
</script>

<style scoped></style>
