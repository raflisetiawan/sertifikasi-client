<template>
  <div class="q-pa-md">
    <q-breadcrumbs class="q-mb-md">
      <q-breadcrumbs-el icon="home" to="/admin" />
      <q-breadcrumbs-el label="Kelas" to="/admin/course" />
      <q-breadcrumbs-el label="Modul" :to="`/admin/course/${route.params.courseId}/modules`" />
      <q-breadcrumbs-el label="Konsep" />
    </q-breadcrumbs>

    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6">Konsep Modul {{ moduleName }}</div>
            <q-space />
            <q-btn color="primary" icon="add" label="Tambah Konsep" @click="showAddDialog" />
          </q-card-section>

          <q-table :rows="concepts" :columns="columns" row-key="id" :loading="loading">
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="order" :props="props">
                  {{ props.row.order }}
                </q-td>
                <q-td key="title" :props="props">
                  {{ props.row.title }}
                </q-td>
                <q-td key="actions" :props="props">
                  <q-btn-group flat>
                    <q-btn flat round color="primary" icon="edit" size="sm" @click="showEditDialog(props.row)">
                      <q-tooltip>Ubah Konsep</q-tooltip>
                    </q-btn>
                    <q-btn flat round color="negative" icon="delete" size="sm" @click="confirmDelete(props.row)">
                      <q-tooltip>Hapus Konsep</q-tooltip>
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
  <AddModuleConceptDialog @refreshData="fetchConcepts" />
  <EditModuleConceptDialog :selected-concept="selectedConcept" @refreshData="fetchConcepts" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { QTableColumn, useQuasar } from 'quasar';
import { useModuleConceptStore } from 'src/stores/module-concept';
import { useModuleStore } from 'src/stores/module';
import { ModuleConcept } from 'src/models/module-concept';
import AddModuleConceptDialog from 'src/components/admin/module/concept/AddModuleConceptDialog.vue';
import EditModuleConceptDialog from 'src/components/admin/module/concept/EditModuleConceptDialog.vue';

const $q = useQuasar();
const route = useRoute();
const conceptStore = useModuleConceptStore();
const moduleStore = useModuleStore();

const loading = ref(false);
const moduleName = ref('');
const concepts = ref<ModuleConcept[]>([]);
const selectedConcept = ref<ModuleConcept | null>(null);

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
    label: 'Judul Konsep',
    align: 'left',
    field: 'title',
    sortable: true
  },
  {
    name: 'actions',
    label: 'Aksi',
    align: 'center',
    field: 'actions'
  }
];

const fetchConcepts = async () => {
  try {
    loading.value = true;
    concepts.value = await conceptStore.getConcepts(Number(route.params.moduleId));
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Gagal mengambil data konsep'
    });
  } finally {
    loading.value = false;
  }
};

const confirmDelete = (concept: ModuleConcept) => {
  $q.dialog({
    title: 'Konfirmasi Hapus',
    message: `Apakah Anda yakin ingin menghapus konsep "${concept.title}"?`,
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
      await conceptStore.deleteConcept(concept.id);
      await fetchConcepts();
      $q.notify({
        type: 'positive',
        message: 'Konsep berhasil dihapus'
      });
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Gagal menghapus konsep'
      });
    } finally {
      loading.value = false;
    }
  });
};

const showEditDialog = async (concept: ModuleConcept) => {
  try {
    loading.value = true;
    const conceptData = await conceptStore.getConcept(concept.id);
    selectedConcept.value = conceptData;
    conceptStore.editConceptDialog = true;
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Gagal memuat data konsep'
    });
  } finally {
    loading.value = false;
  }
};
const showAddDialog = () => {
  conceptStore.moduleId = Number(route.params.moduleId);
  conceptStore.addConceptDialog = true;
};

onMounted(async () => {
  try {
    loading.value = true;
    const response = await moduleStore.getModule(Number(route.params.moduleId));
    moduleName.value = response.title;
    await fetchConcepts();
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
