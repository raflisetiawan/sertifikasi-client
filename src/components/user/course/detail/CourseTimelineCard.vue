<template>
  <q-card class="q-mb-md">
    <q-card-section>
      <div class="text-subtitle1">Periode Kelas</div>
      <div class="row q-col-gutter-sm q-mt-sm">
        <div class="col-6">
          <q-item class="bg-grey-2 rounded-borders">
            <q-item-section>
              <q-item-label caption>Mulai</q-item-label>
              <q-item-label>{{ formatDate(startDate) }}</q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <div class="col-6">
          <q-item class="bg-grey-2 rounded-borders">
            <q-item-section>
              <q-item-label caption>Selesai</q-item-label>
              <q-item-label>{{ formatDate(endDate) }}</q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useFormatters } from 'src/composables/useFormatters';

defineProps({
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
});

const { formatDate } = useFormatters();
</script>
