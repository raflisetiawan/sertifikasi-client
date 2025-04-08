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

interface ModuleForm extends Omit<Module, 'thumbnail'> {
  new_thumbnail: File | null;
}

const props = defineProps<{
  selectedModule: Module | null;
}>();

const emit = defineEmits(['refreshData']);
const moduleStore = useModuleStore();
const loading = ref(false);

const moduleTypes = ['prework', 'module', 'final'];

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
});

const rules = {
  order: { required: useRequired(), numeric: useNumeric() },
  type: { required: useRequired() },
  estimated_time_min: { required: useRequired(), numeric: useNumeric() },
  title: { required: useRequired() },
  description: { required: useRequired() }
};

const v$ = useVuelidate(rules, moduleForm);

watch(() => props.selectedModule, (newModule) => {
  if (newModule) {
    Object.assign(moduleForm, {
      ...newModule,
      new_thumbnail: null
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

    if (moduleForm.new_thumbnail instanceof File) {
      formData.append('thumbnail', moduleForm.new_thumbnail);
    }

    await moduleStore.updateModule(moduleForm.id, formData);

    useNotify('Modul berhasil diperbarui', 'positive');
    emit('refreshData');
    moduleStore.editModuleDialog = false;
  } catch (error) {
    useNotify('Gagal memperbarui modul', 'negative');
  } finally {
    loading.value = false;
  }
};
</script>
