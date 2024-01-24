<template>
  <div>
    <div class="row">
      <div class="col-md-6 col-sm-0 col-xs-0" v-show="$q.screen.gt.sm">
        <div class="row justify-center items-center left-side" style="height: 100vh;">
          <q-img src="~/assets/login.svg"></q-img>
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
