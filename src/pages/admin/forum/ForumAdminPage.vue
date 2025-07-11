<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">Manajemen Forum untuk Kursus ID: {{ courseId }}</div>

    <q-card v-if="forum">
      <q-card-section>
        <div class="text-h5">{{ forum.title }}</div>
        <p>{{ forum.description }}</p>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="Edit Forum" color="primary" :to="`/admin/forums/${forum.id}/edit`" />
        <q-btn label="Hapus Forum" color="negative" @click="confirmDelete" />
      </q-card-actions>
    </q-card>

    <q-card v-else class="q-mt-md">
      <q-card-section>
        <div class="text-h6">Forum tidak ditemukan untuk kursus ini.</div>
        <q-btn label="Buat Forum Baru" color="positive" :to="`/admin/courses/${courseId}/forum/create`"
          class="q-mt-md" />
      </q-card-section>
    </q-card>

    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useForumStore } from 'src/stores/forum';
import { Forum } from 'src/models/forum';
import { useNotify } from 'src/composables/notifications';
import { useQuasar } from 'quasar';

const route = useRoute();
const forumStore = useForumStore();
const $q = useQuasar();

const courseId = Number(route.params.courseId);
const forum = ref<Forum | null>(null);
const loading = ref(false);

const fetchForum = async () => {
  loading.value = true;
  try {
    forum.value = await forumStore.fetchAdminCourseForum(courseId);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui';
    useNotify(errorMessage || 'Gagal mengambil forum kursus', 'negative');
    forum.value = null; // Ensure forum is null if fetch fails
  } finally {
    loading.value = false;
  }
};

const confirmDelete = () => {
  $q.dialog({
    title: 'Konfirmasi Penghapusan',
    message: 'Apakah Anda yakin ingin menghapus forum ini? Tindakan ini tidak dapat dibatalkan.',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    if (forum.value) {
      await deleteForum(forum.value.id);
    }
  });
};

const deleteForum = async (forumId: number) => {
  loading.value = true;
  try {
    await forumStore.deleteForum(forumId);
    useNotify('Forum berhasil dihapus', 'positive');
    forum.value = null; // Clear forum after deletion
    // Optionally, redirect or refresh the page
    // router.push(`/admin/courses/${courseId}/forum`);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui';
    useNotify(errorMessage || 'Gagal menghapus forum', 'negative');
  } finally {
    loading.value = false;
  }
};

onMounted(fetchForum);
</script>
