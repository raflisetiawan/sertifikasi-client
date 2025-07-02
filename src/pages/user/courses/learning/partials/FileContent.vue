<template>
  <q-card class="file-content-card">
    <q-card-section>
      <div class="text-h6">{{ title }}</div>
      <div v-if="content.description" class="text-body1 q-mt-sm">
        {{ content.description }}
      </div>

      <q-separator class="q-my-md" />

      <div class="row items-center no-wrap">
        <div class="col">
          <div class="text-caption">Ukuran File : {{ formattedFileSize }}</div>
        </div>
        <div class="col-auto">
          <q-btn color="primary" icon="download" label="Unduh" :href="content.file_url" target="_blank"
            rel="noopener noreferrer" />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { FileContent } from 'src/models/module-learning';

const props = defineProps<{
  content: FileContent;
  title: string;
}>();

const formattedFileSize = computed(() => {
  const sizeInBytes = props.content.file_size;
  if (sizeInBytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(sizeInBytes) / Math.log(k));
  return parseFloat((sizeInBytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
});
</script>

<style scoped>
.file-content-card {
  margin-top: 16px;
}
</style>
