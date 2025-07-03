<template>
  <q-card>
    <q-card-section>
      <div class="text-h4 q-mb-md">Materi</div>
      <q-list bordered separator>
        <q-item v-for="material in course.materials" :key="material.file" clickable>
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
      <div class="text-h4 q-mb-md">Deskripsi Kelas</div>
      <q-list bordered separator>
        <q-item>
          <q-item-section>
            <q-item-label>
              Fasilitas : <span class="text-body-1 ">{{
                course.facility
                }}</span></q-item-label>
          </q-item-section>
          <q-item-section>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section no-wrap>
            <q-item-label>Durasi : <span class="text-body-1 text-weight-bold">{{ course.duration
                }}</span></q-item-label>
          </q-item-section>
          <q-item-section>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
    <q-card-section>
      <div>
        <div class="text-h4">{{ course.name }}</div>
        <div v-html="course.description"></div>
      </div>
    </q-card-section>

    <q-separator />
  </q-card>
</template>

<script async setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useMeta, useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { MyProfileDetailCourse } from 'src/models/course';

const { cookies: qCookies } = useQuasar();
const route = useRoute();
const course = ref<MyProfileDetailCourse>({ name: '', description: '', materials: [], duration: '', facility: '', id: 0 });
useMeta(() => {
  return {
    title: course.value.name + ' - My Profile - UISI Digiclass'
  }
})

onMounted(async () => {
  try {
    const response = await api.get(`courses/${route.params.id}/with-materials`, {
      headers: {
        Authorization: `Bearer ${qCookies.get('token')}`
      }
    });
    course.value = response.data.data;

  } catch (error) {
    console.error('Error fetching course details:', error);
  }

});


</script>

<style scoped>
/* Add your custom styles here */
</style>
