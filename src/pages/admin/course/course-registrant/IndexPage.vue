<template>
  <q-page padding>
    <RegistrantTable />
  </q-page>
</template>

<script setup lang="ts">
import RegistrantTable from 'components/admin/course/course-registrant/RegistrantTable.vue'
import { useMetaTitle } from 'src/composables/meta';

useMetaTitle('Pendaftar Kelas - Admin')
</script>

<style scoped></style>
