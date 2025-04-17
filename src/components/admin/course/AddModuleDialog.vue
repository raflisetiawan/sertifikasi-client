<template>
  <div>
    <q-dialog v-model="moudleStore.addModuleDialog" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Tambah Modul Baru</div>
        </q-card-section>
        <q-form @submit="onSubmit">
          <q-card-section class="q-pt-none">
            <!-- Order Input -->
            <q-input v-model="moduleForm.order" type="number" outlined label="Urutan Modul *" :error="v$.order.$error"
              :error-message="v$.order.$errors.map((e) => e.$message).join()" @input="v$.order.$touch"
              @blur="v$.order.$touch" class="q-mb-md" />

            <!-- Type Selection -->
            <q-select v-model="moduleForm.type" :options="moduleTypes" outlined label="Tipe Modul *"
              :error="v$.type.$error" :error-message="v$.type.$errors.map((e) => e.$message).join()"
              @input="v$.type.$touch" @blur="v$.type.$touch" class="q-mb-md" />

            <!-- Title Input -->
            <q-input v-model="moduleForm.title" outlined label="Judul Modul *" :error="v$.title.$error"
              :error-message="v$.title.$errors.map((e) => e.$message).join()" @input="v$.title.$touch"
              @blur="v$.title.$touch" class="q-mb-md" />

            <!-- Subtitle Input -->
            <q-input v-model="moduleForm.subtitle" outlined label="Sub Judul" class="q-mb-md" />

            <!-- Estimated Time Input -->
            <q-input v-model="moduleForm.estimated_time_min" type="number" outlined label="Estimasi Waktu (menit) *"
              :error="v$.estimated_time_min.$error"
              :error-message="v$.estimated_time_min.$errors.map((e) => e.$message).join()"
              @input="v$.estimated_time_min.$touch" @blur="v$.estimated_time_min.$touch" class="q-mb-md" />

            <!-- Description Editor -->
            <div class="text-subtitle2 q-mb-sm">Deskripsi Modul *</div>
            <q-editor v-model="moduleForm.description" :error="v$.description.$error" min-height="5rem"
              class="q-mb-md" />

            <!-- Thumbnail Upload -->
            <q-file v-model="moduleForm.thumbnail" outlined label="Thumbnail" accept=".jpg,.png,.jpeg"
              :filter="checkFileSize" @rejected="onRejected">
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn color="primary" label="Simpan" type="submit" :loading="loading" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';
import { useRequired, useNumeric } from 'src/composables/validators';
import { ref, reactive } from 'vue';
import { useNotify } from 'src/composables/notifications';
import { QRejectedEntry } from 'quasar';
import { useModuleStore } from 'src/stores/module';

interface ModuleForm {
  order: number;
  type: string;
  estimated_time_min: number;
  title: string;
  subtitle: string;
  description: string;
  thumbnail: File | null;
}
declare global {
  interface FormData {
    entries(): IterableIterator<[string, FormDataEntryValue]>;
  }
}

// Module types
const moduleTypes = ['prework', 'module', 'final'];
const moudleStore = useModuleStore();
const emit = defineEmits(['refreshData']);

// Form state
const moduleForm = reactive<ModuleForm>({
  order: 1,
  type: 'module',
  estimated_time_min: 30,
  title: '',
  subtitle: '',
  description: '',
  thumbnail: null
});

// Validation rules
const rules = {
  order: { required: useRequired(), numeric: useNumeric() },
  type: { required: useRequired() },
  estimated_time_min: { required: useRequired(), numeric: useNumeric() },
  title: { required: useRequired() },
  description: { required: useRequired() }
};

const v$ = useVuelidate(rules, moduleForm);
const loading = ref(false);

// File size check (2MB limit)
const checkFileSize = (files: readonly unknown[] | FileList): readonly unknown[] => {
  const fileList = Array.from(files);
  return fileList.filter(file => (file instanceof File) && file.size < 2e+6);
};

// File rejection handler
const onRejected = (rejectedEntries: QRejectedEntry[]) => {
  useNotify(`${rejectedEntries.length} file(s) did not pass validation constraints`, 'negative');
};

// Form submission
const onSubmit = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) {
    useNotify('Mohon periksa form kembali', 'negative');
    return;
  }

  try {
    loading.value = true;
    const formData = new FormData();

    // Append all form data with explicit toString() calls
    formData.append('order', moduleForm.order.toString());
    formData.append('type', moduleForm.type);
    formData.append('estimated_time_min', moduleForm.estimated_time_min.toString());
    formData.append('title', moduleForm.title);
    formData.append('subtitle', moduleForm.subtitle || ''); // Handle empty subtitle
    formData.append('description', moduleForm.description);

    // Only append thumbnail if it exists
    if (moduleForm.thumbnail instanceof File) {
      formData.append('thumbnail', moduleForm.thumbnail);
    }


    await moudleStore.createModule(moudleStore.courseId, formData);

    useNotify('Module berhasil dibuat', 'positive');
    emit('refreshData');
    moudleStore.addModuleDialog = false;

    // Reset form
    Object.assign(moduleForm, {
      order: 1,
      type: 'module',
      estimated_time_min: 30,
      title: '',
      subtitle: '',
      description: '',
      thumbnail: null
    });

    // Reset validation
    v$.value.$reset();

  } catch (error) {
    console.error('Error creating module:', error);
    useNotify('Terjadi kesalahan saat membuat module', 'negative');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.q-editor {
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>
