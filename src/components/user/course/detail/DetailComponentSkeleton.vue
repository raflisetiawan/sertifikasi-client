<template>
  <div id="detail-course-skeleton">
    <div class="row q-pa-md">
      <div class="col-12 banner-skeleton">
        <div class="row justify-between items-center full-height q-pa-md">
          <div class="col-md-4 col-sm-4 col-xs-12">
            <q-skeleton type="rect" width="100%" height="200px" />
          </div>
          <div class="col-md-6 col-sm-6 col-xs-12 text-center">
            <q-skeleton type="text" class="q-mb-sm" />
            <q-skeleton type="text" width="75%" class="q-mb-sm" />
            <q-skeleton type="text" width="50%" class="q-mb-sm" />
            <q-skeleton type="rect" width="120px" height="40px" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.banner-skeleton {
  height: 250px;
  border-radius: 5px;
  border: solid 2px #e0e0e0;
  background-color: #f5f5f5;
}

@media (max-width: 600px) {
  .banner-skeleton {
    height: 80vh;
  }
}
</style>
