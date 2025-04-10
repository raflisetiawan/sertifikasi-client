<template>
  <div class="q-pa-md">
    <q-breadcrumbs class="q-mb-md">
      <q-breadcrumbs-el icon="home" to="/admin" />
      <q-breadcrumbs-el label="Kelas" to="/admin/course" />
      <q-breadcrumbs-el label="List Benefit" />
    </q-breadcrumbs>

    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="row">
              <div class="text-h6">List Contoh Gambar Sertifikat dari kelas : </div>
              <div class="text-h6 text-italic">
                {{ courseName }}
              </div>
            </div>
            <q-space />
            <q-btn color="primary" icon="add" label="Tambah contoh sertifikat benefit" @click="showAddDialog" />
          </q-card-section>

          <q-table :rows="benefits" :columns="columns" row-key="id" :loading="loading">
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="judul" :props="props">
                  {{ props.row.judul }}
                </q-td>
                <q-td key="subjudul" :props="props">
                  {{ props.row.subjudul }}
                </q-td>
                <q-td key="deskripsi" :props="props">
                  {{ props.row.deskripsi }}
                </q-td>
                <q-td key="gambar" :props="props">
                  <q-img :src="props.row.gambar"></q-img>
                </q-td>
                <q-td key="diperoleh_melalui" :props="props">
                  {{ props.row.diperoleh_melalui }}
                </q-td>
                <q-td key="actions" :props="props">
                  <q-btn-group flat>
                    <q-btn flat round color="primary" icon="edit" size="sm" @click="showEditDialog(props.row)">
                      <q-tooltip>Ubah Benefit</q-tooltip>
                    </q-btn>
                    <q-btn flat round color="negative" icon="delete" size="sm" @click="confirmDelete(props.row)">
                      <q-tooltip>Hapus Benefit</q-tooltip>
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
  <AddBenefitDialog @refreshData="fetchBenefits" />
  <EditBenefitDialog :selectedBenefit="selectedBenefit" @refreshData="fetchBenefits" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { QTableColumn, useQuasar } from 'quasar';
import { useCourseBenefitStore } from 'src/stores/course-benefit';
import { CourseBenefit } from 'src/models/course-benefit';
import AddBenefitDialog from 'src/components/admin/course-benefit/AddBenefitDialog.vue';
import EditBenefitDialog from 'src/components/admin/course-benefit/EditBenefitDialog.vue';
import { useCourseStore } from 'src/stores/course';

const $q = useQuasar();
const route = useRoute();
const courseBenefitStore = useCourseBenefitStore();
const courseStore = useCourseStore();

const loading = ref(false);
const benefits = ref<CourseBenefit[]>([]);
const selectedBenefit = ref<CourseBenefit | null>(null);
const courseName = ref<string>('');

const columns: QTableColumn[] = [
  {
    name: 'judul',
    required: true,
    label: 'Judul Konsep',
    align: 'left',
    field: 'judul',
    sortable: true
  },
  {
    name: 'subjudul',
    required: true,
    label: 'Sub Judul',
    align: 'left',
    field: 'subjudul',
    sortable: true
  },
  {
    name: 'deskripsi',
    required: true,
    label: 'Deskripsi',
    align: 'left',
    field: 'deskripsi',
    sortable: true
  },
  {
    name: 'gambar',
    required: true,
    label: 'Gambar',
    align: 'left',
    field: 'gambar',
    sortable: true
  },
  {
    name: 'diperoleh_melalui',
    required: true,
    label: 'Deskripsi diperoleh melalui',
    align: 'left',
    field: 'diperoleh_melalui',
    sortable: true
  },
  {
    name: 'actions',
    label: 'Aksi',
    align: 'center',
    field: 'actions'
  }
];

const fetchBenefits = async () => {
  try {
    loading.value = true;
    benefits.value = await courseBenefitStore.getBenefits(Number(route.params.courseId));
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Gagal mengambil data konsep'
    });
  } finally {
    loading.value = false;
  }
};

const confirmDelete = (benefit: CourseBenefit) => {
  $q.dialog({
    title: 'Konfirmasi Hapus',
    message: `Apakah Anda yakin ingin menghapus konsep "${benefit.judul}"?`,
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
      await courseBenefitStore.deleteBenefit(benefit.id);
      await fetchBenefits();
      $q.notify({
        type: 'positive',
        message: 'Benefit berhasil dihapus'
      });
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Gagal menghapus Benefit'
      });
    } finally {
      loading.value = false;
    }
  });
};

const showEditDialog = async (benefit: CourseBenefit) => {
  try {
    loading.value = true;
    const benefitData = await courseBenefitStore.getBenefit(benefit.id);
    courseBenefitStore.courseId = Number(route.params.courseId);
    selectedBenefit.value = benefitData;
    courseBenefitStore.editBenefitDialog = true;
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Gagal memuat data benefit'
    });
  } finally {
    loading.value = false;
  }
};
const showAddDialog = () => {
  courseBenefitStore.courseId = Number(route.params.courseId);
  courseBenefitStore.addBenefitDialog = true;
};

onMounted(async () => {
  try {
    loading.value = true;
    const response = await courseStore.showCourse(Number(route.params.courseId));
    courseName.value = response.data.name;
    await fetchBenefits();
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
