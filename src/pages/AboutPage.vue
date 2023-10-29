<template>
  <div id="aboutus">
    <div class="container flex q-pa-md">
      <div class="row justify-center items-center full-width">
        <div class="col-md-5 col-sm-8 col-xs-10">
          <div class="text-h3 text-primary">About Us</div>
          <q-separator color="primary" size="5px" style="width: 200px"></q-separator>
          <div class="text-body2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos nostrum reprehenderit
            dignissimos quas in pariatur dolorem sunt placeat illum quia! Quam facilis expedita inventore iusto.</div>
        </div>
        <div class="col-md-6 col-sm-8 col-xs-10">
          <img src="../assets/banner-img-02.svg" alt="banner">
        </div>
      </div>
    </div>
    <FooterComVue />
  </div>
</template>

<script setup>
import FooterComVue from 'src/components/FooterCom.vue';
import { useMetaTitle } from 'src/composables/meta'

useMetaTitle('Tentang Kami');
</script>

<style lang="scss" scoped>
.container {
  height: 90dvh;
}
</style>
