<template>
  <div class="q-pa-md">
    <q-markup-table>
      <thead>
        <tr>
          <th class="text-left">No</th>
          <th class="text-left">Pertanyaan</th>
          <th class="text-left">Email</th>
          <th class="text-left">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="text-left">{{ nomor++ }}</td>
          <td class="text-left"> <q-skeleton type="text" /></td>
          <td class="text-left"> <q-skeleton type="text" /></td>
          <td class="text-left"> <q-skeleton type="QBtn" /></td>
        </tr>
        <tr>
          <td class="text-left">{{ nomor++ }}</td>
          <td class="text-left"> <q-skeleton type="text" /></td>
          <td class="text-left"> <q-skeleton type="text" /></td>
          <td class="text-left"> <q-skeleton type="QBtn" /></td>
        </tr>
        <tr>
          <td class="text-left">{{ nomor++ }}</td>
          <td class="text-left"> <q-skeleton type="text" /></td>
          <td class="text-left"> <q-skeleton type="text" /></td>
          <td class="text-left"> <q-skeleton type="QBtn" /></td>
        </tr>
        <tr>
          <td class="text-left">{{ nomor++ }}</td>
          <td class="text-left"> <q-skeleton type="text" /></td>
          <td class="text-left"> <q-skeleton type="text" /></td>
          <td class="text-left"> <q-skeleton type="QBtn" /></td>
        </tr>
        <tr>
          <td class="text-left">{{ nomor++ }}</td>
          <td class="text-left"> <q-skeleton type="text" /></td>
          <td class="text-left"> <q-skeleton type="text" /></td>
          <td class="text-left"> <q-skeleton type="QBtn" /></td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
</template>

<script setup lang="ts">
const nomor = 1;
</script>
