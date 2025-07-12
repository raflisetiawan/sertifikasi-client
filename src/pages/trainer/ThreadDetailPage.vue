<template>
  <q-page padding>
    <div v-if="selectedThread">
      <div class="text-h4 q-mb-md">{{ selectedThread.title }}</div>
      <div class="text-subtitle1 text-grey-8 q-mb-lg">Oleh: {{ selectedThread.user.name }}</div>

      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-body1" v-html="selectedThread.body"></div>
        </q-card-section>
      </q-card>

      <div class="text-h5 q-mt-lg q-mb-md">Balasan ({{ selectedThread.posts.length }})</div>

      <q-list bordered separator class="q-mb-lg">
        <q-item v-for="post in selectedThread.posts" :key="post.id">
          <q-item-section avatar>
            <q-avatar>
              <img :src="post.user.image || 'https://cdn.quasar.dev/img/avatar.png'">
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ post.user.name }}</q-item-label>
            <q-item-label caption>{{ post.created_at }}</q-item-label>
            <q-item-label class="q-mt-sm">
              <div v-html="post.body"></div>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <q-form @submit.prevent="onSubmitPost" class="q-gutter-md">
        <q-editor v-model="postForm.content" label="Tulis Balasan" min-height="8rem" />
        <q-btn label="Kirim Balasan" type="submit" color="primary" />
      </q-form>
    </div>
    <div v-else>
      <q-spinner-dots size="lg" color="primary" />
      <p>Memuat detail thread...</p>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTrainerForumStore } from 'src/stores/trainerForum';
import { useMetaTitle } from 'src/composables/meta';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';

useMetaTitle('Detail Thread - Trainer');

const route = useRoute();
const trainerForumStore = useTrainerForumStore();
const $q = useQuasar();

const { selectedThread } = storeToRefs(trainerForumStore);

const postForm = ref({
  content: '',
});

onMounted(async () => {
  const threadId = parseInt(route.params.threadId as string);
  if (!isNaN(threadId)) {
    await trainerForumStore.getThreadDetail(threadId);
  }
});

const onSubmitPost = async () => {
  const threadId = parseInt(route.params.threadId as string);
  if (isNaN(threadId)) {
    $q.notify({
      type: 'negative',
      message: 'ID Thread tidak valid.',
    });
    return;
  }

  try {
    await trainerForumStore.createPost(threadId, postForm.value);
    postForm.value.content = ''; // Clear the form
    $q.notify({
      type: 'positive',
      message: 'Balasan berhasil dikirim.',
    });
  } catch (error) {
    console.error(error);
    $q.notify({
      type: 'negative',
      message: 'Gagal mengirim balasan.',
    });
  }
};
</script>
