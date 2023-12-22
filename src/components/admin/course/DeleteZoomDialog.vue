<template>
  <div>
    <q-dialog v-model="zoomLinkState.deleteZoomDialog" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Hapus Link Zoom</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="text-body1">{{ zoomLinkState.zoomLinkData.link }}</div>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="primary" label="Hapus" :loading="loading" @click="onSubmit" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useZoomLinkStore } from 'src/stores/zoomLink';

const { $state: zoomLinkState, deleteZoomLink } = useZoomLinkStore()


const loading = ref(false)
const emit = defineEmits(['getCourses'])

const onSubmit = async () => {
  try {
    loading.value = true;
    await deleteZoomLink();
    emit('getCourses');
  } catch (error) {
    throw error;
  } finally {
    loading.value = false;
    zoomLinkState.deleteZoomDialog = false;
  }
}

</script>

<style scoped></style>
