<template>
  <div>
    <CarouselCom />
    <CourseCard />
    <TrainerCard />
    <PartnerCom />
    <FooterCom />
  </div>
</template>

<script setup lang="ts">
import CarouselCom from 'components/CarouselCom.vue';
import CourseCard from 'components/CourseCard.vue'
import TrainerCard from 'src/components/TrainerCard.vue';
import PartnerCom from 'src/components/PartnerCom.vue';
import FooterCom from 'src/components/FooterCom.vue';
import { useMetaTitle } from 'src/composables/meta';

useMetaTitle('Home')
</script>

<style scoped></style>
