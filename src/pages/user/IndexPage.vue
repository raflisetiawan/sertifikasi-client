<template>
  <div>
    <CarouselCom />
    <CourseTitle />
    <Suspense>
      <CourseCard />
      <template #fallback>
        <CourseCardSkeleton />
      </template>
    </Suspense>
    <SeeMore />
    <TrainerCard />
    <PartnerCom />
    <FooterCom />
  </div>
</template>

<script setup lang="ts">
import CarouselCom from 'components/user/home/CarouselCom.vue';
import TrainerCard from 'components/user/home/TrainerCard.vue';
import PartnerCom from 'components/user/home/PartnerCom.vue';
import FooterCom from 'components/user/home/FooterCom.vue';
import CourseTitle from 'components/user/course/CourseTitle.vue';
import SeeMore from 'src/components/user/course/SeeMore.vue';
import { useMetaTitle } from 'src/composables/meta';
import { defineAsyncComponent } from 'vue';
import CourseCardSkeleton from 'components/user/course/CourseCardSkeleton.vue';

const CourseCard = defineAsyncComponent(
  () => import('components/user/course/CourseCard.vue')
);

useMetaTitle('Home');
</script>

<style scoped></style>
