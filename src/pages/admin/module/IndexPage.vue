<template>
  <div class="q-pa-md">
    <q-breadcrumbs class="q-mb-md">
      <q-breadcrumbs-el icon="home" to="/admin" />
      <q-breadcrumbs-el label="Kelas" to="/admin/course" />
      <q-breadcrumbs-el :label="courseName" />
      <q-breadcrumbs-el label="Modul" />
    </q-breadcrumbs>

    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6">Modul untuk {{ courseName }}</div>
            <q-space />
            <q-btn color="primary" icon="add" label="Tambah Modul" @click="showAddModuleDialog" />
          </q-card-section>

          <q-table :rows="modules" :columns="columns" row-key="id" :loading="loading">
            <template v-slot:top-right>
              <q-input borderless dense debounce="300" v-model="filter" placeholder="Cari">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>

            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="order" :props="props">
                  {{ props.row.order }}
                </q-td>
                <q-td key="type" :props="props">
                  <q-chip :color="getTypeColor(props.row.type)" text-color="white">
                    {{ getTypeLabel(props.row.type) }}
                  </q-chip>
                </q-td>
                <q-td key="title" :props="props">
                  {{ props.row.title }}
                </q-td>
                <q-td key="subtitle" :props="props">
                  {{ props.row.subtitle }}
                </q-td>
                <q-td key="estimated_time_min" :props="props">
                  {{ props.row.estimated_time_min }} menit
                </q-td>
                <q-td key="actions" :props="props">
                  <q-btn-group flat>
                    <!-- Primary Actions -->
                    <q-btn flat round color="success" icon="description" size="sm"
                      :to="`/admin/course/${route.params.id}/modules/${props.row.id}/contents`">
                      <q-tooltip>Kelola Konten</q-tooltip>
                    </q-btn>
                    <q-btn flat round color="primary" icon="edit" size="sm" @click="showEditDialog(props.row)">
                      <q-tooltip>Ubah Modul</q-tooltip>
                    </q-btn>

                    <!-- Secondary Actions Dropdown -->
                    <q-btn-dropdown auto-close flat round dense color="grey" icon="more_vert" size="sm">
                      <q-list dense style="min-width: 150px">
                        <q-item clickable @click="showDetailDialog(props.row)">
                          <q-item-section avatar>
                            <q-icon name="visibility" size="xs" />
                          </q-item-section>
                          <q-item-section>Lihat Detail</q-item-section>
                        </q-item>
                        <q-item clickable
                          :to="`/admin/course/${route.params.id}/modules/${props.row.id}/concepts`">
                          <q-item-section avatar>
                            <q-icon name="school" size="xs" />
                          </q-item-section>
                          <q-item-section>Kelola Konsep</q-item-section>
                        </q-item>
                        <q-item clickable
                          :to="`/admin/course/${route.params.id}/modules/${props.row.id}/exercises`">
                          <q-item-section avatar>
                            <q-icon name="assignment" size="xs" />
                          </q-item-section>
                          <q-item-section>Kelola Latihan</q-item-section>
                        </q-item>
                        <q-separator class="q-my-sm" />
                        <q-item clickable @click="confirmDelete(props.row)" class="text-negative">
                          <q-item-section avatar>
                            <q-icon name="delete" size="xs" />
                          </q-item-section>
                          <q-item-section>Hapus Modul</q-item-section>
                        </q-item>
                      </q-list>
                    </q-btn-dropdown>
                  </q-btn-group>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card>
      </div>
    </div>
    <AddModuleDialog @refreshData="fetchModules" />
    <DetailModuleDialog :selected-module="selectedModule" />
    <EditModuleDialog :selected-module="selectedModule" @refreshData="fetchModules" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { QTableColumn, useQuasar } from 'quasar';
import { useModuleStore } from 'src/stores/module';
import { Module } from 'src/models/module';
import AddModuleDialog from 'src/components/admin/course/AddModuleDialog.vue';
import DetailModuleDialog from 'src/components/admin/module/DetailModuleDialog.vue';
import EditModuleDialog from 'src/components/admin/module/EditModuleDialog.vue';

const $q = useQuasar();
const route = useRoute();
const moduleStore = useModuleStore();

const loading = ref(false);
const filter = ref('');
const courseName = ref<string | undefined>();
const modules = ref<Module[]>([]);
const selectedModule = ref<Module | null>(null);

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
    name: 'type',
    required: true,
    label: 'Tipe',
    align: 'left',
    field: 'type',
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
    name: 'subtitle',
    label: 'Sub Judul',
    align: 'left',
    field: 'subtitle',
    sortable: true
  },
  {
    name: 'estimated_time_min',
    label: 'Estimasi Waktu',
    align: 'left',
    field: 'estimated_time_min',
    sortable: true
  },
  {
    name: 'actions',
    label: 'Aksi',
    align: 'center',
    field: 'actions'
  }
];

const getTypeColor = (type: string) => {
  switch (type) {
    case 'prework':
      return 'blue';
    case 'module':
      return 'green';
    case 'final':
      return 'purple';
    default:
      return 'grey';
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'prework':
      return 'Prework';
    case 'module':
      return 'Modul';
    case 'final':
      return 'Final';
    default:
      return type;
  }
};

const confirmDelete = (module: Module) => {
  $q.dialog({
    title: 'Konfirmasi Hapus',
    message: `Apakah Anda yakin ingin menghapus modul "${module.title}"?`,
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
      await moduleStore.deleteModule(module.id);
      await fetchModules();
      $q.notify({
        type: 'positive',
        message: 'Modul berhasil dihapus'
      });
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Gagal menghapus modul'
      });
    } finally {
      loading.value = false;
    }
  });
};
const fetchModules = async () => {
  try {
    loading.value = true;
    modules.value = await moduleStore.getModules(Number(route.params.id));
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Gagal mengambil data modul'
    });
  } finally {
    loading.value = false;
  }
};
const showAddModuleDialog = () => {
  moduleStore.courseId = Number(route.params.id);
  moduleStore.addModuleDialog = true;
};

const showDetailDialog = (module: Module) => {
  selectedModule.value = module;
  moduleStore.detailModuleDialog = true;
};

const showEditDialog = (module: Module) => {
  selectedModule.value = module;
  moduleStore.editModuleDialog = true;
};

onMounted(async () => {
  try {
    loading.value = true;
    const response = await moduleStore.getCourse(Number(route.params.id));
    courseName.value = response.name;
    await fetchModules();
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
