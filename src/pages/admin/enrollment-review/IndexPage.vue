<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table title="Penilaian Akhir Peserta" :rows="enrollments" :columns="columns" row-key="id" :loading="loading"
        :filter="filter" @request="onRequest" v-model:pagination="pagination">
        <template v-slot:top-right>
          <div class="row q-gutter-sm">
            <q-select outlined dense v-model="statusFilter" :options="statusOptions" label="Filter Status" clearable
              class="col-auto" />
            <q-input outlined dense debounce="300" v-model="courseNameFilter" placeholder="Cari Nama Kursus" clearable
              class="col-auto" />
            <q-input outlined dense debounce="300" v-model="userNameFilter" placeholder="Cari Nama Peserta" clearable
              class="col-auto" />
            <q-input borderless dense debounce="300" v-model="filter" placeholder="Cari Umum">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn flat icon="rate_review" @click="openReviewDialog(props.row)" label="Review" color="primary"
              :disable="props.row.status === 'completed'" />
            <q-btn v-if="props.row.status === 'completed' && !props.row.certificate_path" flat icon="card_membership"
              @click="generateCertificate(props.row)" label="Generate Certificate" color="secondary" />
            <q-btn v-if="props.row.certificate_path" flat icon="download" @click="downloadCertificate(props.row)"
              label="Download Certificate" color="info" />
          </q-td>
        </template>
      </q-table>
    </div>

    <q-dialog v-model="reviewDialog" persistent>
      <q-card style="min-width: 600px">
        <q-card-section>
          <div class="text-h6">Review Peserta</div>
          <div v-if="reviewLoading" class="text-center q-py-md">
            <q-spinner-dots color="primary" size="30px" />
            <p>Memuat detail enrollment...</p>
          </div>
          <div v-else-if="selectedEnrollment">
            <q-list dense>
              <q-item>
                <q-item-section>
                  <q-item-label>Peserta:</q-item-label>
                </q-item-section>
                <q-item-section side>{{ selectedEnrollment.user.name }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>Kursus:</q-item-label>
                </q-item-section>
                <q-item-section side>{{ selectedEnrollment.course.name }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>Progres Keseluruhan:</q-item-label>
                </q-item-section>
                <q-item-section side>{{ selectedEnrollment.progress_percentage }}%</q-item-section>
              </q-item>
            </q-list>

            <q-separator class="q-my-md" />

            <div class="text-subtitle1 q-mb-sm">Progres Modul:</div>
            <q-list bordered separator>
              <q-item v-for="modProg in selectedEnrollment.module_progresses" :key="modProg.id">
                <q-item-section>
                  <q-item-label>{{ modProg.module.title }}</q-item-label>
                  <q-item-label caption>Status: {{ modProg.status }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon v-if="modProg.status === 'completed'" name="check_circle" color="green" />
                  <q-icon v-else name="pending" color="orange" />
                </q-item-section>
              </q-item>
            </q-list>

            <q-separator class="q-my-md" />

            <div class="text-subtitle1 q-mb-sm">Progres Konten:</div>
            <q-list bordered separator>
              <q-item v-for="conProg in selectedEnrollment.content_progresses" :key="conProg.id">
                <q-item-section>
                  <q-item-label>{{ conProg.module_content.title }}</q-item-label>
                  <q-item-label caption>Tipe: {{ conProg.module_content.type }} | Status: {{ conProg.status
                    }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon v-if="conProg.status === 'completed'" name="check_circle" color="green" />
                  <q-icon v-else name="pending" color="orange" />
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="finalScore" label="Final Score (0-100)" type="number" step="0.1" autofocus
            :error="!!finalScoreError" :error-message="finalScoreError" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Submit Review" @click="reviewEnrollment" :loading="reviewLoading" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';
import { api } from 'src/boot/axios';
import { useQuasar, QTableColumn } from 'quasar';
import { qCookies } from 'src/boot/cookies';

interface ModuleProgress {
  id: number;
  module_id: number;
  enrollment_id: number;
  status: string;
  completed_at: string | null;
  module: {
    id: number;
    title: string;
    order: number;
  };
}

interface ContentProgress {
  id: number;
  content_id: number;
  module_progress_id: number;
  status: string;
  completed_at: string | null;
  module_content: {
    id: number;
    title: string;
    type: string;
    order: number;
  };
}

interface Enrollment {
  id: number;
  user_id: number;
  course_id: number;
  registration_id: number;
  status: string;
  started_at: string;
  completed_at: string | null;
  progress_percentage: number;
  final_score: number | null;
  admin_reviewed_at: string | null;
  certificate_path: string | null;
  certificate_number: string | null;
  created_at: string;
  updated_at: string;
  certificate_url: string | null;
  user: {
    id: number;
    name: string;
    email: string;
  };
  course: {
    id: number;
    name: string;
    description: string;
  };
  module_progresses?: ModuleProgress[];
  content_progresses?: ContentProgress[];
}

export default defineComponent({
  name: 'EnrollmentReviewIndexPage',
  setup() {
    const $q = useQuasar();
    const enrollments = ref<Enrollment[]>([]);
    const columns: QTableColumn[] = [
      {
        name: 'id',
        required: true,
        label: 'ID',
        align: 'left',
        field: (row: Enrollment) => row.id,
        format: (val: string) => `${val}`,
        sortable: true,
      },
      {
        name: 'student_name',
        align: 'left',
        label: 'Student Name',
        field: (row: Enrollment) => row.user.name,
        sortable: true,
      },
      {
        name: 'course_title',
        align: 'left',
        label: 'Course Title',
        field: (row: Enrollment) => row.course.name,
        sortable: true,
      },
      {
        name: 'status',
        align: 'left',
        label: 'Status',
        field: 'status',
        sortable: true,
      },
      {
        name: 'progress_percentage',
        align: 'left',
        label: 'Progress',
        field: 'progress_percentage',
        sortable: true,
      },
      {
        name: 'final_score',
        align: 'left',
        label: 'Final Score',
        field: 'final_score',
        sortable: true,
      },
      {
        name: 'admin_reviewed_at',
        align: 'left',
        label: 'Reviewed At',
        field: 'admin_reviewed_at',
        sortable: true,
      },
      {
        name: 'actions',
        label: 'Actions',
        field: 'actions',
        align: 'center',
      },
    ];

    const loading = ref(false);
    const filter = ref('');
    const statusFilter = ref(null);
    const courseNameFilter = ref('');
    const userNameFilter = ref('');

    const statusOptions = [
      { label: 'All', value: 'all' },
      { label: 'Completed', value: 'completed' },
      { label: 'Pending Admin Review', value: 'pending_admin_review' },
      { label: 'In Progress', value: 'in_progress' },
    ];

    const pagination = ref({
      sortBy: 'id',
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
    });

    const reviewDialog = ref(false);
    const selectedEnrollment = ref<Enrollment | null>(null);
    const finalScore = ref<number | null>(null);
    const finalScoreError = ref('');
    const reviewLoading = ref(false);

    const onRequest = async (props: {
      pagination: {
        page: number;
        rowsPerPage: number;
        sortBy: string;
        descending: boolean;
      };
      filter?: string;
      getCellValue?: (col: QTableColumn, row: Enrollment) => unknown;
    }) => {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      const filterValue = props.filter;

      loading.value = true;

      try {
        const response = await api.get('/admin/enrollments', {
          headers: {
            Authorization: `Bearer ${qCookies.get('token')}`,
          },
          params: {
            page: page,
            limit: rowsPerPage,
            sortBy: sortBy,
            descending: descending ? 1 : 0,
            filter: filterValue,
            status: statusFilter.value?.value || 'all',
            course_name: courseNameFilter.value,
            user_name: userNameFilter.value,
          },
        });

        enrollments.value = response.data.data;
        pagination.value.rowsNumber = response.data.total;
        pagination.value.page = page;
        pagination.value.rowsPerPage = rowsPerPage;
        pagination.value.sortBy = sortBy;
        pagination.value.descending = descending;
      } catch (error) {
        console.error('Error fetching enrollments:', error);
        $q.notify({
          type: 'negative',
          message: 'Failed to load enrollments.',
        });
      } finally {
        loading.value = false;
      }
    };

    const openReviewDialog = async (enrollment: Enrollment) => {
      selectedEnrollment.value = null; // Clear previous data
      reviewLoading.value = true;
      reviewDialog.value = true;
      finalScoreError.value = '';

      try {
        const response = await api.get(`/admin/enrollments/${enrollment.id}`, {
          headers: {
            Authorization: `Bearer ${qCookies.get('token')}`,
          },
        });
        selectedEnrollment.value = response.data.data;
        finalScore.value = selectedEnrollment.value?.final_score; // Pre-fill if already has a score
      } catch (error) {
        console.error('Error fetching enrollment details:', error);
        $q.notify({
          type: 'negative',
          message: 'Failed to load enrollment details.',
        });
        reviewDialog.value = false; // Close dialog if details fail to load
      } finally {
        reviewLoading.value = false;
      }
    };

    const reviewEnrollment = async () => {
      if (!selectedEnrollment.value) return;

      // Validation for finalScore
      if (finalScore.value === null || finalScore.value < 0 || finalScore.value > 100) {
        finalScoreError.value = 'Final Score must be between 0 and 100.';
        return;
      }
      finalScoreError.value = ''; // Clear error if valid

      try {
        await api.put(
          `/admin/enrollments/${selectedEnrollment.value.id}/review`,
          {
            final_score: finalScore.value,
          },
          {
            headers: {
              Authorization: `Bearer ${qCookies.get('token')}`,
            },
          }
        );
        $q.notify({
          type: 'positive',
          message: 'Enrollment reviewed successfully!',
        });
        reviewDialog.value = false;
        onRequest({ pagination: pagination.value, filter: filter.value }); // Refresh table
      } catch (error) {
        console.error('Error reviewing enrollment:', error);
        $q.notify({
          type: 'negative',
          message: 'Failed to review enrollment.',
        });
      }
    };

    const generateCertificate = async (enrollment: Enrollment) => {
      try {
        const response = await api.post(
          `/admin/enrollments/${enrollment.id}/generate-certificate`,
          {},
          {
            headers: {
              Authorization: `Bearer ${qCookies.get('token')}`,
            },
          }
        );
        $q.notify({
          type: 'positive',
          message: response.data.message,
        });
        onRequest({ pagination: pagination.value, filter: filter.value }); // Refresh table
      } catch (error) {
        console.error('Error generating certificate:', error);
        $q.notify({
          type: 'negative',
          message: 'Failed to generate certificate.',
        });
      }
    };

    const downloadCertificate = (enrollment: Enrollment) => {
      if (enrollment.certificate_url) {
        window.open(enrollment.certificate_url, '_blank');
      } else {
        $q.notify({
          type: 'negative',
          message: 'Certificate URL not found.',
        });
      }
    };

    onMounted(() => {
      onRequest({ pagination: pagination.value, filter: filter.value });
    });

    watch([statusFilter, courseNameFilter, userNameFilter], () => {
      onRequest({ pagination: pagination.value, filter: filter.value });
    });

    return {
      enrollments,
      columns,
      loading,
      filter,
      statusFilter,
      courseNameFilter,
      userNameFilter,
      statusOptions,
      pagination,
      reviewDialog,
      selectedEnrollment,
      finalScore,
      finalScoreError,
      reviewLoading,
      onRequest,
      openReviewDialog,
      reviewEnrollment,
      generateCertificate,
      downloadCertificate,
    };
  },
});
</script>

<style scoped></style>
