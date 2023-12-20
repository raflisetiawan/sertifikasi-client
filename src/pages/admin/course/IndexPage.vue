<template>
  <div id="course-admin-page">
    <q-ajax-bar ref="bar" color="pink-11" position="top" size="5px" skip-hijack />
    <div class="q-pa-md">
      <div class="row">
        <div class="col-md-10 col-sm-12 col-xs-12">
          <q-table title="Semua Kelas" :rows="rows" :columns="columns" row-key="name" :filter="filter">
            <template v-slot:header="props">
              <q-tr :props="props">
                <q-th auto-width />
                <q-th v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td auto-width>
                  <q-btn size="sm" color="red" class="q-mr-md" @click="showDeleteDialog(props.row)" round dense
                    icon="delete" />
                  <q-btn size="sm" color="green" class="q-mr-md" round dense
                    @click="$router.push({ name: 'UpdateCoursePage', params: { id: props.row.id } })" icon="edit" />
                  <q-btn class="q-mr-md" @click="showAddDialog(props.row.id, props.row.name)" size="sm" color="primary"
                    round dense icon="assignment_add">
                    <q-tooltip>Tambahkan Materi</q-tooltip>
                  </q-btn>
                  <q-btn size="sm" color="blue" round dense icon="menu_book"
                    :to="{ name: 'MaterialAdminIndexPage', params: { id: props.row.id } }">
                    <q-tooltip>Lihat list Materi</q-tooltip>
                  </q-btn>
                </q-td>
                <q-td v-for="col in props.cols" :key="col.name" :props="props" @click="handleRowClick(props.row.id)">
                  {{ col.value }}
                </q-td>
              </q-tr>
            </template>
            <template v-slot:top-right>
              <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>
          </q-table>
        </div>
      </div>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn fab icon="add" color="primary" :to="{ name: 'CreateCoursePage' }" />
      </q-page-sticky>
    </div>
    <delete-dialog :course="course" :isDeleteDialogShow="isDeleteDialogShow"
      @closeDeleteDialog="isDeleteDialogShow = false" @successDelete="(async () => await getCourses())" />
    <AddDialog :courseId="courseId" :courseName="courseName" />
  </div>
</template>

<script setup lang="ts" async>
import { api } from 'src/boot/axios';
import { useMetaTitle } from 'src/composables/meta';
import { onMounted, ref } from 'vue';
import { Courses } from 'src/models/course'
import { QTableColumn } from 'quasar';
import DeleteDialog from 'components/admin/course/DeleteDialog.vue'
import { useRouter } from 'vue-router';
import AddDialog from 'components/admin/material/AddDialog.vue';
import { useMaterialStore } from 'src/stores/material';

useMetaTitle('Manage Kelas - Admin')
const { $state } = useMaterialStore();
const bar = ref();
const courseId = ref(0);
const courseName = ref('');
const { push: routerPush } = useRouter();

onMounted(async () => {
  try {
    bar.value.start()
    await getCourses();
  } catch (error) {
    throw error;
  } finally {
    bar.value.stop();
  }
})

const getCourses = async () => {
  const response = await api.get('course');
  rows.value = response.data.data;
}

const columns = ref<QTableColumn[]>([
  {
    name: 'name',
    required: true,
    label: 'Nama Kelas',
    align: 'left',
    field: row => row.name,
    format: val => `${val}`,
    sortable: true
  },
  { name: 'operational_start', label: 'Tanggal mulai pelaksanaan', align: 'left', field: 'operational_start', sortable: true },
  { name: 'operational_end', label: 'Tanggal akhir pelaksanaan', align: 'left', field: 'operational_end', sortable: true },
])

const rows = ref<Courses[]>([])

const isDeleteDialogShow = ref(false);
const course = ref<Courses>();
const showDeleteDialog = (row: Courses) => {
  isDeleteDialogShow.value = true;
  course.value = row
}

const handleRowClick = (id: number) => {
  routerPush({ name: 'DetailCoursePage', params: { id } })

}

const showAddDialog = (id: number, name: string) => {
  courseId.value = id;
  courseName.value = name;
  $state.addDialog = true;
}

const filter = ref('')
</script>

<style scoped></style>
