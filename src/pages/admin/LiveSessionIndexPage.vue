<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table title="Manajemen Sesi Langsung" :rows="liveSessionStore.liveSessions" :columns="columns" row-key="id"
        v-model:pagination="liveSessionStore.pagination" @request="onRequest" :loading="loading">
        <template v-slot:top-right>
          <q-btn color="primary" icon="add" label="Buat Sesi Baru" @click="openFormDialog()" />
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn dense round flat icon="edit" @click="openFormDialog(props.row)">
              <q-tooltip>Edit</q-tooltip>
            </q-btn>
            <q-btn dense round flat icon="delete" color="negative" @click="openDeleteDialog(props.row)">
              <q-tooltip>Hapus</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <template v-slot:body-cell-meeting_link="props">
          <q-td :props="props">
            <a :href="props.value" target="_blank" rel="noopener noreferrer">{{ props.value }}</a>
          </q-td>
        </template>
      </q-table>
    </div>

    <live-session-form-dialog />
    <delete-dialog />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { QTableColumn, QTableProps } from 'quasar';
import { useLiveSessionStore } from 'src/stores/live-session';
import { LiveSession } from 'src/models/live-session';
import LiveSessionFormDialog from 'src/components/admin/livesession/LiveSessionFormDialog.vue';
import DeleteDialog from 'src/components/admin/livesession/DeleteDialog.vue';

const liveSessionStore = useLiveSessionStore();
const loading = ref(false);

const columns: QTableColumn[] = [
  { name: 'title', required: true, label: 'Judul', align: 'left', field: 'title', sortable: true },
  { name: 'course_name', align: 'left', label: 'Kursus', field: (row) => row.course_name || 'N/A', sortable: false },
  { name: 'start_time', align: 'left', label: 'Waktu Mulai', field: 'start_time', sortable: true },
  { name: 'end_time', align: 'left', label: 'Waktu Selesai', field: 'end_time', sortable: true },
  { name: 'meeting_link', align: 'left', label: 'Link Meeting', field: 'meeting_link' },
  { name: 'actions', label: 'Aksi', field: 'id' }
];

const onRequest: QTableProps['onRequest'] = async (props) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination;
  loading.value = true;
  await liveSessionStore.fetchLiveSessions({
    page,
    limit: rowsPerPage,
    sortBy: sortBy || undefined,
    descending: descending || undefined,
  });
  loading.value = false;

  // Update pagination in the store to keep it in sync
  liveSessionStore.pagination.page = page;
  liveSessionStore.pagination.rowsPerPage = rowsPerPage;
  liveSessionStore.pagination.sortBy = sortBy;
  liveSessionStore.pagination.descending = descending;
};

function openFormDialog(session?: LiveSession) {
  if (session) {
    liveSessionStore.editedLiveSession = { ...session };
  }
  liveSessionStore.formDialog = true;
}

function openDeleteDialog(session: LiveSession) {
  liveSessionStore.editedLiveSession = { ...session };
  liveSessionStore.deleteDialog = true;
}

onMounted(() => {
  // Manually trigger the first request
  const { page, rowsPerPage, sortBy, descending } = liveSessionStore.pagination;
  onRequest({
    pagination: {
      page,
      rowsPerPage,
      sortBy,
      descending,
    },
    filter: null,
        /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    getCellValue: (_col, _row) => null, // Required by type, but not used in our implementation
  });
});
</script>
