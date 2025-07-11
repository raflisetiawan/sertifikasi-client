<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">Kelola Forum Berdasarkan Kursus</div>

    <q-table :rows="courses" :columns="columns" row-key="id" :loading="loading" flat bordered>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn label="Kelola Forum" color="primary" size="sm" @click="goToForumManagement(props.row.id)" />
        </q-td>
      </template>
    </q-table>

    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCourseStore } from 'src/stores/course'; // Assuming a course store exists
import { CourseTable } from 'src/models/course'; // Assuming a Course model exists
import { useNotify } from 'src/composables/notifications';
import { QTableColumn } from 'quasar';
const router = useRouter();
const courseStore = useCourseStore();

const courses = ref<CourseTable[]>([]);
const loading = ref(false);

const columns = ref<QTableColumn[]>([
  { name: 'name', required: true, label: 'Nama Kursus', align: 'left', field: row => row.name, sortable: true },
  { name: 'description', label: 'Deskripsi', align: 'left', field: 'description' },
  { name: 'actions', label: 'Aksi', align: 'right', sortable: false, field: 'actions' },
]);

const fetchCourses = async () => {
  loading.value = true;
  try {
    // Assuming useCourseStore has a method to fetch all courses for admin
    const response = await courseStore.getCourseForTable(); // Adjust this method call as per actual store
    courses.value = response; // Adjust based on actual API response structure
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui';
    useNotify(errorMessage || 'Gagal mengambil data kursus', 'negative');
  } finally {
    loading.value = false;
  }
};

const goToForumManagement = (courseId: number) => {
  router.push({ name: 'AdminCourseForumPage', params: { courseId } });
};

onMounted(fetchCourses);
</script>
