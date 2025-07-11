<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">Edit Forum</div>

    <q-card v-if="forumData.title !== ''">
      <q-card-section>
        <q-form @submit="updateForum">
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
            label="Perbarui Forum"
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
    <div v-else-if="!loading" class="text-h6">Forum tidak ditemukan atau tidak dapat dimuat.</div>

    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useForumStore } from 'src/stores/forum';
import { useNotify } from 'src/composables/notifications';

const route = useRoute();
const router = useRouter();
const forumStore = useForumStore();

const forumId = Number(route.params.id);
const loading = ref(false);

const forumData = reactive({
  title: '',
  description: '',
});

const fetchForumDetails = async () => {
  loading.value = true;
  try {
    const forum = await forumStore.fetchAdminCourseForum(forumId);
    if (forum) {
      forumData.title = forum.title;
      forumData.description = forum.description;
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui';
    useNotify(errorMessage || 'Gagal mengambil detail forum', 'negative');
  } finally {
    loading.value = false;
  }
};

const updateForum = async () => {
  loading.value = true;
  try {
    await forumStore.updateForum(forumId, forumData);
    useNotify('Forum berhasil diperbarui', 'positive');
    router.push(`/admin/courses/${forumId}/forum`); // Assuming a redirect back to the course forum page
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui';
    useNotify(errorMessage || 'Gagal memperbarui forum', 'negative');
  } finally {
    loading.value = false;
  }
};

onMounted(fetchForumDetails);
</script>
