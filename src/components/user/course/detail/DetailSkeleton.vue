<template>
  <div id="detail-course-user">
    <div class="q-pa-md">
      <div class="row">
        <div class="col-12 banner">
          <div class="row justify-between items-center full-height q-pa-md">
            <div class="col-4">
              <q-skeleton height="200px" square />
            </div>
            <div class="col-md-6 text-center">
              <q-skeleton type="text"></q-skeleton>
              <q-skeleton type="text"></q-skeleton>
              <q-skeleton type="text"></q-skeleton>
              <q-skeleton type="text"></q-skeleton>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="text-h5 q-mt-md text-center">Deskripsi Kelas :</div>
    <div class="row q-mt-md justify-center">
      <div class="col-md-6 col-sm-8 col-xs-10">
        <div class="text-body1 text-center">
          <q-skeleton type="text"></q-skeleton>
          <q-skeleton type="text"></q-skeleton>
          <q-skeleton type="text"></q-skeleton>
        </div>
      </div>
    </div>
    <div class="text-h5 q-mt-md text-center">Trainer </div>
    <div class="row justify-center">
      <q-skeleton type="circle" width="150px" height="150px"></q-skeleton>
    </div>
    <div class="row q-mt-md justify-center">
      <div class="col-md-6 col-sm-8 col-xs-10">
        <div class="text-h6 text-center">
          <q-skeleton type="text"></q-skeleton>
        </div>
        <div class="text-overline text-center">
          <q-skeleton type="text"></q-skeleton>
        </div>
        <div class="text-overline text-center">
          <q-skeleton type="text"></q-skeleton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>


<style scoped>
.banner {
  height: 250px;
  border-radius: 5px;
  border: solid 2px grey;

}
</style>
