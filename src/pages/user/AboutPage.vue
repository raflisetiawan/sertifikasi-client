<template>
  <div id="aboutus">
    <div class="container flex q-pa-md">
      <div class="row justify-center items-center full-width">
        <div class="col-md-5 col-sm-8 col-xs-10">
          <div class="text-h3 text-primary">About Us</div>
          <q-separator color="primary" size="5px" style="width: 200px" class="q-mb-md"></q-separator>
          <div class="text-body2">Universitas Internasional Semen Indonesia merupakan salah satu perintis universitas
            berbasis korporasi yang menerapkan Laboratory Based Education (LBE) sesungguhnya.
            UISI Digiclass hadir sebagai platform online sebagai solusi untuk meningkatkan daya saing akselerasi dan
            pengembangan kompetensi mahasiswa pada khususnya, dan masyarakat pada umumnya. Output yang diharapkan adalah
            peserta mendapatkan pengetahuan serta skill tambahan yang tersertifikasi institusi maupun negara melalui
            sertifikasi BNSP sehingga membantu dalam mendapatkan pekerjaan, menaikkan income atau bahkan memulai usaha
            secara profesional.
          </div>
        </div>
        <div class="col-md-6 col-sm-8 col-xs-10">
          <img src="~/assets/banner-img-02.svg" alt="banner">
        </div>
      </div>
    </div>
    <FooterComVue />
  </div>
</template>

<script setup>
import FooterComVue from 'src/components/user/home/FooterCom.vue';
import { useMetaTitle } from 'src/composables/meta'

useMetaTitle('Tentang Kami');
</script>

<style lang="scss" scoped>
.container {
  height: 90dvh;
}
</style>
