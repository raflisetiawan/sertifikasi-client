<template>
  <div class="q-pa-md">
    <div class="text-h5 q-mb-md">List Materi : {{ courseName }}</div>
    <div class="row q-mb-md" v-for="material in $state.materials" :key="material.id">
      <q-card class="my-card ">
        <q-card-section>
          <div class="text-h6">{{ material.title }}</div>
        </q-card-section>
        <q-card-section>
          {{ material.description }}
        </q-card-section>

        <q-separator dark />

        <q-card-actions>
          <q-btn color="primary" target="_blank" :href="material.file">Lihat File</q-btn>
          <q-btn color="green" @click="$state.editDialog = true; $state.material = material">Edit</q-btn>
          <q-btn color="red" @click="$state.deleteDialog = true; $state.material = material">Hapus</q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts" async>
import { useMaterialStore } from 'src/stores/material';
import { useCourseStore } from 'src/stores/course';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const { getCourseNameById } = useCourseStore()
const { getMaterialByCourseId, $state } = useMaterialStore()
const courseName = ref<string>('');
const getMaterial = async () => {
  try {
    courseName.value = await getCourseNameById(route.params.id);
    await getMaterialByCourseId(route.params.id);
  } catch (error) {
    throw error;
  }
}

await getMaterial();
</script>

<style scoped></style>
