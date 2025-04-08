<template>
  <q-dialog v-model="moduleStore.detailModuleDialog" persistent>
    <q-card style="width: 700px; max-width: 80vw;">
      <q-card-section class="row items-center">
        <div class="text-h6">Detail Modul</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section v-if="selectedModule">
        <div class="row q-col-gutter-md">
          <!-- Thumbnail -->
          <div class="col-12" v-if="selectedModule.thumbnail">
            <q-img :src="selectedModule.thumbnail_url" width="200px" fit="cover" />
          </div>

          <!-- Basic Info -->
          <div class="col-12">
            <div class="text-h6">{{ selectedModule.title }}</div>
            <div class="text-subtitle2">{{ selectedModule.subtitle }}</div>
            <q-chip :color="getTypeColor(selectedModule.type)" text-color="white">
              {{ getTypeLabel(selectedModule.type) }}
            </q-chip>
          </div>

          <!-- Module Details -->
          <div class="col-12">
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Urutan</q-item-label>
                  <q-item-label>{{ selectedModule.order }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Estimasi Waktu</q-item-label>
                  <q-item-label>{{ selectedModule.estimated_time_min }} menit</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Deskripsi</q-item-label>
                  <div class="text-body1 q-pa-sm description-content" ref="descriptionRef">
                    <div v-html="selectedModule.description"></div>
                  </div>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Dibuat pada</q-item-label>
                  <q-item-label>{{ formatDate(selectedModule.created_at) }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Terakhir diperbarui</q-item-label>
                  <q-item-label>{{ formatDate(selectedModule.updated_at) }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Tutup" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { Module } from 'src/models/module';
import { useModuleStore } from 'src/stores/module';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { ref, watch } from 'vue';

const moduleStore = useModuleStore();
const descriptionRef = ref<HTMLElement | null>(null);

const props = defineProps<{
  selectedModule: Module | null;
}>();



const getTypeColor = (type: string) => {
  switch (type) {
    case 'prework':
      return 'blue';
    case 'module':
      return 'green';
    case 'final':
      return 'purple';
    default:
      return 'grey';
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'prework':
      return 'Prework';
    case 'module':
      return 'Modul';
    case 'final':
      return 'Final';
    default:
      return type;
  }
};

const formatDate = (date?: string) => {
  if (!date) return '-';
  return format(new Date(date), 'dd MMMM yyyy HH:mm', { locale: id });
};

watch(
  () => props.selectedModule?.description,
  (newDescription) => {
    if (descriptionRef.value && newDescription) {
      descriptionRef.value.innerHTML = newDescription;
    }
  },
  { immediate: true }
);
</script>
<style scoped>
.description-content {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
