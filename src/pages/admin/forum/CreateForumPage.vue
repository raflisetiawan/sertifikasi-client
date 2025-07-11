<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">Buat Forum Baru untuk Kursus ID: {{ courseId }}</div>

    <q-card>
      <q-card-section>
        <q-form @submit="createForum">
          <q-input
            v-model="forumData.title"
            label="Judul Forum"
            outlined
            class="q-mb-md"
            :rules="[(val) => !!val || 'Judul harus diisi']"
          />
          <q-input
            v-model="forumData.description"
            label="Deskripsi Forum"
            outlined
            type="textarea"
            rows="4"
            class="q-mb-md"
            :rules="[(val) => !!val || 'Deskripsi harus diisi']"
          />

          <q-btn
            label="Buat Forum"
            color="primary"
            type="submit"
            :loading="loading"
          />
          <q-btn
            label="Batal"
            color="grey"
            flat
            class="q-ml-sm"
            @click="$router.go(-1)"
          />
        </q-form>
      </q-card-section>
    </q-card>

    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useForumStore } from 'src/stores/forum';
import { useNotify } from 'src/composables/notifications';

const route = useRoute();
const router = useRouter();
const forumStore = useForumStore();

const courseId = Number(route.params.courseId);
const loading = ref(false);

const forumData = reactive({
  title: '',
  description: '',
});

const createForum = async () => {
  loading.value = true;
  try {
    await forumStore.createCourseForum(courseId, forumData);
    useNotify('Forum berhasil dibuat', 'positive');
    router.push(`/admin/courses/${courseId}/forum`);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui';
    useNotify(errorMessage || 'Gagal membuat forum', 'negative');
  } finally {
    loading.value = false;
  }
};
</script>
