<template>
  <q-page class="q-pa-md">
    <div v-if="forum">
      <div class="text-h4 q-mb-md">{{ forum.title }}</div>
      <p>{{ forum.description }}</p>

      <q-btn color="primary" label="Buat Utas Baru" @click="showCreateThreadDialog = true" class="q-mb-md" />

      <q-list bordered separator>
        <q-item v-for="thread in forum.threads" :key="thread.id" clickable v-ripple
          :to="{ name: 'thread.show', params: { id: thread.id } }">
          <q-item-section avatar>
            <q-avatar size="32px">
              <img :src="thread.user.image || 'src/assets/profile.jpg'">
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-h6">{{ thread.title }}</q-item-label>
            <q-item-label caption>
              oleh {{ thread.user.name }}
              <span v-if="thread.user.email">({{ thread.user.email }})</span>
            </q-item-label>
            <q-item-label caption>{{ thread.body }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label caption>Balasan: {{ thread.replies_count }}</q-item-label>
            <q-item-label caption>Aktivitas Terakhir: {{ new Date(thread.last_activity_at).toLocaleString() }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>

    <q-dialog v-model="showCreateThreadDialog" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Buat Utas Baru</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input v-model="newThread.title" label="Judul" outlined />
          <q-editor v-model="newThread.body" class="q-mt-md" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Batal" v-close-popup />
          <q-btn flat label="Buat" color="primary" @click="createThread" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useForumStore } from 'src/stores/forum';
import { Forum } from 'src/models/forum';
import { useNotify } from 'src/composables/notifications';

const route = useRoute();
const forumStore = useForumStore();
const forum = ref<Forum | null>(null);
const loading = ref(false);
const showCreateThreadDialog = ref(false);

const newThread = reactive({
  title: '',
  body: '',
});

const fetchForum = async () => {
  loading.value = true;
  const forumId = Number(route.params.courseId);
  forum.value = await forumStore.fetchCourseForum(forumId);
  console.log('Forum yang diambil:', forum.value);
  loading.value = false;
};

const createThread = async () => {
  loading.value = true;
  try {
    if (!forum.value) {
      useNotify('Data forum tidak dimuat.', 'negative');
      return;
    }
    const threadForumId = forum.value.id; // Use forum.value.id for creating thread
    console.log('Membuat utas untuk forumId:', threadForumId);
    await forumStore.createThread(threadForumId, newThread);
    useNotify('Utas berhasil dibuat', 'positive');
    showCreateThreadDialog.value = false;
    newThread.title = '';
    newThread.body = '';
    await fetchForum();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui';
    useNotify(errorMessage || 'Gagal membuat utas', 'negative');
  } finally {
    loading.value = false;
  }
};

onMounted(fetchForum);
</script>
