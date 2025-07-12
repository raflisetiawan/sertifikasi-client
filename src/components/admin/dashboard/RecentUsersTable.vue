<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">Pengguna Baru Terdaftar</div>
    </q-card-section>
    <q-card-section>
      <q-table :rows="users" :columns="columns" row-key="id" flat bordered dense />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { User } from 'src/models/user';
import { QTableColumn } from 'quasar';
import { useDateFormat } from 'src/composables/format';

defineProps<{
  users: User[];
}>();

const columns: QTableColumn[] = [
  { name: 'name', required: true, label: 'Nama', align: 'left', field: 'name', sortable: true },
  { name: 'email', label: 'Email', align: 'left', field: 'email', sortable: true },
  { name: 'created_at', label: 'Tanggal Daftar', field: 'created_at', sortable: true, format: (val) => useDateFormat(val) },
];
</script>
