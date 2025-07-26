<template>
  <div id="course-admin-page">
    <div class="q-pa-md">
      <!-- Filter Controls -->
      <q-expansion-item expand-separator icon="filter_list" label="Filter Lanjutan">
        <q-card>
          <q-card-section class="row q-col-gutter-md">
            <div class="col-12 col-sm-4">
              <q-select dense outlined v-model="filters.status" :options="publicationStatusOptions" label="Filter by Status"
                clearable />
            </div>
            <div class="col-12 col-sm-4">
              <q-input dense outlined v-model="filters.start_date" mask="date" label="Tanggal Mulai">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="filters.start_date"></q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-12 col-sm-4">
              <q-input dense outlined v-model="filters.end_date" mask="date" label="Tanggal Selesai">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="filters.end_date"></q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Reset" @click="resetFilters" />
            <q-btn color="primary" label="Terapkan" @click="applyFilters" />
          </q-card-actions>
        </q-card>
      </q-expansion-item>

      <!-- Table -->
      <q-table title="Semua Kelas" :rows="rows" :columns="columns" row-key="id" :filter="searchQuery"
        v-model:selected="selected" selection="multiple" class="q-mt-md" :loading="loading">

        <template v-slot:top>
          <div class="q-table__title">Semua Kelas</div>
          <q-space />
          <!-- Bulk Actions -->
          <div v-if="selected.length > 0" class="q-gutter-sm">
            <q-btn color="primary" icon="edit" label="Ubah Status" @click="showBulkStatusDialog = true" />
            <q-btn color="negative" icon="delete" label="Hapus" @click="confirmBulkDelete" />
          </div>
          <q-input dense debounce="300" v-model="searchQuery" placeholder="Cari..." class="q-ml-md">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-btn class="q-ml-sm" color="secondary" icon-right="archive" label="Export CSV" no-caps
            @click="exportTable" />
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <q-checkbox v-model="props.selected" />
            </q-td>
            <q-td key="name" :props="props">
              {{ props.row.name }}
            </q-td>
            <q-td key="operational_start" :props="props">
              {{ props.row.operational_start }}
            </q-td>
            <q-td key="status" :props="props">
              <StatusBadgeComponentVue :status="props.row.status" />
            </q-td>
            <q-td key="readiness" :props="props">
              <q-icon v-if="props.row.publication_readiness?.is_ready" name="check_circle" color="positive" size="sm">
                <q-tooltip>Siap untuk dipublikasikan.</q-tooltip>
              </q-icon>
              <q-icon v-else name="warning" color="negative" size="sm">
                <q-tooltip>
                  <div v-for="(error, index) in props.row.publication_readiness?.errors" :key="index">
                    - {{ error }}
                  </div>
                </q-tooltip>
              </q-icon>
            </q-td>
            <q-td key="actions" :props="props" class="text-center">
              <q-btn size="sm" color="grey-7" round dense icon="more_vert">
                <course-menu-table :props-data="props" :context-menu="false" @handle-row-click="handleRowClick" />
              </q-btn>
            </q-td>
          </q-tr>
        </template>
      </q-table>

      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn fab icon="add" color="primary" :to="{ name: 'CreateCoursePage' }" />
      </q-page-sticky>
    </div>

    <!-- Dialogs -->
    <delete-dialog :course="courseToDelete" :isDeleteDialogShow="isDeleteDialogShow"
      @closeDeleteDialog="isDeleteDialogShow = false" @successDelete="getCourses" />
    <q-dialog v-model="showBulkStatusDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Ubah Status untuk {{ selected.length }} Kursus</div>
        </q-card-section>
        <q-card-section>
          <q-select v-model="newBulkStatus" :options="publicationStatusOptions" label="Status Baru" outlined />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Batal" v-close-popup />
          <q-btn color="primary" label="Simpan" @click="handleBulkUpdateStatus" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <PublishErrorDialog :show="showPublishErrorDialog" :errors="courseStore.publicationErrors"
      @update:show="showPublishErrorDialog = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { QTableColumn, useQuasar, exportFile } from 'quasar';
import { useRouter } from 'vue-router';
import { useCourseStore } from 'src/stores/course';
import { Courses, CourseTable, CourseRows } from 'src/models/course';
import { useFormatDateRange } from 'src/composables/format';
import StatusBadgeComponentVue from 'src/components/StatusBadgeComponent.vue';
import DeleteDialog from 'components/admin/course/DeleteDialog.vue';
import CourseMenuTable from 'src/components/admin/course/CourseMenuTable.vue';
import PublishErrorDialog from './PublishErrorDialog.vue';

const $q = useQuasar();
const router = useRouter();
const courseStore = useCourseStore();

const handleRowClick = (courseId: number) => {
  router.push({ name: 'DetailCoursePage', params: { id: courseId } });
};

const loading = ref(false);
const rows = ref<CourseRows[]>([]);
const selected = ref<CourseRows[]>([]);
const searchQuery = ref('');
const showPublishErrorDialog = ref(false);

const filters = reactive({
  status: null as { label: string; value: string } | null,
  start_date: '',
  end_date: '',
});

const statusOptions = [
  { label: 'Belum dimulai', value: 'not_started' },
  { label: 'sedang berlangsung', value: 'started' },
  { label: 'Selesai', value: 'completed' },
];

const publicationStatusOptions = [
  { label: 'Draf', value: 'draft' },
  { label: 'Publikasi', value: 'published' },
  { label: 'Arsip', value: 'archived' },
];

const columns: QTableColumn[] = [
  { name: 'name', required: true, label: 'Nama Kelas', align: 'left', field: 'name', sortable: true },
  { name: 'operational_start', label: 'Tanggal Pelaksanaan', align: 'left', field: 'operational_start', sortable: true },
  { name: 'status', label: 'Status', align: 'center', field: 'status', sortable: true },
  { name: 'readiness', label: 'Siap Publikasi', align: 'center', field: 'readiness', sortable: true },
  { name: 'actions', label: 'Actions', field: 'id', align: 'center' }
];

const getCourses = async () => {
  loading.value = true;
  try {
    const filterParams = {
      status: filters.status?.value,
      start_date: filters.start_date.replace(/\//g, '-'),
      end_date: filters.end_date.replace(/\//g, '-'),
    };
    const response = await courseStore.getCourseForTable(filterParams);
    rows.value = response.map((course: CourseTable) => ({
      ...course,
      operational_start: useFormatDateRange(course.operational_start, course.operational_end),
    }));
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Gagal memuat data kelas.' });
  } finally {
    loading.value = false;
  }
};

const applyFilters = () => {
  getCourses();
};

const resetFilters = () => {
  filters.status = null;
  filters.start_date = '';
  filters.end_date = '';
  getCourses();
};

onMounted(getCourses);

// --- Single Delete ---
const isDeleteDialogShow = ref(false);
const courseToDelete = ref<Courses>();
const showDeleteDialog = (row: Courses) => {
  isDeleteDialogShow.value = true;
  courseToDelete.value = row;
};

// --- Bulk Actions ---
const showBulkStatusDialog = ref(false);
const newBulkStatus = ref(null as { label: string; value: string } | null);

const handleBulkUpdateStatus = async () => {
  if (!newBulkStatus.value) {
    $q.notify({ type: 'negative', message: 'Silakan pilih status baru.' });
    return;
  }
  const ids = selected.value.map(row => row.id);
  try {
    await courseStore.bulkUpdateStatus(ids, newBulkStatus.value.value);
    const successCount = ids.length - courseStore.publicationErrors.length;
    if (successCount > 0) {
      $q.notify({ type: 'positive', message: `${successCount} status kursus berhasil diperbarui.` });
    }

    if (courseStore.publicationErrors.length > 0) {
      showPublishErrorDialog.value = true;
    }

  } catch (error) {
    if (courseStore.publicationErrors.length > 0) {
      showPublishErrorDialog.value = true;
    } else {
      $q.notify({ type: 'negative', message: 'Gagal memperbarui status.' });
    }
  } finally {
    showBulkStatusDialog.value = false;
    selected.value = [];
    await getCourses();
  }
};

const confirmBulkDelete = () => {
  $q.dialog({
    title: 'Konfirmasi',
    message: `Apakah Anda yakin ingin menghapus ${selected.value.length} kursus yang dipilih?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    const ids = selected.value.map(row => row.id);
    try {
      await courseStore.bulkDelete(ids);
      $q.notify({ type: 'positive', message: 'Kursus berhasil dihapus.' });
      selected.value = [];
      await getCourses();
    } catch (error) {
      $q.notify({ type: 'negative', message: 'Gagal menghapus kursus.' });
    }
  });
};

// --- Export ---
function wrapCsvValue(val: any, formatFn?: (val: any, row?: any) => string, row?: any) {
  let formatted = formatFn !== void 0 ? formatFn(val, row) : val

  formatted = formatted === void 0 || formatted === null ? '' : String(formatted)

  formatted = formatted.split('"').join('""')

  return `"${formatted}"`
}

const exportTable = () => {
  const content = [columns.map(col => wrapCsvValue(col.label))].concat(
    rows.value.map(row => columns.map(col => wrapCsvValue(
      typeof col.field === 'function' ? col.field(row) : row[col.field as keyof typeof row],
      col.format,
      row
    )).join(','))
  ).join('\r\n')

  const status = exportFile(
    'course-list.csv',
    content,
    'text/csv'
  )

  if (status !== true) {
    $q.notify({
      message: 'Browser menolak mengunduh file...',
      color: 'negative',
      icon: 'warning'
    })
  }
}
</script>

<style scoped></style>
