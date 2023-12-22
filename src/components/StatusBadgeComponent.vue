<template>
  <div>
    <q-badge :color="getColorByStatus(props.status)">{{ props.status }}</q-badge>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(['status'])
const getColorByStatus = (status: string | undefined) => {
  if (status === 'ongoing') return 'blue';
  if (status === 'not_started') return 'primary';
  if (status === 'completed') return 'green';
}
</script>

<style scoped></style>
