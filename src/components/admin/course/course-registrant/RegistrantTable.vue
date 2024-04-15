<template>
  <div>
    <q-markup-table>
      <thead>
        <tr>
          <th colspan="3">
            <div class="row no-wrap items-center">
              <div class="text-h6 q-ml-md q-pa-xs">Pendaftar Kelas</div>
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
        })">
            <td class="text-left">{{ registrant.user.email }}</td>
            <td class="text-left">{{ registrant.course.name }}</td>
            <td class="text-center"><q-icon size="md" :color="registrant.verification ? 'positive' : 'negative'"
                :name="registrant.verification ? 'done' : 'close'"></q-icon></td>
          </tr>
        </template>
      </tbody>
    </q-markup-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useCourseRegistrantStore } from 'stores/course-registrant';
import { AxiosError } from 'axios';
import { useNotify } from 'src/composables/notifications';

const { getAllCourseRegistrants, $state } = useCourseRegistrantStore()


onMounted(async () => {
  try {
    await getAllCourseRegistrants();
  } catch (error) {
    if (error instanceof AxiosError) {
      useNotify(`${error.response?.data.message} & ${error.message}`, 'negative');
    } else {
      useNotify('Terjadi masalah', 'negative');
    }
  }
})
</script>
