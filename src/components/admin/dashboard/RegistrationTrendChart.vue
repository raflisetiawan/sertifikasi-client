<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">Tren Pendaftaran Pengguna (7 Hari Terakhir)</div>
    </q-card-section>
    <q-card-section>
      <apexchart type="area" height="350" :options="chartOptions" :series="series"></apexchart>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RegistrationTrend } from 'src/models/dashboard';

const props = defineProps<{
  trends: RegistrationTrend[];
}>();

const series = computed(() => [
  {
    name: 'Pendaftar Baru',
    data: props.trends.map(t => t.count),
  },
]);

const chartOptions = computed(() => ({
  chart: {
    height: 350,
    type: 'area',
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth',
  },
  xaxis: {
    type: 'datetime',
    categories: props.trends.map(t => t.date),
  },
  tooltip: {
    x: {
      format: 'dd/MM/yy',
    },
  },
  colors: ['#008FFB'],
}));
</script>
