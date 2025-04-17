<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">Riwayat Pembayaran</div>

    <!-- Search & Sort Controls -->
    <div class="row q-col-gutter-md q-mb-md items-center">
      <div class="col-12 col-sm-6">
        <q-input v-model="search" outlined dense placeholder="Cari kelas..." clearable>
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div class="col-12 col-sm-4">
        <q-select v-model="sortBy" :options="sortOptions" outlined dense label="Urutkan">
          <template v-slot:append>
            <q-icon name="sort" />
          </template>
        </q-select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading">
      <div class="row q-col-gutter-md">
        <div v-for="n in 3" :key="n" class="col-12">
          <q-card>
            <q-card-section>
              <q-skeleton type="text" class="text-subtitle1" />
              <q-skeleton type="text" width="60%" class="q-mt-sm" />
              <q-skeleton type="text" width="40%" class="q-mt-sm" />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>


    <!-- Error State -->
    <div v-else-if="error">
      <q-banner class="bg-negative text-white">
        {{ error }}
        <template v-slot:action>
          <q-btn flat label="Coba Lagi" @click="fetchPayments" />
        </template>
      </q-banner>
    </div>

    <!-- Desktop View: Table -->
    <div class="desktop-only" v-else>
      <q-table :rows="filteredPayments" :columns="columns" row-key="id" :loading="loading" flat bordered>
        <template v-slot:body-cell-amount="props">
          <q-td :props="props">
            {{ formatCurrency(props.value) }}
          </q-td>
        </template>
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip :color="getStatusColor(props.value)" text-color="white">
              {{ getStatusLabel(props.value) }}
            </q-chip>
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn flat round color="primary" icon="visibility" @click="showDetails(props.row)">
              <q-tooltip>Lihat Detail</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Mobile View: Cards -->
    <div class="mobile-only q-gutter-y-md">
      <q-card v-for="payment in filteredPayments" :key="payment.id" class="payment-card" @click="showDetails(payment)">
        <q-card-section>
          <div class="row items-center justify-between">
            <div class="text-subtitle1 text-weight-medium">{{ payment.course_name }}</div>
            <q-chip :color="getStatusColor(payment.status)" text-color="white" size="sm">
              {{ getStatusLabel(payment.status) }}
            </q-chip>
          </div>
          <div class="row q-mt-sm items-center justify-between">
            <div class="text-grey-8">{{ formatDate(payment.created_at) }}</div>
            <div class="text-weight-medium">{{ formatCurrency(payment.amount) }}</div>
          </div>
          <div class="text-caption text-grey q-mt-xs">
            {{ payment.payment_type ? `via ${payment.payment_type}` : 'Belum dibayar' }}
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Payment Detail Dialog -->
    <q-dialog v-model="showDetailDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Detail Pembayaran</div>
        </q-card-section>

        <q-card-section class="q-pt-none" v-if="selectedPayment">
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label caption>Nama Kelas</q-item-label>
                <q-item-label>{{ selectedPayment.course_name }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Nomor Invoice</q-item-label>
                <q-item-label>{{ selectedPayment.order_id || '-' }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Jumlah Pembayaran</q-item-label>
                <q-item-label>{{ formatCurrency(selectedPayment.amount) }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Metode Pembayaran</q-item-label>
                <q-item-label>{{ selectedPayment.payment_type || '-' }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Status</q-item-label>
                <q-item-label>
                  <q-chip :color="getStatusColor(selectedPayment.status)" text-color="white">
                    {{ getStatusLabel(selectedPayment.status) }}
                  </q-chip>
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Tanggal Pembayaran</q-item-label>
                <q-item-label>{{ formatDate(selectedPayment.transaction_time) || '-' }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Tutup" color="primary" v-close-popup />
          <q-btn v-if="selectedPayment?.status === 'settlement'" color="primary" label="Lihat Kelas"
            :to="`/dashboard/courses/${selectedPayment.course_id}`" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Pagination -->
    <div class="row justify-center q-mt-md">
      <q-pagination v-model="currentPage" :max="totalPages" :max-pages="5" boundary-links />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { date, QTableColumn } from 'quasar';
import { api } from 'src/boot/axios';
import { qCookies } from 'src/boot/cookies';
import toRupiah from '@develoka/angka-rupiah-js';

interface Payment {
  id: number;
  course_name: string;
  order_id: string;
  amount: number;
  status: string;
  payment_type: string;
  transaction_time: string;
  created_at: string;
  course_id?: number;
}

const loading = ref(false);
const error = ref<string | null>(null);
const payments = ref<Payment[]>([]);
const search = ref('');
const sortBy = ref('latest');
const showDetailDialog = ref(false);
const selectedPayment = ref<Payment | null>(null);
const currentPage = ref(1);
const totalPages = ref(1);
const perPage = ref(10);

const sortOptions = [
  { label: 'Terbaru', value: 'latest' },
  { label: 'Terlama', value: 'oldest' }
];

const columns: QTableColumn[] = [
  {
    name: 'course_name',
    required: true,
    label: 'Nama Kelas',
    align: 'left' as const,
    field: 'course_name',
    sortable: true
  },
  {
    name: 'created_at',
    label: 'Tanggal Daftar',
    align: 'left' as const,
    field: 'created_at',
    format: (val: string) => formatDate(val),
    sortable: true
  },
  {
    name: 'amount',
    label: 'Nominal',
    align: 'right' as const,
    field: 'amount',
    sortable: true
  },
  {
    name: 'transaction_time',
    label: 'Tanggal Transaksi',
    align: 'left' as const,
    field: 'transaction_time',
    format: (val: string) => formatDate(val) || '-',
    sortable: true
  },
  {
    name: 'status',
    label: 'Status',
    align: 'left' as const,
    field: 'status',
    sortable: true
  },
  {
    name: 'actions',
    label: 'Aksi',
    align: 'center' as const,
    field: 'id',
    sortable: false
  }
];
const filteredPayments = computed(() => {
  let result = [...payments.value];

  // Apply search filter
  if (search.value) {
    const searchLower = search.value.toLowerCase();
    result = result.filter(payment =>
      payment.course_name.toLowerCase().includes(searchLower)
    );
  }

  // Apply sorting
  result.sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sortBy.value === 'latest' ? dateB - dateA : dateA - dateB;
  });

  return result;
});

const formatDate = (dateString: string) => {
  return dateString ? date.formatDate(dateString, 'D MMMM YYYY') : '-';
};

const formatCurrency = (amount: number) => {
  return toRupiah(amount, { formal: false });
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    settlement: 'positive',
    capture: 'positive',
    pending: 'warning',
    deny: 'negative',
    cancel: 'grey',
    expire: 'negative',
    failure: 'negative'
  };
  return colors[status] || 'grey';
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    settlement: 'Selesai',
    capture: 'Diproses',
    pending: 'Menunggu',
    deny: 'Ditolak',
    cancel: 'Dibatalkan',
    expire: 'Kadaluarsa',
    failure: 'Gagal'
  };
  return labels[status] || status;
};

const showDetails = (payment: Payment) => {
  selectedPayment.value = payment;
  showDetailDialog.value = true;
};

const fetchPayments = async () => {
  try {
    loading.value = true;
    error.value = null;

    const response = await api.get('/user/payments', {
      headers: {
        Authorization: `Bearer ${qCookies.get('token')}`
      },
      params: {
        page: currentPage.value,
        per_page: perPage.value,
        sort: sortBy.value === 'latest' ? 'desc' : 'asc'
      }
    });

    payments.value = response.data.data;
    totalPages.value = response.data.meta.last_page;
  } catch (err) {
    error.value = 'Gagal memuat data pembayaran';
    console.error('Error fetching payments:', err);
  } finally {
    loading.value = false;
  }
};

// Watch for changes that should trigger a refresh
watch([currentPage, sortBy], () => {
  fetchPayments();
});

onMounted(() => {
  fetchPayments();
});
</script>

<style lang="scss" scoped>
.payment-card {
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
}

.mobile-only {
  display: none;
}

@media (max-width: 599px) {
  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: block;
  }
}
</style>
