<template>
  <q-dialog v-model="moduleStore.editModuleDialog" persistent>
    <q-card style="width: 700px; max-width: 80vw;">
      <q-card-section class="row items-center">
        <div class="text-h6">Ubah Modul</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-form @submit="onSubmit">
        <q-card-section class="q-gutter-md">
          <!-- Order Input -->
          <q-input v-model.number="moduleForm.order" type="number" label="Urutan *" outlined :error="v$.order.$error"
            :error-message="v$.order.$errors[0]?.$message?.toString()" @blur="v$.order.$touch" />

          <!-- Type Selection -->
          <q-select v-model="moduleForm.type" :options="moduleTypes" label="Tipe *" outlined :error="v$.type.$error"
            :error-message="v$.type.$errors[0]?.$message?.toString()" @blur="v$.type.$touch" />

          <!-- Title Input -->
          <q-input v-model="moduleForm.title" label="Judul *" outlined :error="v$.title.$error"
            :error-message="v$.title.$errors[0]?.$message?.toString()" @blur="v$.title.$touch" />

          <!-- Subtitle Input -->
          <q-input v-model="moduleForm.subtitle" label="Sub Judul" outlined />

          <!-- Estimated Time Input -->
          <q-input v-model.number="moduleForm.estimated_time_min" type="number" label="Estimasi Waktu (menit) *"
            outlined :error="v$.estimated_time_min.$error"
            :error-message="v$.estimated_time_min.$errors[0]?.$message?.toString()"
            @blur="v$.estimated_time_min.$touch" />

          <!-- Description Editor -->
          <q-editor v-model="moduleForm.description" :error="v$.description.$error" min-height="5rem"
            label="Deskripsi *" />

          <q-toggle v-model="moduleForm.is_access_restricted" label="Batasi Akses Modul" />

          <!-- Access Restriction Fields -->
          <template v-if="moduleForm.is_access_restricted">
            <div class="row q-col-gutter-md q-pl-md">
              <div class="col-12 col-md-6">
                <q-input v-model="moduleForm.access_start_at" label="Waktu Mulai Akses *" outlined
                  :error="v$.access_start_at.$error"
                  :error-message="v$.access_start_at.$errors.map((e) => e.$message).join()">
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
                  :error-message="v$.access_end_at.$errors.map((e) => e.$message).join()">
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
            </div>
          </template>
          <!-- Current Thumbnail Preview -->
          <div v-if="moduleForm.thumbnail_url" class="q-mb-md">
            <p class="text-caption">Thumbnail Saat Ini:</p>
            <q-img :src="moduleForm.thumbnail_url" width="200px" fit="cover" />
          </div>

          <!-- Thumbnail Upload -->
          <q-file v-model="moduleForm.new_thumbnail" label="Ganti Thumbnail" outlined accept=".jpg,.png,.jpeg"
            :filter="checkFileSize" @rejected="onRejected">
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Batal" color="grey" v-close-popup />
          <q-btn type="submit" label="Simpan" color="primary" :loading="loading" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { useRequired, useNumeric } from 'src/composables/validators';
import { useNotify } from 'src/composables/notifications';
import { QRejectedEntry } from 'quasar';
import { useModuleStore } from 'src/stores/module';
import { Module } from 'src/models/module';
import dayjs from 'dayjs';
import { AxiosError } from 'axios';

interface ModuleForm extends Omit<Module, 'thumbnail'> {
  new_thumbnail: File | null;
  is_access_restricted: boolean;
  access_start_at: string | null;
  access_end_at: string | null;
}

const props = defineProps<{
  selectedModule: Module | null;
}>();

const emit = defineEmits(['refreshData']);
const moduleStore = useModuleStore();
const loading = ref(false);

const moduleTypes = ['prework', 'module', 'final'];
const formatDateTime = (dateTimeString: string | null) => {
  if (!dateTimeString) return null;
  return dayjs(dateTimeString).format('YYYY-MM-DD HH:mm');
};

const moduleForm = reactive<ModuleForm>({
  id: 0,
  course_id: 0,
  order: 1,
  type: 'module',
  estimated_time_min: 30,
  title: '',
  subtitle: '',
  description: '',
  new_thumbnail: null,
  thumbnail_url: '',
  is_access_restricted: false,
  access_start_at: null,
  access_end_at: null
});

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

watch(() => props.selectedModule, (newModule) => {
  if (newModule) {
    Object.assign(moduleForm, {
      ...newModule,
      new_thumbnail: null,
      access_start_at: formatDateTime(newModule.access_start_at),
      access_end_at: formatDateTime(newModule.access_end_at)
    });
  }
}, { immediate: true });

const checkFileSize = (files: readonly unknown[] | FileList): readonly unknown[] => {
  const fileList = Array.from(files);
  return fileList.filter(file => (file instanceof File) && file.size < 2e+6);
};

const onRejected = (rejectedEntries: QRejectedEntry[]) => {
  useNotify(`${rejectedEntries.length} file tidak memenuhi persyaratan`, 'negative');
};

const onSubmit = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) {
    useNotify('Mohon periksa form kembali', 'negative');
    return;
  }

  try {
    loading.value = true;
    const formData = new FormData();

    formData.append('_method', 'PUT');
    formData.append('order', moduleForm.order.toString());
    formData.append('type', moduleForm.type);
    formData.append('title', moduleForm.title);
    formData.append('subtitle', moduleForm.subtitle || '');
    formData.append('estimated_time_min', moduleForm.estimated_time_min.toString());
    formData.append('description', moduleForm.description);
    formData.append('is_access_restricted', moduleForm.is_access_restricted ? '1' : '0');

    if (moduleForm.is_access_restricted) {
      const startAt = moduleForm.access_start_at ?
        dayjs(moduleForm.access_start_at).format('YYYY-MM-DD HH:mm:ss') :
        '';
      const endAt = moduleForm.access_end_at ?
        dayjs(moduleForm.access_end_at).format('YYYY-MM-DD HH:mm:ss') :
        '';

      formData.append('access_start_at', startAt);
      formData.append('access_end_at', endAt);
    }


    if (moduleForm.new_thumbnail instanceof File) {
      formData.append('thumbnail', moduleForm.new_thumbnail);
    }

    await moduleStore.updateModule(moduleForm.id, formData);

    useNotify('Modul berhasil diperbarui', 'positive');
    emit('refreshData');
    moduleStore.editModuleDialog = false;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errors = error.response?.data;
      // Convert validation errors to readable messages
      const errorMessages = Object.entries(errors)
        .map(([field, messages]) => {
          const messageList = Array.isArray(messages) ? messages : [messages];
          return messageList.join(', ');
        })
        .join('\n');

      useNotify(errorMessages, 'negative');
    } else {
      console.error('Error updating module:', error);
      useNotify('Gagal memperbarui modul', 'negative');
    }
  } finally {
    loading.value = false;
  }
};
</script>
