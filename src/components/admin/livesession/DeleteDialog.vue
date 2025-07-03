<template>
  <q-dialog :model-value="liveSessionStore.deleteDialog" @hide="onHide" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="warning" color="negative" text-color="white" />
        <span class="q-ml-sm">Anda yakin ingin menghapus sesi ini?</span>
      </q-card-section>

      <q-card-section v-if="liveSessionStore.editedLiveSession">
        <div class="text-weight-bold">{{ liveSessionStore.editedLiveSession.title }}</div>
        <div>Jadwal: {{ liveSessionStore.editedLiveSession.start_time }} - {{ liveSessionStore.editedLiveSession.end_time }}</div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Batal" color="primary" @click="onCancel" />
        <q-btn flat label="Hapus" color="negative" @click="onDelete" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useLiveSessionStore } from 'src/stores/live-session';

const liveSessionStore = useLiveSessionStore();

const onHide = () => {
  liveSessionStore.deleteDialog = false;
  liveSessionStore.editedLiveSession = null;
};

const onCancel = () => {
  onHide();
};

const onDelete = async () => {
  if (liveSessionStore.editedLiveSession) {
    await liveSessionStore.deleteLiveSession(liveSessionStore.editedLiveSession.id);
    onHide();
  }
};
</script>
