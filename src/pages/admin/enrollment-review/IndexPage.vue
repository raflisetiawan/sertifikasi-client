<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table title="Enrollment Reviews" :rows="enrollments" :columns="columns" row-key="id" :loading="loading"
        :filter="filter" @request="onRequest" v-model:pagination="pagination">
        <template v-slot:top-right>
          <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
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
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Review Enrollment</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="finalScore" label="Final Score (optional)" type="number" step="0.1" autofocus
            @keyup.enter="reviewEnrollment" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Submit Review" @click="reviewEnrollment" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { api } from 'src/boot/axios';
import { useQuasar, QTableColumn } from 'quasar';
import { qCookies } from 'src/boot/cookies';

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
            status: 'pending_admin_review', // Only fetch enrollments pending review
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

    const openReviewDialog = (enrollment: Enrollment) => {
      selectedEnrollment.value = enrollment;
      finalScore.value = enrollment.final_score; // Pre-fill if already has a score
      reviewDialog.value = true;
    };

    const reviewEnrollment = async () => {
      if (!selectedEnrollment.value) return;

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

    return {
      enrollments,
      columns,
      loading,
      filter,
      pagination,
      reviewDialog,
      finalScore,
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
