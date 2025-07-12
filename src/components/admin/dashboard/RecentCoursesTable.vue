<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">Aktivitas Kursus Terbaru</div>
    </q-card-section>
    <q-card-section>
      <q-table :rows="courses" :columns="columns" row-key="id" flat bordered dense>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn dense round flat icon="visibility" :to="{ name: 'DetailCoursePage', params: { id: props.row.id } }"></q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { Courses } from 'src/models/course';
import { QTableColumn } from 'quasar';
import { useDateFormat } from 'src/composables/format';

defineProps<{
  courses: Courses[];
}>();

const columns: QTableColumn[] = [
  { name: 'name', required: true, label: 'Nama Kursus', align: 'left', field: 'name', sortable: true },
  { name: 'status', label: 'Status', align: 'center', field: 'status', sortable: true },
  { name: 'updated_at', label: 'Terakhir Diperbarui', field: 'updated_at', sortable: true, format: (val) => useDateFormat(val) },
  { name: 'actions', label: 'Aksi', field: 'id', align: 'center' },
];
</script>
