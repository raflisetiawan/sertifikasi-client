<template>
  <div>
    <div class="row q-mb-md justify-around items-center">
      <div class="col-md-3 col-sm-4 col-xs-4">
        <q-select outlined v-model="selectCourse" :options="courseOptions" label="Filter kelas" v-if="courseOptions" />
      </div>
      <div class="col-md-3 col-sm-4 col-xs-4">
        <q-input filled label="Filter tanggal" v-model="date" mask="date" class="q-ml-md">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="date">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col-md-2 col-sm-4 col-xs-4">
        <q-checkbox :class="$q.screen.lt.md ? 'q-mt-md' : ''" v-model="isVerified" label="Terverifikasi" />
      </div>
      <div class="col-md-4 col-sm-4 col-xs-4">
        <q-btn color="primary" :class="$q.screen.lt.md ? 'q-mt-md q-ml-md' : 'q-ml-md'"
          @click="filterRegistrantByCourseAndDate" :loading="loadingFilter">Filter</q-btn>
      </div>
    </div>
    <q-markup-table wrap-cells>
      <thead>
        <tr>
          <th colspan="3">
            <div class="row items-center justify-between">
              <div class="col-md-4">
                <div class="text-h6">Pendaftar Kelas <q-spinner color="primary" v-if="loadRegistrant" size="md" /></div>
              </div>
              <div class="col-md-4 col-sm-8 col-xs-8">
                <q-input dense outlined v-model="emailFilter" @keyup.enter="filterRegistrantByCourseAndDate"
                  label="Cari berdasarkan email">
                  <template v-slot:append><q-btn dense flat @click="filterRegistrantByCourseAndDate"
                      icon="search"></q-btn></template>
                </q-input>
              </div>
            </div>
          </th>
        </tr>
        <tr>
          <th class="text-left">Email</th>
          <th class="text-left">Kelas</th>
          <th class="text-center">Status verifikasi</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="registrant in $state.registrants" :key="registrant.id">
          <tr @click="$router.push({
          name: 'CourseRegistrantDetailPage', params: {
            id: registrant.id
          }
        })" class="cursor-pointer">
            <td class="text-left">{{ registrant.user.email }}</td>
            <td class="text-left">{{ registrant.course.name }}</td>
            <td class="text-center"><q-icon size="md" :color="registrant.verification ? 'positive' : 'negative'"
                :name="registrant.verification ? 'done' : 'close'"></q-icon></td>
          </tr>
        </template>
        <tr colspan="3" v-if="$state.registrants.length === 0">
          <td>
            <div class="text-body1">Data Pendaftar tidak di temukan</div>
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useCourseRegistrantStore } from 'stores/course-registrant';
import { AxiosError } from 'axios';
import { useNotify } from 'src/composables/notifications';
import { CourseIdAndNameOptions } from 'src/models/course'

const { getAllCourseRegistrants, getAllCourseIdAndName, $state } = useCourseRegistrantStore()
const selectCourse = ref<CourseIdAndNameOptions | undefined>();
const courseOptions = ref<CourseIdAndNameOptions[]>([])
const date = ref('');
const loadingFilter = ref(false);
const isVerified = ref(false);
const emailFilter = ref('');
const loadRegistrant = ref(false);

const filterRegistrantByCourseAndDate = async () => {
  try {
    loadingFilter.value = true;

    if (selectCourse.value === undefined || selectCourse.value.value === 0) {
      await getAllCourseRegistrants(null, date.value, isVerified.value, emailFilter.value);
    } else {
      await getAllCourseRegistrants(selectCourse.value.value, date.value, isVerified.value, emailFilter.value);
    }
  } catch (error) {
    useNotify('Terjadi masalah', 'red')
  } finally {
    loadingFilter.value = false;
  }
}

onMounted(async () => {
  try {
    loadRegistrant.value = true;
    await getAllCourseRegistrants();
    const courseIdAndNames = await getAllCourseIdAndName()
    courseOptions.value = [
      { value: 0, label: 'Semua Kelas' },
      ...courseIdAndNames.map(course => ({
        value: course.id,
        label: course.name
      }))
    ];
    selectCourse.value = courseOptions.value[0]
  } catch (error) {
    if (error instanceof AxiosError) {
      useNotify(`${error.response?.data.message} & ${error.message}`, 'negative');
    } else {
      useNotify('Terjadi masalah', 'negative');
    }
  } finally {
    loadRegistrant.value = false;
  }
})
</script>
