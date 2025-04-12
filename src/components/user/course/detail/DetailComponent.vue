<template>
  <div id="detail-course-user">
    <div>
      <div class="row q-pa-md">
        <div class="col-12 banner">
          <div class="row justify-between items-center full-height q-pa-md">
            <div class="col-md-4 col-sm-4 col-xs-12">
              <q-img :src="`${storageBaseUrl}courses/${course?.image}`" fit="cover" :ratio="4 / 3" height="200px" />
            </div>
            <div class="col-md-6 col-sm-6 col-xs-12 text-center">
              <div :class="$q.screen.lt.sm ? 'text-h4' : 'text-h3'">{{ props.course.name }}</div>
              <div class="text-body1">{{ props.course.description }}</div>
              <div class="text-overline">{{ toRupiah(props.course.price) }}</div>
              <div class="text-body1">Online Via : {{ props.course.place }}
                <div class="text-body2">{{ useFormatDateRange(props.course?.operational_start,
                  props.course?.operational_end) }}</div>
                <q-btn color="primary"
                  :to="{ name: 'RegisterCourseUserPage', params: { id: props.course.id } }">Daftar</q-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" async>
import { storageBaseUrl } from 'src/boot/axios';
import { useFormatDateRange } from 'src/composables/format';
import toRupiah from '@develoka/angka-rupiah-js';

const props = defineProps(['course']);
</script>

<style scoped>
.banner {
  height: 250px;
  border-radius: 5px;
  border: solid 2px #ff4d5f;
}

@media (max-width: 600px) {
  .banner {
    height: 80vh;
  }
}
</style>
