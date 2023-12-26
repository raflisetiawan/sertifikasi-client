<template>
  <div id="footer-home" class="bg-primary q-mt-xl">
    <div class="container q-pa-md">
      <div class="row justify-around">
        <div class="col-md-4 col-sm-8 col-xs-10">
          <div class="row">
            <div class="col-12">
              <q-btn flat dense icon="fa-solid fa-envelope" color="white"> <span class="q-ml-md">Email</span></q-btn>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <q-btn flat dense icon="fa-brands fa-instagram" color="white"><span class="q-ml-md">Instagram</span></q-btn>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <q-btn flat dense icon="fa-brands fa-whatsapp" color="white"><span class="q-ml-md">Whatsapp</span></q-btn>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <q-btn flat dense icon="fa-brands fa-tiktok" color="white"><span class="q-ml-md">Tiktok</span></q-btn>
              <q-separator v-show="$q.screen.lt.md" class="q-my-md" color="white"></q-separator>
            </div>
          </div>
        </div>

        <div class="col-md-4 col-sm-8 col-xs-10 text-white">
          <div class="row">
            <q-btn dense flat icon="fa-solid fa-house" :to="{ name: 'HomePage' }"><span
                class="q-ml-md">Home</span></q-btn>
          </div>
          <div class="row">
            <q-btn dense flat icon="local_library" :to="{ name: 'CoursePage' }"><span class="q-ml-md">Kelas</span></q-btn>
          </div>
          <div class="row">
            <q-btn dense flat icon="info" :to="{ name: 'AboutPage' }"><span class="q-ml-md">Tentang Kami</span></q-btn>
          </div>
          <div class="row">
            <q-btn dense flat icon="contacts" :to="{ name: 'ContactPage' }"><span class="q-ml-md">Kontak</span></q-btn>
          </div>
          <q-separator v-show="$q.screen.lt.md" class="q-my-md" color="white"></q-separator>
        </div>
        <div class="col-md-4 col-sm-8 col-xs-10 text-white">
          <div class="text-h6">Office: </div>
          <div class="text-body1">Kompleks PT. Semen Indonesia (Persero) Tbk, Jl. Veteran, Kb. Dalem, Sidomoro, Kebomas,
            Gresik Regency, East Java 61122</div>
          <q-separator v-show="$q.screen.lt.md" class="q-my-md" color="white"></q-separator>
        </div>

      </div>
      <div class="row">
        <div class="col-12 text-center">
          <div class="text-overline text-white">&copy; Copyright, All right reserved</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped></style>
