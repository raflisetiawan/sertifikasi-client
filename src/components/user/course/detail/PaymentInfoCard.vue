<template>
  <q-card class="q-mb-md">
    <q-card-section>
      <div class="text-subtitle1">Informasi Pembayaran</div>
      <q-list>
        <q-item>
          <q-item-section>
            <q-item-label caption>Status Pembayaran</q-item-label>
            <q-item-label>
              <q-chip :color="getPaymentStatusColor(paymentStatus)" text-color="white">
                {{ getPaymentStatusLabel(paymentStatus) }}
              </q-chip>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label caption>Jumlah Dibayar</q-item-label>
            <q-item-label>{{ formatCurrency(paymentAmount) }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="paymentDate">
          <q-item-section>
            <q-item-label caption>Tanggal Pembayaran</q-item-label>
            <q-item-label>{{ formatDate(paymentDate) }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useFormatters } from 'src/composables/useFormatters';
import { useStatusUtils } from 'src/composables/useStatusUtils';

defineProps({
  paymentStatus: { type: String, default: null },
  paymentAmount: { type: String, default: null },
  paymentDate: { type: String, default: null },
});

const { formatDate, formatCurrency } = useFormatters();
const { getPaymentStatusColor, getPaymentStatusLabel } = useStatusUtils();
</script>
