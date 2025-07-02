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

            <q-toggle v-model="moduleForm.is_access_restricted" label="Batasi Akses Modul" />
            <template v-if="moduleForm.is_access_restricted">
              <div class="col-12 col-md-6">
                <q-input v-model="moduleForm.access_start_at" label="Waktu Mulai Akses *" outlined
                  :error="v$.access_start_at.$error"
                  :error-message="v$.access_start_at.$errors.map((e) => e.$message).join()"
                  @update:model-value="v$.access_start_at.$touch">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="moduleForm.access_start_at" mask="YYYY-MM-DD HH:mm"
                          @update:model-value="v$.access_start_at.$touch">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-time v-model="moduleForm.access_start_at" mask="YYYY-MM-DD HH:mm" format24h
                          @update:model-value="v$.access_start_at.$touch">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-md-6">
                <q-input v-model="moduleForm.access_end_at" label="Waktu Akhir Akses *" outlined
                  :error="v$.access_end_at.$error"
                  :error-message="v$.access_end_at.$errors.map((e) => e.$message).join()"
                  @update:model-value="v$.access_end_at.$touch">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="moduleForm.access_end_at" mask="YYYY-MM-DD HH:mm"
                          :min="moduleForm.access_start_at" @update:model-value="v$.access_end_at.$touch">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-time v-model="moduleForm.access_end_at" mask="YYYY-MM-DD HH:mm" format24h
                          @update:model-value="v$.access_end_at.$touch">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </template>
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
import dayjs from 'dayjs';
import { AxiosError } from 'axios';

interface ModuleForm {
  order: number;
  type: string;
  estimated_time_min: number;
  title: string;
  subtitle: string;
  description: string;
  thumbnail: File | null;
  is_access_restricted: boolean;
  access_start_at: string | null;
  access_end_at: string | null;
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
  thumbnail: null,
  is_access_restricted: false,
  access_start_at: null,
  access_end_at: null
});

// Validation rules
const rules = {
  order: { required: useRequired(), numeric: useNumeric() },
  type: { required: useRequired() },
  estimated_time_min: { required: useRequired(), numeric: useNumeric() },
  title: { required: useRequired() },
  description: { required: useRequired() },
  access_start_at: {
    required: (value: string | null) => !moduleForm.is_access_restricted || !!value || 'Waktu mulai akses wajib diisi',
  },
  access_end_at: {
    required: (value: string | null) => !moduleForm.is_access_restricted || !!value || 'Waktu akhir akses wajib diisi',
    validEndDate: (value: string | null) => {
      if (!moduleForm.is_access_restricted || !value || !moduleForm.access_start_at) return true;
      return dayjs(value).isAfter(dayjs(moduleForm.access_start_at)) || 'Waktu akhir harus setelah waktu mulai';
    }
  }
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
    formData.append('is_access_restricted', moduleForm.is_access_restricted ? '1' : '0');

    if (moduleForm.is_access_restricted) {
      formData.append('access_start_at', moduleForm.access_start_at || '');
      formData.append('access_end_at', moduleForm.access_end_at || '');
    }
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
      thumbnail: null,
      is_access_restricted: false,
      access_start_at: null,
      access_end_at: null
    });

    // Reset validation
    v$.value.$reset();

  } catch (error) {
    if (error instanceof AxiosError) {
      const errors = error.response?.data;
      // Convert validation errors to readable messages
      const errorMessages = Object.entries(errors)
        .map(([, messages]) => {
          // Handle array of messages
          const messageList = Array.isArray(messages) ? messages : [messages];
          return messageList.join(', ');
        })
        .join('\n');

      useNotify(errorMessages, 'negative');
    } else {
      console.error('Error creating module:', error);
      useNotify('Terjadi kesalahan saat membuat module', 'negative');
    }
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
