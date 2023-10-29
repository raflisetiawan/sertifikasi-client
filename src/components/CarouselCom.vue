<template>
  <div>
    <q-carousel arrows animated infinite swipeable navigation autoplay v-model="slide" height="93dvh"
      control-color="primary">
      <q-carousel-slide name="first" img-src="../assets/banner-bg-01.jpg">
        <div class="absolute-center custom-caption">
          <div class="text-h2 text-primary">Selamat Datang</div>
          <div class="text-subtitle1 text-dark text-grey-14">Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Quasi atque
            voluptatibus
            laboriosam libero eveniet accusantium.</div>
        </div>
      </q-carousel-slide>
      <q-carousel-slide name="second" img-src="../assets/banner-bg-01.jpg">
        <div class="absolute-center custom-caption">
          <div class="text-h2 text-primary">Pelatihan</div>
          <div class="text-subtitle1 text-dark text-grey-14">Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Quasi atque
            voluptatibus
            laboriosam libero eveniet accusantium.</div>
        </div>
      </q-carousel-slide>
      <q-carousel-slide name="three" img-src="../assets/banner-bg-01.jpg">
        <div class="absolute-center custom-caption">
          <div class="text-h2 text-primary">Selamat Datang</div>
          <div class="text-subtitle1 text-dark text-grey-14">Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Quasi atque
            voluptatibus
            laboriosam libero eveniet accusantium.</div>
        </div>
      </q-carousel-slide>
    </q-carousel>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const slide = ref('first');
</script>

<style scoped></style>
