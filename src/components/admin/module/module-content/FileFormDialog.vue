<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="q-pa-md" style="width: 100%; max-width: 600px;">
      <q-bar class="bg-primary text-white">
        <q-icon name="attach_file" />
        <div>{{ dialogTitle }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-bar>

      <q-form @submit="onSubmit">
        <q-card-section class="q-gutter-y-md">
          <q-card bordered flat>
            <q-card-section class="q-gutter-y-md">
              <div class="text-subtitle1 text-weight-medium">Detail File</div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                  <q-input v-model="form.title" label="Judul *" outlined :error="v$.title.$error"
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
            <q-card-section>
              <q-file v-model="form.file" label="File *" outlined :error="v$.file.$error"
                :error-message="v$.file.$errors[0]?.$message?.toString()" @blur="v$.file.$touch">
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
                <template v-slot:hint>
                  Maksimal ukuran file 10MB
                </template>
              </q-file>
            </q-card-section>
          </q-card>

          <q-card bordered flat>
            <q-card-section>
              <q-toggle v-model="form.is_required" label="Wajib diakses" />
            </q-card-section>
          </q-card>

        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Batal" color="grey" v-close-popup />
          <q-btn type="submit" :label="submitButtonLabel" color="primary" :loading="loading" :disable="!form.file"
            unelevated />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { useRequired, useNumeric } from 'src/composables/validators';
import { useNotify } from 'src/composables/notifications';
import { useModuleContentStore } from 'src/stores/module-content';
import type { FileContent, BaseContent } from 'src/models/module-content';

const props = defineProps<{
  moduleId: number;
}>();

const emit = defineEmits(['refresh']);
const showDialog = ref(false);
const loading = ref(false);
const moduleContentStore = useModuleContentStore();

const initialFormState: FileContent = {
  module_id: props.moduleId,
  title: '',
  description: '',
  file: null,
  order: 1,
  is_required: true,
  file_url: ''
};

const rules = {
  title: { required: useRequired() },
  file: { required: useRequired() },
  order: { required: useRequired(), numeric: useNumeric() }
};

const form = reactive<FileContent>({ ...initialFormState });
const v$ = useVuelidate(rules, form);

const mode = ref<'add' | 'edit'>('add');
const contentId = ref<number | null>(null);

const isEditMode = computed(() => mode.value === 'edit');
const dialogTitle = computed(() => isEditMode.value ? 'Edit File' : 'Unggah File');
const submitButtonLabel = computed(() => isEditMode.value ? 'Update' : 'Unggah');

const onSubmit = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) {
    useNotify('Mohon periksa form kembali', 'negative');
    return;
  }

  try {
    loading.value = true;

    const formData = new FormData();
    formData.append('module_id', props.moduleId.toString());
    formData.append('title', form.title);
    if (form.description) {
      formData.append('description', form.description);
    }
    formData.append('file', form.file as File);
    formData.append('order', form.order.toString());
    formData.append('is_required', form.is_required ? '1' : '0');

    if (isEditMode.value && contentId.value) {
      // For file updates, we might need a different approach if the backend expects a PUT with FormData
      // For now, assuming file updates are handled by re-uploading the file or separate API
      // If the file is not changed, we can send a partial update without the file
      if (form.file) {
        formData.append('_method', 'PUT'); // Laravel method spoofing for PUT with FormData
        await moduleContentStore.updateFileContent(contentId.value, formData);
        useNotify('File berhasil diperbarui', 'positive');
      } else {
        // Handle case where only metadata is updated, not the file itself
        // This would require a separate API endpoint or a modified existing one
        // For now, we'll just notify that file update without file is not supported
        useNotify('Tidak ada file baru yang dipilih untuk diperbarui.', 'warning');
        loading.value = false;
        return;
      }
    } else {
      await moduleContentStore.createFileContent(formData);
      useNotify('File berhasil diunggah', 'positive');
    }
    emit('refresh');
    showDialog.value = false;
  } catch (error) {
    useNotify(`Gagal ${isEditMode.value ? 'memperbarui' : 'mengunggah'} file`, 'negative');
  } finally {
    loading.value = false;
    resetForm();
  }
};

const resetForm = () => {
  Object.assign(form, initialFormState);
  v$.value.$reset();
};

const openDialog = (contentToEdit?: BaseContent) => {
  showDialog.value = true;
  if (contentToEdit && contentToEdit.content_type === 'file') {
    mode.value = 'edit';
    contentId.value = contentToEdit.id;

    const fileContent = contentToEdit.content as FileContent;
    Object.assign(form, {
      ...fileContent,
      title: contentToEdit.title,
      order: contentToEdit.order,
      is_required: contentToEdit.is_required,
      file: null, // Reset file input for edit mode
    });

  } else {
    mode.value = 'add';
    contentId.value = null;
    resetForm();
  }
};

defineExpose({
  openDialog,
});
</script>
