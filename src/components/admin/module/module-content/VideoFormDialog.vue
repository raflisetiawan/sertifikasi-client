<template>
  <q-dialog v-model="showDialog" persistent maximized>
    <q-card class="q-pa-md" style="width: 100%; max-width: 800px;">
      <q-bar class="bg-primary text-white">
        <q-icon name="videocam" />
        <div>{{ dialogTitle }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-bar>

      <q-form @submit="onSubmit">
        <q-card-section class="q-gutter-y-md">
          <q-card bordered flat>
            <q-card-section class="q-gutter-y-md">
              <div class="text-subtitle1 text-weight-medium">Detail Video</div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                  <q-input v-model="form.title" label="Judul Video *" outlined :error="v$.title.$error"
                    :error-message="v$.title.$errors[0]?.$message?.toString()" @blur="v$.title.$touch" />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input v-model.number="form.order" type="number" label="Urutan *" outlined :error="v$.order.$error"
                    :error-message="v$.order.$errors[0]?.$message?.toString()" @blur="v$.order.$touch" />
                </div>
              </div>
              <q-input v-model="form.description" type="textarea" label="Deskripsi" outlined />
            </q-card-section>
          </q-card>

          <q-card bordered flat>
            <q-card-section class="q-gutter-y-md">
              <div class="text-subtitle1 text-weight-medium">Informasi Video</div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input v-model="form.video_url" label="URL Video *" outlined :error="v$.video_url.$error"
                    :error-message="v$.video_url.$errors[0]?.$message?.toString()" @blur="v$.video_url.$touch" />
                </div>
                <div class="col-12 col-md-6">
                  <q-select v-model="form.provider" :options="providerOptions" label="Provider *" outlined
                    :error="v$.provider.$error" :error-message="v$.provider.$errors[0]?.$message?.toString()"
                    @blur="v$.provider.$touch" />
                </div>
                <div class="col-12 col-md-6">
                  <q-input v-model="form.video_id" label="ID Video *" outlined :error="v$.video_id.$error"
                    :error-message="v$.video_id.$errors[0]?.$message?.toString()" @blur="v$.video_id.$touch" />
                </div>
                <div class="col-12 col-md-6">
                  <q-input v-model.number="form.duration_seconds" type="number" label="Durasi (detik) *" outlined
                    :error="v$.duration_seconds.$error"
                    :error-message="v$.duration_seconds.$errors[0]?.$message?.toString()"
                    @blur="v$.duration_seconds.$touch" />
                </div>
                <div class="col-12">
                  <q-input v-model="form.thumbnail_url" label="URL Thumbnail" outlined />
                </div>
              </div>
            </q-card-section>
          </q-card>

          <q-card bordered flat>
            <q-card-section>
              <q-toggle v-model="form.is_downloadable" label="Video dapat diunduh" />
              <q-toggle v-model="form.is_required" label="Wajib ditonton" />
            </q-card-section>
          </q-card>

        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Batal" color="grey" v-close-popup />
          <q-btn type="submit" :label="submitButtonLabel" color="primary" :loading="loading" unelevated />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { useRequired, useNumeric, useUrl } from 'src/composables/validators';
import { useNotify } from 'src/composables/notifications';
import { useModuleContentStore } from 'src/stores/module-content';
import type { VideoContent, BaseContent } from 'src/models/module-content';

const props = defineProps<{
  moduleId: number;
}>();

const emit = defineEmits(['refresh']);
const showDialog = ref(false);
const loading = ref(false);
const moduleContentStore = useModuleContentStore();
const mode = ref<'add' | 'edit'>('add');
const contentId = ref<number | null>(null);

const isEditMode = computed(() => mode.value === 'edit');
const dialogTitle = computed(() => isEditMode.value ? 'Edit Video' : 'Tambah Video Baru');
const submitButtonLabel = computed(() => isEditMode.value ? 'Update' : 'Simpan');

const providerOptions = [
  { label: 'YouTube', value: 'youtube' },
  { label: 'Vimeo', value: 'vimeo' }
];

const initialFormState: VideoContent = {
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
};

const form = reactive<VideoContent>({ ...initialFormState });

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

const resetForm = () => {
  Object.assign(form, initialFormState);
  v$.value.$reset();
};

const onSubmit = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) {
    useNotify('Mohon periksa form kembali', 'negative');
    return;
  }

  try {
    loading.value = true;
    if (isEditMode.value && contentId.value) {
      await moduleContentStore.updateVideoContent(contentId.value, form);
      useNotify('Video berhasil diperbarui', 'positive');
    } else {
      await moduleContentStore.createVideoContent(form);
      useNotify('Video berhasil ditambahkan', 'positive');
    }
    emit('refresh');
    showDialog.value = false;
  } catch (error) {
    useNotify(`Gagal ${isEditMode.value ? 'memperbarui' : 'menambahkan'} video`, 'negative');
  } finally {
    loading.value = false;
  }
};

defineExpose({
  show: (contentToEdit: BaseContent | null = null) => {
    if (contentToEdit && contentToEdit.content_type === 'video') {
      mode.value = 'edit';
      contentId.value = contentToEdit.id;

      // The actual video data is inside the 'content' property
      const videoContent = contentToEdit.content as VideoContent;

      // Assign properties to the form
      Object.assign(form, {
        ...videoContent, // Spread the video-specific data
        title: contentToEdit.title, // Overwrite title from the base content
        order: contentToEdit.order, // Overwrite order from the base content
        is_required: contentToEdit.is_required, // Overwrite is_required from the base content
        module_id: props.moduleId, // Ensure module_id is set
      });

    } else {
      mode.value = 'add';
      contentId.value = null;
      resetForm();
      // Ensure module_id is set for new content
      form.module_id = props.moduleId;
    }
    showDialog.value = true;
  }
});
</script>
