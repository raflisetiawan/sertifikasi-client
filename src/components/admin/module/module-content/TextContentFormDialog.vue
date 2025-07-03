<template>
  <q-dialog v-model="showDialog" persistent :maximized="maximizedToggle" transition-show="slide-up"
    transition-hide="slide-down">
    <q-card class="q-pa-md" style="width: 100%; max-width: 800px;">
      <q-bar class="bg-primary text-white">
        <q-icon name="edit" />
        <div>{{ dialogTitle }}</div>
        <q-space />
        <q-btn dense flat icon="minimize" @click="maximizedToggle = false" :disable="!maximizedToggle">
          <q-tooltip v-if="maximizedToggle" class="bg-white text-primary">Minimize</q-tooltip>
        </q-btn>
        <q-btn dense flat icon="crop_square" @click="maximizedToggle = true" :disable="maximizedToggle">
          <q-tooltip v-if="!maximizedToggle" class="bg-white text-primary">Maximize</q-tooltip>
        </q-btn>
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-form @submit="onSubmit">
        <q-card-section class="q-gutter-y-md">
          <q-card bordered flat>
            <q-card-section class="q-gutter-y-md">
              <div class="text-subtitle1 text-weight-medium">Detail Konten</div>
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
              <q-select v-model="form.format" :options="formatOptions" label="Format *" outlined emit-value
                map-options :error="v$.format.$error" :error-message="v$.format.$errors[0]?.$message?.toString()"
                @blur="v$.format.$touch" />
            </q-card-section>
          </q-card>

          <q-card bordered flat>
            <q-card-section class="q-gutter-y-md">
              <div class="text-subtitle1 text-weight-medium">Isi Konten</div>
              <q-editor v-model="form.content" :toolbar="[
                ['bold', 'italic', 'strike', 'underline'],
                ['link', 'hr', 'quote', 'code'],
                ['unordered', 'ordered', 'outdent', 'indent'],
                ['undo', 'redo'],
                ['viewsource']
              ]" min-height="300px" :error="v$.content.$error" :error-message="v$.content.$errors[0]?.$message"
                @blur="v$.content.$touch" />
            </q-card-section>
          </q-card>

          <q-card bordered flat>
            <q-card-section>
              <q-toggle v-model="form.is_required" label="Wajib dikerjakan" />
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
import { useRequired, useNumeric } from 'src/composables/validators';
import { useNotify } from 'src/composables/notifications';
import { useModuleContentStore } from 'src/stores/module-content';
import { BaseContent, TextContent } from 'src/models/module-content';

const props = defineProps<{
  moduleId: number;
}>();

const emit = defineEmits(['refresh']);
const showDialog = ref(false);
const loading = ref(false);
const moduleContentStore = useModuleContentStore();
const maximizedToggle = ref(true)
const mode = ref<'add' | 'edit'>('add');
const contentId = ref<number | null>(null);

// Computed properties for dynamic UI
const isEditMode = computed(() => mode.value === 'edit');
const dialogTitle = computed(() => isEditMode.value ? 'Edit Konten Teks' : 'Tambah Konten Teks');
const submitButtonLabel = computed(() => isEditMode.value ? 'Update' : 'Simpan');

const formatOptions = [
  { label: 'HTML', value: 'html' as const },
  { label: 'Markdown', value: 'markdown' as const }
];

const initialFormState: TextContent = {
  module_id: props.moduleId,
  title: '',
  content: '',
  format: 'html',
  order: 1,
  is_required: true
};

const form = reactive<TextContent>({ ...initialFormState });

const rules = {
  title: { required: useRequired() },
  content: { required: useRequired() },
  format: { required: useRequired() },
  order: {
    required: useRequired(),
    numeric: useNumeric()
  }
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
    if (isEditMode.value && contentId.value) {
      // Update existing content
      await moduleContentStore.updateTextContent(contentId.value, form);
      useNotify('Konten teks berhasil diperbarui', 'positive');
    } else {
      // Create new content
      await moduleContentStore.createTextContent(form);
      useNotify('Konten teks berhasil ditambahkan', 'positive');
    }
    emit('refresh');
    showDialog.value = false;
  } catch (error: unknown) {
    let errorMessage = `Gagal ${isEditMode.value ? 'memperbarui' : 'menambahkan'} konten teks`;
    if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string') {
      errorMessage = error.response.data.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    useNotify(errorMessage, 'negative');
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  Object.assign(form, initialFormState);
  v$.value.$reset();
}

defineExpose({
  show: (contentToEdit: BaseContent | null = null) => {
    if (contentToEdit && contentToEdit.content_type === 'text') {
      mode.value = 'edit';
      contentId.value = contentToEdit.id;

      const textContent = contentToEdit.content as TextContent;
      Object.assign(form, {
        ...textContent,
        title: contentToEdit.title,
        order: contentToEdit.order, // Ensure order is taken from BaseContent
        is_required: contentToEdit.is_required,
      });

    } else {
      mode.value = 'add';
      contentId.value = null;
      resetForm();
    }
    showDialog.value = true;
  }
});
</script>

