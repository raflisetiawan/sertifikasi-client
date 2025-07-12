<template>
  <div class="q-pa-md">
    <q-table title="Manage FAQ" :rows="$state.faqs" :columns="columns" row-key="id" :loading="loading"
      :filter="searchQuery" @request="onRequest" v-model:pagination="pagination">
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="searchQuery" placeholder="Cari...">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-select outlined dense v-model="selectedCategory" :options="categoryOptions" label="Filter Kategori" clearable
          class="q-ml-md" style="min-width: 150px;">
        </q-select>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn icon="edit" flat color="green" @click="actionClick(props.row, true)"><q-tooltip>Edit</q-tooltip></q-btn>
          <q-btn icon="delete" flat color="red" @click="actionClick(props.row, false)"><q-tooltip>Hapus</q-tooltip></q-btn>
        </q-td>
      </template>
    </q-table>
    <q-page-sticky position="bottom-right" :offset="[18, 18]" @click="$state.addDialog = true">
      <q-btn fab icon="add" color="primary" />
    </q-page-sticky>
  </div>
</template>

<script setup lang="ts">
import { useFaqStore } from 'src/stores/faq';
import { Faqs } from 'src/models/faq';
import { ref, onMounted, watch } from 'vue';
import { QTableColumn, QTableProps } from 'quasar';

const { setFaqs, $state } = useFaqStore();

const loading = ref(false);
const searchQuery = ref('');
const selectedCategory = ref(null);
const categoryOptions = ref<string[]>(['Akun', 'Pembayaran', 'Kursus', 'Teknis', 'Lain-lain']); // Example categories

const columns: QTableColumn[] = [
  { name: 'no', label: 'No', align: 'left', field: 'no' },
  { name: 'question', required: true, label: 'Pertanyaan', align: 'left', field: 'question', sortable: true },
  { name: 'category', label: 'Kategori', align: 'left', field: 'category', sortable: true },
  { name: 'actions', label: 'Aksi', field: 'actions', align: 'center' }
];

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
    await setFaqs(filterValue, selectedCategory.value || undefined);
    // Assuming setFaqs updates $state.faqs directly and doesn't return paginated data
    // You might need to adjust this part if your API returns paginated data
    pagination.value.rowsNumber = $state.faqs.length; // This needs to be the total count from API
    pagination.value.page = page;
    pagination.value.rowsPerPage = rowsPerPage;
    pagination.value.sortBy = sortBy;
    pagination.value.descending = descending;
  } catch (error) {
    console.error('Error fetching FAQs:', error);
  } finally {
    loading.value = false;
  }
};

const actionClick = (data: Faqs, isUpdate: boolean) => {
  isUpdate ? $state.updateDialog = true : $state.deleteDialog = true;
  $state.faq.id = data.id;
  $state.faq.answer = data.answer;
  $state.faq.question = data.question;
  $state.faq.category = data.category; // Set category for edit dialog
  $state.faq.created_at = data.created_at;
  $state.faq.updated_at = data.updated_at;
};

watch([searchQuery, selectedCategory], () => {
  onRequest({ pagination: pagination.value, filter: searchQuery.value, getCellValue: () => null });
});

onMounted(() => {
  onRequest({ pagination: pagination.value, filter: searchQuery.value, getCellValue: () => null });
});
</script>

<style scoped></style>
