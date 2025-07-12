<template>
  <q-page padding>
    <div v-if="courseForum">
      <div class="text-h4 q-mb-md">Forum: {{ courseForum.title }}</div>
      <p>{{ courseForum.description }}</p>

      <q-btn
        color="primary"
        label="Buat Thread Baru"
        :to="{ name: 'TrainerCreateThread', params: { forumId: courseForum.id } }"
        class="q-mb-md"
      />

      <q-list bordered separator class="q-mt-lg">
        <q-item-label header>Threads</q-item-label>
        <q-item
          v-for="thread in courseForum.threads"
          :key="thread.id"
          clickable
          v-ripple
          :to="{ name: 'TrainerThreadDetail', params: { threadId: thread.id } }"
        >
          <q-item-section>
            <q-item-label>{{ thread.title }}</q-item-label>
            <q-item-label caption>Oleh: {{ thread.user.name }} - {{ thread.replies_count }} Balasan</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="chat_bubble" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <div v-else>
      <q-spinner-dots size="lg" color="primary" />
      <p>Memuat forum kursus...</p>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTrainerForumStore } from 'src/stores/trainerForum';
import { useMetaTitle } from 'src/composables/meta';
import { storeToRefs } from 'pinia';

useMetaTitle('Forum Kursus - Trainer');

const route = useRoute();
const trainerForumStore = useTrainerForumStore();

const { courseForum } = storeToRefs(trainerForumStore);

onMounted(async () => {
  const courseId = parseInt(route.params.courseId as string);
  if (!isNaN(courseId)) {
    await trainerForumStore.getCourseForum(courseId);
  }
});
</script>
