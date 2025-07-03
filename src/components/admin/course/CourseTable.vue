<template>
  <div id="course-admin-page">
    <div class="q-pa-md">
      <div class="row">
        <div class="col-md-12 col-sm-12 col-xs-12">
          <q-table title="Semua Kelas" :rows="rows" :columns="columns" row-key="name" :filter="filter">
            <template v-slot:header="props">
              <q-tr :props="props">
                <q-th v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.label }}
                </q-th>
                <q-th>Action</q-th>
              </q-tr>
            </template>
            <template v-slot:body="props">
              <q-tr :props="props" @dblclick="handleRowClick(props.row.id)">
                <CourseMenuTableVue :touchPosition="true" :contextMenu="true" :propsData="props"
                  @showAddDialog="(id: number, name: string) => showAddDialog(id, name)"
                  @handleRowClick="(id: number) => handleRowClick(id)" />
                <q-td key="name" :props="props" style="cursor: pointer;" @click="handleRowClick(props.row.id)">
                  {{ props.row.name }}
                </q-td>
                <q-td key="operational_start" :props="props">
                  {{ props.row.operational_start }}
                </q-td>
                <q-td key="status" :props="props">
                  <StatusBadgeComponentVue :status="props.row.status" />
                </q-td>
                <q-td class="text-center">
                  <q-btn size="sm" color="red" class="q-mr-md" @click="showDeleteDialog(props.row)" round dense
                    icon="delete">
                    <q-tooltip>Hapus Kelas</q-tooltip>
                  </q-btn>
                  <q-btn size="sm" color="green" class="q-mr-md" round dense
                    @click="$router.push({ name: 'UpdateCoursePage', params: { id: props.row.id } })" icon="edit" />
                  <q-btn icon="more_vert" flat>
                    <CourseMenuTableVue :touchPosition="false" :contextMenu="false" :propsData="props"
                      @showAddDialog="(id: number, name: string) => showAddDialog(id, name)"
                      @handleRowClick="(id: number) => handleRowClick(id)" />
                  </q-btn>
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
    <EditStatusDialog @getCourses="() => getCourses()" />
    <UploadCertificateTemplateDialog @getCourses="() => getCourses()" />
    <AddModuleDialog @refreshData="getCourses" />
  </div>
</template>

<script setup lang="ts" async>
import { useMetaTitle } from 'src/composables/meta';
import { ref } from 'vue';
import { Courses, CourseTable, CourseRows } from 'src/models/course'
import { QTableColumn } from 'quasar';
import DeleteDialog from 'components/admin/course/DeleteDialog.vue'
import { useRouter } from 'vue-router';
import AddDialog from 'components/admin/material/AddDialog.vue';
import { useMaterialStore } from 'src/stores/material';
import { useFormatDateRange } from 'src/composables/format';
import StatusBadgeComponentVue from 'src/components/StatusBadgeComponent.vue';
import { useCourseStore } from 'src/stores/course';
import CourseMenuTableVue from 'src/components/admin/course/CourseMenuTable.vue';
import EditStatusDialog from './EditStatusDialog.vue';
import UploadCertificateTemplateDialog from './UploadCertificateTemplateDialog.vue';
import AddModuleDialog from './AddModuleDialog.vue';

useMetaTitle('Manage Kelas - Admin')
const { $state } = useMaterialStore();
const courseId = ref(0);
const courseName = ref('');
const { push: routerPush } = useRouter();
const { getCourseForTable } = useCourseStore();


const getCourses = async () => {
  try {

    rows.value = [];
    const response = await getCourseForTable();
    response.map((course: CourseTable) => {
      rows.value.push({
        ...course,
        operational_start: useFormatDateRange(course.operational_start, course.operational_end),
      })
    })

  } catch (error) {
    throw error
  }
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
  { name: 'operational_start', label: 'Tanggal pelaksanaan', align: 'left', field: 'operational_start', sortable: true },
  { name: 'status', label: 'Status', align: 'left', field: 'status', sortable: true },
])

const rows = ref<CourseRows[]>([])

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

await getCourses();

</script>

<style scoped></style>
