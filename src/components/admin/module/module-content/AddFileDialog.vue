<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card style="min-width: 350px">
      <q-card-section class="row items-center">
        <div class="text-h6">Tambah File</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-form @submit="onSubmit">
        <q-card-section class="q-gutter-md">
          <!-- Title Input -->
          <q-input v-model="form.title" label="Judul *" outlined :error="v$.title.$error"
            :error-message="v$.title.$errors[0]?.$message?.toString()" @blur="v$.title.$touch" />

          <!-- Order Input -->
          <q-input v-model.number="form.order" type="number" label="Urutan *" outlined :error="v$.order.$error"
            :error-message="v$.order.$errors[0]?.$message?.toString()" @blur="v$.order.$touch" />

          <!-- Description -->
          <q-input v-model="form.description" type="textarea" label="Deskripsi" outlined />

          <!-- File Upload -->
          <q-file v-model="form.file" label="File *" outlined :error="v$.file.$error"
            :error-message="v$.file.$errors[0]?.$message?.toString()" @blur="v$.file.$touch">
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
            <template v-slot:hint>
              Maksimal ukuran file 10MB
            </template>
          </q-file>

          <!-- Required Toggle -->
          <q-toggle v-model="form.is_required" label="Wajib diakses" />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Batal" color="grey" v-close-popup />
          <q-btn type="submit" label="Unggah" color="primary" :loading="loading" :disable="!form.file" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { useRequired, useNumeric } from 'src/composables/validators';
import { useNotify } from 'src/composables/notifications';
import { useModuleContentStore } from 'src/stores/module-content';
import type { FileContent } from 'src/models/module-content';

const props = defineProps<{
  moduleId: number;
}>();

const emit = defineEmits(['refresh']);
const showDialog = ref(false);
const loading = ref(false);
const moduleContentStore = useModuleContentStore();

const form = reactive<FileContent>({
  module_id: props.moduleId,
  title: '',
  description: '',
  file: null,
  order: 1,
  is_required: true
});

const rules = {
  title: { required: useRequired() },
  file: { required: useRequired() },
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

    // Create FormData with fixed boolean conversion
    const formData = new FormData();
    formData.append('module_id', props.moduleId.toString());
    formData.append('title', form.title);
    if (form.description) {
      formData.append('description', form.description);
    }
    formData.append('file', form.file as File);
    formData.append('order', form.order.toString());
    // Convert boolean to integer string
    formData.append('is_required', form.is_required ? '1' : '0');

    await moduleContentStore.createFileContent(formData);
    useNotify('File berhasil diunggah', 'positive');
    emit('refresh');
    showDialog.value = false;

    // Reset form
    form.title = '';
    form.description = '';
    form.file = null;
    form.order = 1;
    form.is_required = true;
    v$.value.$reset();
  } catch (error) {
    useNotify('Gagal mengunggah file', 'negative');
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
