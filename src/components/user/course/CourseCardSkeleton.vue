<template>
  <div>
    <div class="row justify-around">
      <div class="col-md-3 col-sm-4 col-xs-10 q-px-md" v-for="(index) in skeletonCount" :key="index">
        <q-card class="my-card q-ma-md" bordered>
          <q-skeleton height="200px" square />
          <q-item>
            <q-item-section>
              <q-item-label>
                <q-skeleton type="text" />
              </q-item-label>
              <q-item-label caption>
                <q-skeleton type="text" />
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-card-actions align="left" class="q-gutter-md">
            <q-skeleton type="QBtn" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const skeletonCount = new Array(8)
</script>

<style scoped></style>
