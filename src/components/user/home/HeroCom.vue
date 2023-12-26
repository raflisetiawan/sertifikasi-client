<template>
  <div>
    <q-img loading="lazy" id="hero" src="~/assets/Selamat datang.svg">
      <div :class="$q.screen.lt.sm ? 'q-mt-xl absolute-full flex flex-center' : 'absolute-full flex flex-center'">
        <div class="container">
          <div class="row ">
            <div class="col-12">
              <div class="text-h4 text-center">
                UISI Digiclass, Pelatihan Online
                Bersertifikasi !
              </div>
            </div>
          </div>
          <div class="row q-mt-xl">
            <div class="col-12">
              <div class="text-h5 text-center">
                Kini saatnya mengembangkan kompetensi kerja dan usaha lebih maksimal bersama
              </div>
            </div>
          </div>
          <div class="row text-center q-mt-xl ">
            <div class="col-12 q-mb-xl">
              <q-btn size="lg" outline class="q-mt-xl" :to="{ name: 'CoursePage' }">Lihat Kelas</q-btn>
            </div>
          </div>
        </div>
      </div>
    </q-img>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
#hero {
  height: 93dvh;
}

.absolute-full {
  /* background-color: none; */
  background: none;
}
</style>
