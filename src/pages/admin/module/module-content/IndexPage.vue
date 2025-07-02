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
            <q-btn color="deep-orange" icon="assignment_turned_in" label="Tambah Latihan" @click="showAddPracticeDialog"
              class="q-ml-sm" />
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
                    <q-btn flat round color="info" icon="visibility" size="sm" @click="handlePreview(props.row)">
                      <q-tooltip>Pratinjau</q-tooltip>
                    </q-btn>
                    <q-btn flat round color="green" icon="edit" size="sm" @click="handleEdit(props.row)">
                      <q-tooltip>Edit</q-tooltip>
                    </q-btn>
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
    <TextContentFormDialog ref="textDialog" :module-id="Number(route.params.moduleId)" @refresh="fetchContents" />
    <QuizContentFormDialog ref="quizDialog" :module-id="Number(route.params.moduleId)" @refresh="fetchContents" />
    <AssignmentFormDialog ref="assignmentDialog" :module-id="Number(route.params.moduleId)" @refresh="fetchContents" />
    <VideoFormDialog ref="videoDialog" :module-id="Number(route.params.moduleId)" @refresh="fetchContents" />
    <FileFormDialog ref="fileDialog" :module-id="Number(route.params.moduleId)" @refresh="fetchContents" />
    <PracticeFormDialog ref="practiceDialog" :module-id="Number(route.params.moduleId)" @refresh="fetchContents" />
    <ContentPreviewDialog ref="previewDialog" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar, QTableColumn } from 'quasar';
import { useModuleContentStore } from 'src/stores/module-content';
import { BaseContent } from 'src/models/module-content';
import TextContentFormDialog from 'src/components/admin/module/module-content/TextContentFormDialog.vue';
import QuizContentFormDialog from 'src/components/admin/module/module-content/QuizContentFormDialog.vue';
import AssignmentFormDialog from 'src/components/admin/module/module-content/AssignmentFormDialog.vue';
import VideoFormDialog from 'src/components/admin/module/module-content/VideoFormDialog.vue';
import FileFormDialog from 'src/components/admin/module/module-content/FileFormDialog.vue';
import PracticeFormDialog from 'src/components/admin/module/module-content/PracticeFormDialog.vue';
import ContentPreviewDialog from 'src/components/admin/module/module-content/ContentPreviewDialog.vue';

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

const textDialog = ref();
const quizDialog = ref();
const assignmentDialog = ref();
const videoDialog = ref();
const fileDialog = ref();
const practiceDialog = ref();
const previewDialog = ref();

const handlePreview = async (content: BaseContent) => {
  try {
    $q.loading.show({ message: 'Memuat data...' });
    const fullContent = await moduleContentStore.fetchContentDetails(Number(route.params.moduleId), content.id);
    previewDialog.value.show(fullContent);
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Gagal memuat detail konten untuk pratinjau.' });
  } finally {
    $q.loading.hide();
  }
};

const dialogRefs = {
  text: textDialog,
  quiz: quizDialog,
  assignment: assignmentDialog,
  video: videoDialog,
  file: fileDialog,
  practice: practiceDialog,
};

const handleEdit = async (content: BaseContent) => {
  try {
    $q.loading.show({ message: 'Memuat data...' });
    const fullContent = await moduleContentStore.fetchContentDetails(Number(route.params.moduleId), content.id);
    const dialogRef = dialogRefs[content.content_type as keyof typeof dialogRefs];

    if (dialogRef && dialogRef.value) {
      dialogRef.value.show(fullContent);
    } else {
      $q.notify({
        type: 'negative',
        message: 'Tipe konten tidak dikenali atau dialog tidak ditemukan.'
      });
    }
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Gagal memuat detail konten untuk diedit.' });
  } finally {
    $q.loading.hide();
  }
}

const getContentTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    video: 'purple',
    text: 'blue',
    quiz: 'orange',
    assignment: 'green',
    file: 'info',
    practice: 'deep-orange'
  };
  return colors[type] || 'grey';
};

const getContentTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    video: 'Video',
    text: 'Teks',
    quiz: 'Kuis',
    assignment: 'Tugas',
    file: 'File',
    practice: 'Latihan'
  };
  return labels[type] || type;
};

const formatDuration = (seconds: number) => {
  if (!seconds) return '-';
  const minutes = Math.floor(seconds / 60);
  return `${minutes} menit`;
};

const showAddTextDialog = () => {
  textDialog.value.show();
};

const showAddQuizDialog = () => {
  quizDialog.value.show();
};

const showAddAssignmentDialog = () => {
  assignmentDialog.value.show();
};

const showAddVideoDialog = () => {
  videoDialog.value.show();
};

const showAddFileDialog = () => {
  fileDialog.value.show();
};

const showAddPracticeDialog = () => {
  practiceDialog.value.show();
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
