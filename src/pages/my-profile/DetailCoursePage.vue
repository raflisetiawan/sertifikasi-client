<template>
  <q-card>
    <q-card-section>
      <h2>Materi</h2>
      <q-list bordered separator>
        <q-item v-for="material in course.materials" :key="material.id" clickable>
          <q-item-section>
            <q-item-label>{{ material.title }}</q-item-label>
            <div v-html="material.description"></div>
          </q-item-section>
          <q-item-section side top>
            <q-btn icon="cloud_download" :href="material.file" target="_blank" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
    <q-card-section>
      <div>
        <q-card-title class="text-h3">{{ course.name }}</q-card-title>
        <div v-html="course.description"></div>
      </div>
    </q-card-section>

    <q-separator />


  </q-card>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const { localStorage: qLocalStorage } = useQuasar();
const route = useRoute();
const course = ref({ name: '', description: '', image: '', materials: [] });

onMounted(async () => {
  try {
    const response = await api.get(`courses/${route.params.id}/with-materials`, {
      headers: {
        Authorization: `Bearer ${qLocalStorage.getItem('token')}`
      }
    });
    course.value = response.data.data;
  } catch (error) {
    console.error('Error fetching course details:', error);
  }
});

const downloadMaterial = (file) => {
  // Implement your download logic here
  console.log('Downloading material:', file);
};
</script>

<style scoped>
/* Add your custom styles here */
</style>
