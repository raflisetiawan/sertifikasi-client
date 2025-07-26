<template>
  <div class="q-pa-md">
    <q-breadcrumbs class="q-mb-md text-weight-medium">
      <q-breadcrumbs-el icon="home" to="/admin" />
      <q-breadcrumbs-el label="Kelas" to="/admin/course" />
      <q-breadcrumbs-el :to="`/admin/course/${route.params.courseId}/modules`" label="Modul" />
      <q-breadcrumbs-el label="Konten" />
    </q-breadcrumbs>

    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card flat bordered class="bg-white module-card">
          <q-card-section class="row items-center bg-primary-1 q-px-lg header-section">
            <div class="text-h6 text-weight-bold text-primary">Daftar Konten Modul</div>
            <q-space />
            <q-btn outline color="primary" icon="add" label="Tambah Teks" @click="showAddTextDialog"
              class="q-px-md module-btn" />
            <q-btn outline color="primary" icon="quiz" label="Tambah Kuis" @click="showAddQuizDialog"
              class="q-ml-sm q-px-md module-btn" />
            <q-btn outline color="primary" icon="assignment" label="Tambah Tugas" @click="showAddAssignmentDialog"
              class="q-ml-sm q-px-md module-btn" />
            <q-btn outline color="primary" icon="play_circle" label="Tambah Video" @click="showAddVideoDialog"
              class="q-ml-sm q-px-md module-btn" />
            <q-btn outline color="primary" icon="upload_file" label="Tambah File" @click="showAddFileDialog"
              class="q-ml-sm q-px-md module-btn" />
            <q-btn outline color="primary" icon="assignment_turned_in" label="Tambah Latihan"
              @click="showAddPracticeDialog" class="q-ml-sm q-px-md module-btn" />
          </q-card-section>

          <!-- Draggable List dengan styling table -->
          <div class="q-mt-md draggable-container">
            <!-- Table Header -->
            <div class="table-header-row">
              <div class="table-cell header-cell" style="width: 15%;">Urutan</div>
              <div class="table-cell header-cell" style="width: 25%;">Judul</div>
              <div class="table-cell header-cell" style="width: 15%;">Tipe Konten</div>
              <div class="table-cell header-cell" style="width: 12%;">Wajib</div>
              <div class="table-cell header-cell" style="width: 15%;">Durasi Minimum</div>
              <div class="table-cell header-cell" style="width: 18%;">Aksi</div>
            </div>

            <!-- Draggable Body -->
            <draggable v-model="moduleContentStore.contents" item-key="id" @end="onDragEnd" handle=".drag-handle"
              ghost-class="drag-ghost" chosen-class="drag-chosen" animation="200" class="draggable-body">
              <template #item="{ element: row }">
                <div class="table-row hover-row">
                  <div class="table-cell" style="width: 15%;">
                    <div class="flex items-center">
                      <q-icon name="drag_indicator" class="drag-handle cursor-grab q-mr-sm" color="grey-6" />
                      <span class="text-weight-medium">{{ row.order }}</span>
                    </div>
                  </div>
                  <div class="table-cell" style="width: 25%;">
                    <span class="text-weight-medium">{{ row.title }}</span>
                  </div>
                  <div class="table-cell" style="width: 15%;">
                    <q-chip :color="getContentTypeColor(row.content_type)" text-color="white" size="sm"
                      class="text-weight-medium">
                      {{ getContentTypeLabel(row.content_type) }}
                    </q-chip>
                  </div>
                  <div class="table-cell" style="width: 12%;">
                    <q-chip :color="row.is_required ? 'positive' : 'grey-4'"
                      :text-color="row.is_required ? 'white' : 'grey-8'" size="sm" class="text-weight-medium">
                      {{ row.is_required ? 'Wajib' : 'Opsional' }}
                    </q-chip>
                  </div>
                  <div class="table-cell" style="width: 15%;">
                    <span class="text-weight-medium">{{ formatDuration(row.minimum_duration_seconds) }}</span>
                  </div>
                  <div class="table-cell" style="width: 18%;">
                    <q-btn-group flat>
                      <q-btn flat round color="primary" icon="visibility" size="sm" @click="handlePreview(row)"
                        class="q-mx-xs action-btn">
                        <q-tooltip>Pratinjau</q-tooltip>
                      </q-btn>
                      <q-btn flat round color="secondary" icon="edit" size="sm" @click="handleEdit(row)"
                        class="q-mx-xs action-btn">
                        <q-tooltip>Edit</q-tooltip>
                      </q-btn>
                      <q-btn flat round color="negative" icon="delete" size="sm" @click="confirmDelete(row)"
                        class="q-mx-xs action-btn">
                        <q-tooltip>Hapus</q-tooltip>
                      </q-btn>
                    </q-btn-group>
                  </div>
                </div>
              </template>
            </draggable>
          </div>
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
import { useQuasar } from 'quasar';
import { useModuleContentStore } from 'src/stores/module-content';
import { BaseContent } from 'src/models/module-content';
import TextContentFormDialog from 'src/components/admin/module/module-content/TextContentFormDialog.vue';
import QuizContentFormDialog from 'src/components/admin/module/module-content/QuizContentFormDialog.vue';
import AssignmentFormDialog from 'src/components/admin/module/module-content/AssignmentFormDialog.vue';
import VideoFormDialog from 'src/components/admin/module/module-content/VideoFormDialog.vue';
import FileFormDialog from 'src/components/admin/module/module-content/FileFormDialog.vue';
import PracticeFormDialog from 'src/components/admin/module/module-content/PracticeFormDialog.vue';
import ContentPreviewDialog from 'src/components/admin/module/module-content/ContentPreviewDialog.vue';
import draggable from 'vuedraggable';

const $q = useQuasar();
const route = useRoute();
const moduleContentStore = useModuleContentStore();

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
    video: 'primary',
    text: 'primary',
    quiz: 'primary',
    assignment: 'primary',
    file: 'primary',
    practice: 'primary'
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

const onDragEnd = async () => {
  try {
    $q.loading.show({ message: 'Memperbarui urutan konten...' });
    const orderedContents = moduleContentStore.contents.map((content, index) => ({
      id: content.id,
      order: index + 1,
    }));
    await moduleContentStore.updateContentOrder(Number(route.params.moduleId), orderedContents);
    $q.notify({ type: 'positive', message: 'Urutan konten berhasil diperbarui.' });
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Gagal memperbarui urutan konten.' });
  } finally {
    $q.loading.hide();
  }
};

onMounted(() => {
  fetchContents();
});

</script>

<style>
.hover-row:hover {
  background-color: rgba(220, 53, 69, 0.05) !important;
  transition: all 0.3s ease;
}

.module-btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.module-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.action-btn {
  opacity: 0.8;
  transition: all 0.3s ease;
}

.action-btn:hover {
  opacity: 1;
  transform: translateY(-1px);
}

.module-card {
  border-radius: 16px;
  border: none !important;
  box-shadow: 0 4px 6px -1px rgba(220, 53, 69, 0.1), 0 2px 4px -1px rgba(220, 53, 69, 0.06);
}

.header-section {
  border-bottom: 1px solid rgba(220, 53, 69, 0.1);
  padding-top: 20px;
  padding-bottom: 20px;
}

.q-chip {
  font-weight: 500;
  letter-spacing: 0.3px;
}

.text-primary {
  color: #dc3545 !important;
}

.bg-primary-1 {
  background-color: #fdf3f3 !important;
}

/* Custom draggable table styles */
.draggable-container {
  border-radius: 12px;
  border: 1px solid rgba(220, 53, 69, 0.1);
  overflow: hidden;
  background: white;
}

.table-header-row {
  display: flex;
  background-color: #fdf3f3 !important;
  border-bottom: 2px solid rgba(220, 53, 69, 0.1);
  min-height: 56px;
  align-items: center;
}

.table-row {
  display: flex;
  border-bottom: 1px solid rgba(220, 53, 69, 0.05);
  min-height: 64px;
  align-items: center;
  transition: all 0.3s ease;
}

.table-row:last-child {
  border-bottom: none;
}

.table-cell {
  padding: 16px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.header-cell {
  font-weight: 600 !important;
  color: #dc3545 !important;
  background-color: #fdf3f3 !important;
}

.draggable-body {
  display: flex;
  flex-direction: column;
}

/* Drag handle styles */
.drag-handle {
  cursor: grab;
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.drag-handle:hover {
  opacity: 1;
}

.drag-handle:active {
  cursor: grabbing;
}

/* Drag states */
.drag-ghost {
  opacity: 0.5;
  background-color: rgba(220, 53, 69, 0.1);
}

.drag-chosen {
  background-color: rgba(220, 53, 69, 0.05);
}

/* Responsive table */
@media (max-width: 768px) {
  .draggable-table {
    font-size: 0.875rem;
  }

  .q-pa-md {
    padding: 8px !important;
  }
}
</style>
