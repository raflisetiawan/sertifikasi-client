import { boot } from 'quasar/wrappers';
import VueApexCharts from 'vue3-apexcharts';

export default boot(({ app }) => {
  app.use(VueApexCharts);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app.component('ApexChart', (VueApexCharts as any).default);
});
