<template>
  <div>
    <div class="row">
      <div class="col-md-6 col-sm-0 col-xs-0" v-if="$q.screen.gt.sm">
        <div class="row justify-center items-center bg-primary left-side" style="height: 100vh;">
          <div class="text-white text-h4">Selamat Datang di Aplikasi Kami!</div>
          <div class="text-white">Temukan berbagai fitur dan layanan menarik yang kami sediakan.</div>
        </div>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style>
.left-side {
  overflow: hidden;
}
</style>
