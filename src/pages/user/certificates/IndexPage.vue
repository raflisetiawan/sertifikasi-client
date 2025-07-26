<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table title="My Certificates" :rows="certificates" :columns="columns" row-key="id" :loading="loading"
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
            <q-btn flat icon="download" @click="downloadCertificate(props.row)" label="Download" color="primary" />
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { api } from 'src/boot/axios';
import { QTableColumn, QTableProps, useQuasar } from 'quasar';
import { qCookies } from 'src/boot/cookies';

interface Certificate {
  id: number;
  course_id: number;
  certificate_number: string;
  certificate_path: string;
  certificate_url: string;
  completed_at: string;
  course: {
    name: string;
  };
}

export default defineComponent({
  name: 'UserCertificatesIndexPage',
  setup() {
    const $q = useQuasar();
    const certificates = ref<Certificate[]>([]);
    const columns: QTableColumn[] = [
      {
        name: 'id',
        required: true,
        label: 'ID',
        align: 'left',
        field: (row: Certificate) => row.id,
        format: (val: string) => `${val}`,
        sortable: true,
      },
      {
        name: 'course_name',
        align: 'left',
        label: 'Course Name',
        field: (row) => row.course.name,
        sortable: true,
      },
      {
        name: 'certificate_number',
        align: 'left',
        label: 'Certificate Number',
        field: 'certificate_number',
        sortable: true,
      },
      {
        name: 'completed_at',
        align: 'left',
        label: 'Completed At',
        field: 'completed_at',
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

    const onRequest: QTableProps['onRequest'] = async (props) => {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      const filterValue = props.filter;

      loading.value = true;

      try {
        const response = await api.get('/user/certificates', {
          headers: {
            Authorization: `Bearer ${qCookies.get('token')}`,
          },
          params: {
            page: page,
            limit: rowsPerPage,
            sortBy: sortBy,
            descending: descending ? 1 : 0,
            filter: filterValue,
          },
        });

        certificates.value = response.data.data;
        pagination.value.rowsNumber = response.data.total;
        pagination.value.page = page;
        pagination.value.rowsPerPage = rowsPerPage;
        pagination.value.sortBy = sortBy;
        pagination.value.descending = descending;
      } catch (error) {
        console.error('Error fetching certificates:', error);
        $q.notify({
          type: 'negative',
          message: 'Failed to load certificates.',
        });
      } finally {
        loading.value = false;
      }
    };

    const downloadCertificate = (certificate: Certificate) => {
      if (certificate.certificate_url) {
        window.open(certificate.certificate_url, '_blank');
      } else {
        $q.notify({
          type: 'negative',
          message: 'Certificate URL not found.',
        });
      }
    };

    onMounted(() => {
      const { page, rowsPerPage, sortBy, descending } = pagination.value;
      onRequest({
        pagination: {
          page,
          rowsPerPage,
          sortBy,
          descending,
        },
        filter: filter.value,
        getCellValue: () => null, // Required by type, but not used
      });
    });

    return {
      certificates,
      columns,
      loading,
      filter,
      pagination,
      onRequest,
      downloadCertificate,
    };
  },
});
</script>

<style scoped></style>
