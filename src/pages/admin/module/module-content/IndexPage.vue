<template>
  <div class="q-pa-md">
    <q-breadcrumbs class="q-mb-md">
      <q-breadcrumbs-el icon="home" to="/admin" />
      <q-breadcrumbs-el label="Kelas" to="/admin/course" />
      <q-breadcrumbs-el :to="`/admin/course/${route.params.courseId}/modules`" label="Modul" />
      <q-breadcrumbs-el label="Konten" />
    </q-breadcrumbs>

    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card>
          <q-card-section class="row items-center">
            <div class="text-h6">Daftar Konten Modul</div>
            <q-space />
            <q-btn color="primary" icon="add" label="Tambah Teks" @click="showAddTextDialog" />
            <q-btn color="warning" icon="quiz" label="Tambah Kuis" @click="showAddQuizDialog" class="q-ml-sm" />
            <q-btn color="green" icon="assignment" label="Tambah Tugas" @click="showAddAssignmentDialog"
              class="q-ml-sm" />
            <q-btn color="purple" icon="play_circle" label="Tambah Video" @click="showAddVideoDialog" class="q-ml-sm" />
            <q-btn color="info" icon="upload_file" label="Tambah File" @click="showAddFileDialog" class="q-ml-sm" />

          </q-card-section>

          <q-table :rows="moduleContentStore.contents" :columns="columns" row-key="id"
            :loading="moduleContentStore.loading">
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="order" :props="props">{{ props.row.order }}</q-td>
                <q-td key="title" :props="props">{{ props.row.title }}</q-td>
                <q-td key="content_type" :props="props">
                  <q-chip :color="getContentTypeColor(props.row.content_type)" text-color="white">
                    {{ getContentTypeLabel(props.row.content_type) }}
                  </q-chip>
                </q-td>
                <q-td key="is_required" :props="props">
                  <q-chip :color="props.row.is_required ? 'positive' : 'grey'" text-color="white">
                    {{ props.row.is_required ? 'Wajib' : 'Opsional' }}
                  </q-chip>
                </q-td>
                <q-td key="minimum_duration_seconds" :props="props">
                  {{ formatDuration(props.row.minimum_duration_seconds) }}
                </q-td>
                <q-td key="actions" :props="props">
                  <q-btn-group flat>
                    <q-btn flat round color="negative" icon="delete" size="sm" @click="confirmDelete(props.row)">
                      <q-tooltip>Hapus</q-tooltip>
                    </q-btn>
                  </q-btn-group>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card>
      </div>
    </div>
    <AddTextContentDialog ref="addTextDialog" :module-id="Number(route.params.moduleId)" @refresh="fetchContents" />
    <AddQuizContentDialog ref="addQuizDialog" :module-id="Number(route.params.moduleId)" @refresh="fetchContents" />
    <AddAssignmentDialog ref="addAssignmentDialog" :module-id="Number(route.params.moduleId)"
      @refresh="fetchContents" />
    <AddVideoDialog ref="addVideoDialog" :module-id="Number(route.params.moduleId)" @refresh="fetchContents" />
    <AddFileDialog ref="addFileDialog" :module-id="Number(route.params.moduleId)" @refresh="fetchContents" />

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar, QTableColumn } from 'quasar';
import { useModuleContentStore } from 'src/stores/module-content';
import AddTextContentDialog from 'src/components/admin/module/module-content/AddTextContentDialog.vue';
import AddQuizContentDialog from 'src/components/admin/module/module-content/AddQuizContentDialog.vue';
import AddAssignmentDialog from 'src/components/admin/module/module-content/AddAssignmentDialog.vue';
import { BaseContent } from 'src/models/module-content';
import AddVideoDialog from 'src/components/admin/module/module-content/AddVideoDialog.vue';
import AddFileDialog from 'src/components/admin/module/module-content/AddFileDialog.vue';

const $q = useQuasar();
const route = useRoute();
const moduleContentStore = useModuleContentStore();

const columns: QTableColumn[] = [
  {
    name: 'order',
    required: true,
    label: 'Urutan',
    align: 'left',
    field: 'order',
    sortable: true
  },
  {
    name: 'title',
    required: true,
    label: 'Judul',
    align: 'left',
    field: 'title',
    sortable: true
  },
  {
    name: 'content_type',
    required: true,
    label: 'Tipe Konten',
    align: 'left',
    field: 'content_type',
    sortable: true
  },
  {
    name: 'is_required',
    label: 'Wajib',
    align: 'left',
    field: 'is_required',
    sortable: true
  },
  {
    name: 'minimum_duration_seconds',
    label: 'Durasi Minimum',
    align: 'left',
    field: 'minimum_duration_seconds',
    sortable: true
  },
  {
    name: 'actions',
    label: 'Aksi',
    align: 'center',
    field: 'actions'
  }
];

const getContentTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    video: 'purple',
    text: 'blue',
    quiz: 'orange',
    assignment: 'green'
  };
  return colors[type] || 'grey';
};

const getContentTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    video: 'Video',
    text: 'Teks',
    quiz: 'Kuis',
    assignment: 'Tugas'
  };
  return labels[type] || type;
};

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  return `${minutes} menit`;
};

const addTextDialog = ref();

const showAddTextDialog = () => {
  addTextDialog.value.show();
};

const addQuizDialog = ref();

const showAddQuizDialog = () => {
  addQuizDialog.value.show();
};

const addAssignmentDialog = ref();

const showAddAssignmentDialog = () => {
  addAssignmentDialog.value.show();
};

const addVideoDialog = ref();

const showAddVideoDialog = () => {
  addVideoDialog.value.show();
};

const addFileDialog = ref();

const showAddFileDialog = () => {
  addFileDialog.value.show();
};

const confirmDelete = (content: BaseContent) => {
  $q.dialog({
    title: 'Konfirmasi Hapus',
    message: `Apakah Anda yakin ingin menghapus konten "${content.title}"?`,
    ok: {
      label: 'Hapus',
      color: 'negative',
      push: true
    },
    cancel: {
      label: 'Batal',
      color: 'grey',
      push: true
    },
    persistent: true
  }).onOk(async () => {
    try {
      await moduleContentStore.deleteContent(
        Number(route.params.moduleId),
        content.id
      );
      $q.notify({
        type: 'positive',
        message: 'Konten berhasil dihapus'
      });
      await fetchContents();
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Gagal menghapus konten'
      });
    }
  });
};

const fetchContents = async () => {
  try {
    await moduleContentStore.fetchContents(Number(route.params.moduleId));
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Gagal memuat data konten'
    });
  }
};

onMounted(() => {
  fetchContents();
});

</script>
