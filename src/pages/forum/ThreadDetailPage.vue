<template>
  <q-page class="q-pa-md">
    <div v-if="thread">
      <div class="text-h4 q-mb-sm">{{ thread.title }}</div>
      <div class="row items-center q-mb-md">
        <q-avatar size="40px" class="q-mr-sm">
          <img :src="thread.user.image || 'src/assets/profile.jpg'">
        </q-avatar>
        <div>
          <div class="text-subtitle1">{{ thread.user.name }}</div>
          <div v-if="thread.user.email" class="text-caption text-grey-7">{{ thread.user.email }}</div>
        </div>
      </div>
      <q-card class="q-mb-md">
        <q-card-section>
          <div v-html="thread.body"></div>
        </q-card-section>
      </q-card>

      <div class="text-h5 q-mb-md">Balasan</div>
      <q-list bordered separator>
        <q-item v-for="post in thread.posts" :key="post.id">
          <q-item-section avatar>
            <q-avatar size="32px">
              <img :src="post.user.image || 'src/assets/profile.jpg'">
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              {{ post.user.name }}
              <span v-if="post.user.email" class="text-caption text-grey-7">({{ post.user.email }})</span>
            </q-item-label>
            <div v-html="post.body"></div>
          </q-item-section>
        </q-item>
      </q-list>

      <q-card class="q-mt-md">
        <q-card-section>
          <div class="text-h6">Kirim Balasan</div>
          <q-editor v-model="newPost.body" class="q-mt-md" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Kirim Balasan" color="primary" @click="createPost" />
        </q-card-actions>
      </q-card>
    </div>
    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useForumStore } from 'src/stores/forum';
import { Thread } from 'src/models/forum';
import { useNotify } from 'src/composables/notifications';

const route = useRoute();
const forumStore = useForumStore();
const thread = ref<Thread | null>(null);
const loading = ref(false);

const newPost = reactive({
  body: '',
});

const fetchThread = async () => {
  loading.value = true;
  const threadId = Number(route.params.id);
  thread.value = await forumStore.fetchThreadWithPosts(threadId);
  loading.value = false;
};

const createPost = async () => {
  loading.value = true;
  try {
    console.log('route.params.id:', route.params.id);
    console.log('Number(route.params.id):', Number(route.params.id));
    await forumStore.createPost(Number(route.params.id), newPost);
    useNotify('Balasan berhasil dikirim', 'positive');
    newPost.body = '';
    await fetchThread();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui';
    useNotify(errorMessage || 'Gagal membuat postingan', 'negative');
  } finally {
    loading.value = false;
  }
};

onMounted(fetchThread);
</script>
