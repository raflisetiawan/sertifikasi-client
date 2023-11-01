<template>
  <div id="Partner" style="overflow: hidden;">
    <div class="row justify-center q-mt-lg q-mb-lg">
      <div class="col-md-4 col-sm-10">
        <div class="text-h4 text-center">Partner</div>
        <q-separator color="grey"></q-separator>
      </div>
    </div>

    <div class="row justify-center q-mt-lg">
      <div class="col-md-11 q-mt-lg">
        <vue-marquee-slider v-if="$q.screen.gt.sm" id="marquee-slider-space" :space="50" autowidth :repeat="10"
          :speed="10000" :width="150">
          <img src="https://app.imgforce.com/images/user/zrC_1622176244_logo-black-120.png" />
          <img src="https://app.imgforce.com/images/user/O1j_1670884991_js-logo.png" />
          <img src="https://app.imgforce.com/images/user/Igx_1670885749_vue-logo.png" />
          <img src="https://app.imgforce.com/images/user/TPs_1670885858_react-logo.png" />
          <img src="https://app.imgforce.com/images/user/jY4_1670885309_angular-logo.png" />
        </vue-marquee-slider>
        <vue-marquee-slider v-else id="marquee-slider-space" :space="50" autowidth :repeat="10" :speed="10000"
          :width="50">
          <img src="https://app.imgforce.com/images/user/zrC_1622176244_logo-black-120.png" />
          <img src="https://app.imgforce.com/images/user/O1j_1670884991_js-logo.png" />
          <img src="https://app.imgforce.com/images/user/Igx_1670885749_vue-logo.png" />
          <img src="https://app.imgforce.com/images/user/TPs_1670885858_react-logo.png" />
          <img src="https://app.imgforce.com/images/user/jY4_1670885309_angular-logo.png" />
        </vue-marquee-slider>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VueMarqueeSlider } from 'vue3-marquee-slider';
import '../../../../node_modules/vue3-marquee-slider/dist/style.css'
</script>

<style scoped></style>
