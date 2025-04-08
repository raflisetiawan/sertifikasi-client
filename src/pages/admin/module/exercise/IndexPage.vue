<template>
  <div class="q-pa-md">
    <q-breadcrumbs class="q-mb-md">
      <q-breadcrumbs-el icon="home" to="/admin" />
      <q-breadcrumbs-el label="Kelas" to="/admin/course" />
      <q-breadcrumbs-el label="Modul" :to="`/admin/course/${route.params.courseId}/modules`" />
      <q-breadcrumbs-el label="Latihan" />
    </q-breadcrumbs>

    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6">Latihan Modul {{ moduleName }}</div>
            <q-space />
            <q-btn color="primary" icon="add" label="Tambah Latihan" @click="showAddDialog" />
          </q-card-section>

          <q-table :rows="exercises" :columns="columns" row-key="id" :loading="loading">
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="order" :props="props">
                  {{ props.row.order }}
                </q-td>
                <q-td key="description" :props="props">
                  <div v-html="props.row.description"></div>
                </q-td>
                <q-td key="actions" :props="props">
                  <q-btn-group flat>
                    <q-btn flat round color="primary" icon="edit" size="sm" @click="showEditDialog(props.row)">
                      <q-tooltip>Ubah Latihan</q-tooltip>
                    </q-btn>
                    <q-btn flat round color="negative" icon="delete" size="sm" @click="confirmDelete(props.row)">
                      <q-tooltip>Hapus Latihan</q-tooltip>
                    </q-btn>
                  </q-btn-group>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card>
      </div>
    </div>
  </div>
  <AddModuleExerciseDialog @refreshData="fetchExercises" />
  <EditModuleExerciseDialog :selected-exercise="selectedExercise" @refreshData="fetchExercises" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { QTableColumn, useQuasar } from 'quasar';
import { useModuleExerciseStore } from 'src/stores/module-exercise';
import { useModuleStore } from 'src/stores/module';
import { ModuleExercise } from 'src/models/module-exercise';
import AddModuleExerciseDialog from 'components/admin/module/exercise/AddModuleExerciseDialog.vue';
import EditModuleExerciseDialog from 'src/components/admin/module/exercise/EditModuleExerciseDialog.vue';

const $q = useQuasar();
const route = useRoute();
const exerciseStore = useModuleExerciseStore();
const moduleStore = useModuleStore();

const loading = ref(false);
const moduleName = ref('');
const exercises = ref<ModuleExercise[]>([]);
const selectedExercise = ref<ModuleExercise | null>(null);

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
    name: 'description',
    required: true,
    label: 'Deskripsi',
    align: 'left',
    field: 'description',
    sortable: true
  },
  {
    name: 'actions',
    label: 'Aksi',
    align: 'center',
    field: 'actions'
  }
];

const fetchExercises = async () => {
  try {
    loading.value = true;
    exercises.value = await exerciseStore.getExercises(Number(route.params.moduleId));
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Gagal mengambil data latihan'
    });
  } finally {
    loading.value = false;
  }
};

const confirmDelete = (exercise: ModuleExercise) => {
  $q.dialog({
    title: 'Konfirmasi Hapus',
    message: 'Apakah Anda yakin ingin menghapus latihan ini?',
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
      loading.value = true;
      await exerciseStore.deleteExercise(exercise.id);
      await fetchExercises();
      $q.notify({
        type: 'positive',
        message: 'Latihan berhasil dihapus'
      });
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Gagal menghapus latihan'
      });
    } finally {
      loading.value = false;
    }
  });
};

const showAddDialog = () => {
  exerciseStore.moduleId = Number(route.params.moduleId);
  exerciseStore.addExerciseDialog = true;
};
const showEditDialog = async (exercise: ModuleExercise) => {
  selectedExercise.value = exercise;
  exerciseStore.editExerciseDialog = true;
};


onMounted(async () => {
  try {
    loading.value = true;
    const response = await moduleStore.getModule(Number(route.params.moduleId));
    moduleName.value = response.title;
    await fetchExercises();
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Gagal memuat data'
    });
  } finally {
    loading.value = false;
  }
});
</script>
