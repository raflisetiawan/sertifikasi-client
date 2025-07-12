<template>
  <q-page padding>
    <div class="text-h4 q-mb-md">Buat Thread Baru</div>

    <q-form @submit.prevent="onSubmit" class="q-gutter-md">
      <q-input outlined v-model="threadForm.title" label="Judul Thread" :rules="[val => !!val || 'Judul tidak boleh kosong']" />
      <q-editor v-model="threadForm.content" label="Isi Thread" min-height="10rem" />

      <q-btn label="Buat Thread" type="submit" color="primary" />
      <q-btn label="Batal" color="grey" :to="{ name: 'TrainerForumDetail', params: { forumId: route.params.forumId } }" class="q-ml-sm" />
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTrainerForumStore } from 'src/stores/trainerForum';
import { useMetaTitle } from 'src/composables/meta';
import { useQuasar } from 'quasar';

useMetaTitle('Buat Thread - Trainer');

const route = useRoute();
const router = useRouter();
const trainerForumStore = useTrainerForumStore();
const $q = useQuasar();

const threadForm = ref({
  title: '',
  content: '',
});

const onSubmit = async () => {
  const forumId = parseInt(route.params.forumId as string);
  if (isNaN(forumId)) {
    $q.notify({
      type: 'negative',
      message: 'ID Forum tidak valid.',
    });
    return;
  }

  try {
    await trainerForumStore.createThread(forumId, threadForm.value);
    $q.notify({
      type: 'positive',
      message: 'Thread berhasil dibuat.',
    });
    router.push({ name: 'TrainerForumDetail', params: { forumId: forumId } });
  } catch (error) {
    console.error(error);
    $q.notify({
      type: 'negative',
      message: 'Gagal membuat thread.',
    });
  }
};
</script>
