<template>
  <div id="detail-course-user">
    <div class="q-pa-md">
      <div class="row">
        <div class="col-12 banner">
          <div class="row justify-between items-center full-height q-pa-md">
            <div class="col-4">
              <q-skeleton type="text"></q-skeleton>
            </div>
            <div class="col-4">
              <q-skeleton height="200px" square />
            </div>
          </div>
        </div>
      </div>
      <div class="row q-mt-lg justify-around">
        <div class="col-md-2 col-sm-3 col-xs-4">
          <div class="text-h6">Penjelasan</div>
        </div>
        <div class="col-md-10 col-sm-9 col-xs-8">
          <div class="text-body1"> <q-skeleton type="text"></q-skeleton>
          </div>
        </div>
      </div>
      <div class="row q-mt-lg justify-around">
        <div class="col-md-2 col-sm-3 col-xs-4">
          <div class="text-h6">Fasilitas</div>
        </div>
        <div class="col-md-10 col-sm-9 col-xs-8">
          <div class="text-body1"> <q-skeleton type="text"></q-skeleton>
          </div>
        </div>
      </div>
      <div class="row q-mt-lg justify-around">
        <div class="col-md-2 col-sm-3 col-xs-4">
          <div class="text-h6">Tempat</div>
        </div>
        <div class="col-md-10 col-sm-9 col-xs-8">
          <div class="text-body1"> <q-skeleton type="text"></q-skeleton>
          </div>
        </div>
      </div>
      <div class="row q-mt-lg justify-around">
        <div class="col-md-2 col-sm-3 col-xs-4">
          <div class="text-h6">Waktu pelaksanaan</div>
        </div>
        <div class="col-md-10 col-sm-9 col-xs-8">
          <div class="text-body1"> <q-skeleton type="text"></q-skeleton>
          </div>
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
  background: #cb2d3e;
  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #cb2d3e, #ef473a);
  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #cb2d3e, #ef473a);
  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

}
</style>
