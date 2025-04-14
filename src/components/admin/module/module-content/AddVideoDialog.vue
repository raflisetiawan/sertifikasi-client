<template>
  <q-dialog v-model="showDialog" persistent maximized>
    <q-card class="q-pa-md">
      <q-card-section class="row items-center">
        <div class="text-h6">Tambah Video Baru</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-form @submit="onSubmit">
        <q-card-section class="q-gutter-md">
          <div class="row q-col-gutter-md">
            <!-- Basic Info -->
            <div class="col-12 col-md-6">
              <q-input v-model="form.title" label="Judul Video *" outlined :error="v$.title.$error"
                :error-message="v$.title.$errors[0]?.$message?.toString()" @blur="v$.title.$touch" />
            </div>

            <div class="col-12 col-md-6">
              <q-input v-model.number="form.order" type="number" label="Urutan *" outlined :error="v$.order.$error"
                :error-message="v$.order.$errors[0]?.$message?.toString()" @blur="v$.order.$touch" />
            </div>

            <!-- Description -->
            <div class="col-12">
              <q-input v-model="form.description" type="textarea" label="Deskripsi" outlined />
            </div>

            <!-- Video URL -->
            <div class="col-12 col-md-6">
              <q-input v-model="form.video_url" label="URL Video *" outlined :error="v$.video_url.$error"
                :error-message="v$.video_url.$errors[0]?.$message?.toString()" @blur="v$.video_url.$touch" />
            </div>

            <!-- Video Provider -->
            <div class="col-12 col-md-6">
              <q-select v-model="form.provider" :options="providerOptions" label="Provider *" outlined
                :error="v$.provider.$error" :error-message="v$.provider.$errors[0]?.$message?.toString()"
                @blur="v$.provider.$touch" />
            </div>

            <!-- Video ID -->
            <div class="col-12 col-md-6">
              <q-input v-model="form.video_id" label="ID Video *" outlined :error="v$.video_id.$error"
                :error-message="v$.video_id.$errors[0]?.$message?.toString()" @blur="v$.video_id.$touch" />
            </div>

            <!-- Duration -->
            <div class="col-12 col-md-6">
              <q-input v-model.number="form.duration_seconds" type="number" label="Durasi (detik) *" outlined
                :error="v$.duration_seconds.$error"
                :error-message="v$.duration_seconds.$errors[0]?.$message?.toString()"
                @blur="v$.duration_seconds.$touch" />
            </div>

            <!-- Thumbnail URL -->
            <div class="col-12">
              <q-input v-model="form.thumbnail_url" label="URL Thumbnail" outlined />
            </div>

            <!-- Downloadable Toggle -->
            <div class="col-12">
              <q-toggle v-model="form.is_downloadable" label="Video dapat diunduh" />
            </div>

            <!-- Required Toggle -->
            <div class="col-12">
              <q-toggle v-model="form.is_required" label="Wajib ditonton" />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Batal" color="grey" v-close-popup />
          <q-btn type="submit" label="Simpan" color="primary" :loading="loading" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { useRequired, useNumeric, useUrl } from 'src/composables/validators';
import { useNotify } from 'src/composables/notifications';
import { useModuleContentStore } from 'src/stores/module-content';
import type { VideoContent } from 'src/models/module-content';

const props = defineProps<{
  moduleId: number;
}>();

const emit = defineEmits(['refresh']);
const showDialog = ref(false);
const loading = ref(false);
const moduleContentStore = useModuleContentStore();

const providerOptions = [
  { label: 'YouTube', value: 'youtube' },
  { label: 'Vimeo', value: 'vimeo' }
];

const form = reactive<VideoContent>({
  module_id: props.moduleId,
  title: '',
  description: '',
  video_url: '',
  provider: 'youtube',
  video_id: '',
  duration_seconds: 0,
  thumbnail_url: '',
  is_downloadable: false,
  captions: [],
  order: 1,
  is_required: true
});

const rules = {
  title: { required: useRequired() },
  video_url: { required: useRequired(), url: useUrl() },
  provider: { required: useRequired() },
  video_id: { required: useRequired() },
  duration_seconds: {
    required: useRequired(),
    numeric: useNumeric(),
    minValue: (value: number) => value >= 1
  },
  order: { required: useRequired(), numeric: useNumeric() }
};

const v$ = useVuelidate(rules, form);

const onSubmit = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) {
    useNotify('Mohon periksa form kembali', 'negative');
    return;
  }

  try {
    loading.value = true;
    await moduleContentStore.createVideoContent(form);
    useNotify('Video berhasil ditambahkan', 'positive');
    emit('refresh');
    showDialog.value = false;

    // Reset form
    form.title = '';
    form.description = '';
    form.video_url = '';
    form.provider = 'youtube';
    form.video_id = '';
    form.duration_seconds = 0;
    form.thumbnail_url = '';
    form.is_downloadable = false;
    form.captions = [];
    form.order = 1;
    form.is_required = true;
    v$.value.$reset();
  } catch (error) {
    useNotify('Gagal menambahkan video', 'negative');
  } finally {
    loading.value = false;
  }
};

defineExpose({
  show: () => {
    showDialog.value = true;
  }
});
</script>
