<template>
  <div id="detail-course-user">
    <div class="q-pa-md">
      <div class="row">
        <div class="col-12 banner">
          <div class="row justify-between items-center full-height q-pa-md">
            <div class="col-8">
              <div class="text-h5 text-white">{{ course?.name }}</div>
            </div>
            <div class="col-4">
              <q-img :src="`${storageBaseUrl}courses/${course?.image}`" fit="cover" :ratio="4 / 3" height="200px" />
            </div>
          </div>
        </div>
      </div>
      <div class="row q-mt-lg justify-around">
        <div class="col-md-2 col-sm-3 col-xs-4">
          <div class="text-h6">Penjelasan</div>
        </div>
        <div class="col-md-10 col-sm-9 col-xs-8">
          <div class="text-body1">{{ course?.description }}
          </div>
        </div>
      </div>
      <div class="row q-mt-lg justify-around">
        <div class="col-md-2 col-sm-3 col-xs-4">
          <div class="text-h6">Fasilitas</div>
        </div>
        <div class="col-md-10 col-sm-9 col-xs-8">
          <div class="text-body1">{{ course?.facility }}
          </div>
        </div>
      </div>
      <div class="row q-mt-lg justify-around">
        <div class="col-md-2 col-sm-3 col-xs-4">
          <div class="text-h6">Tempat</div>
        </div>
        <div class="col-md-10 col-sm-9 col-xs-8">
          <div class="text-body1">{{ course?.place }}
          </div>
        </div>
      </div>
      <div class="row q-mt-lg justify-around">
        <div class="col-md-2 col-sm-3 col-xs-4">
          <div class="text-h6">Waktu pelaksanaan</div>
        </div>
        <div class="col-md-10 col-sm-9 col-xs-8">
          <div class="text-body1">{{
            new Date(course?.operational_start).getDate() }} - {{
    useFormatOperationalEnd(course?.operational_end) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" async>
import { storageBaseUrl } from 'src/boot/axios';
import { useFormatOperationalEnd } from 'src/composables/format';
import { Courses } from 'src/models/course';
import { useCourseStore } from 'src/stores/course';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const { params: routeParams } = useRoute();
const { showCourse } = useCourseStore()
const course = ref<Courses>({
  name: '',
  description: '',
  facility: '',
  image: null,
  operational_end: '2023/02/02',
  operational_start: '2023/02/02',
  place: '',
  price: 0,
  time: '',
  id: 0
})

const response = await showCourse(routeParams.id)
course.value = response.data;

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
