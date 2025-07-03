<template>
  <div>
    <div class="text-h5 q-mb-md">Sesi Langsung</div>
    <q-list bordered separator v-if="liveSessions.length > 0">
      <q-item v-for="session in liveSessions" :key="session.id">
        <q-item-section>
          <q-item-label class="text-weight-bold">{{ session.title }}</q-item-label>
          <q-item-label caption>{{ formatDateTime(session.start_time) }} - {{ formatDateTime(session.end_time)
          }}</q-item-label>
          <q-item-label class="q-mt-sm"><span v-html="session.description"></span></q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-btn color="primary" label="Gabung Sesi" :href="session.meeting_link" target="_blank"
            rel="noopener noreferrer" icon-right="launch" />
          <div v-if="session.meeting_password" class="text-caption q-mt-sm">
            Password: {{ session.meeting_password }}
          </div>
        </q-item-section>
      </q-item>
    </q-list>
    <div v-else class="text-grey-7 q-mt-md">
      Belum ada sesi langsung yang dijadwalkan untuk kursus ini.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps } from 'vue';
import { useLiveSessionStore } from 'src/stores/live-session';
import { LiveSession } from 'src/models/live-session';

const props = defineProps<{
  courseId: number;
}>();

const liveSessionStore = useLiveSessionStore();
const liveSessions = ref<LiveSession[]>([]);

function formatDateTime(dateTimeString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Date(dateTimeString).toLocaleString('id-ID', options);
}

onMounted(async () => {
  if (props.courseId) {
    liveSessions.value = await liveSessionStore.fetchLiveSessionsByCourse(props.courseId);
  }
});
</script>

<style scoped>
.q-item__label--caption {
  font-style: italic;
}
</style>
