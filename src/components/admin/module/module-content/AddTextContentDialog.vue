<template>
  <q-dialog v-model="showDialog" persistent :maximized="maximizedToggle" transition-show="slide-up"
    transition-hide="slide-down">
    <q-card>
      <q-bar>
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
      <q-card-section class="row items-center">
        <div class="text-h6">Tambah Konten Teks</div>
      </q-card-section>

      <q-form @submit="onSubmit">
        <q-card-section class="q-gutter-md">
          <!-- Order Input -->
          <q-input v-model.number="form.order" type="number" label="Urutan *" outlined :error="v$.order.$error"
            :error-message="v$.order.$errors[0]?.$message?.toString()" @blur="v$.order.$touch" />

          <!-- Title Input -->
          <q-input v-model="form.title" label="Judul *" outlined :error="v$.title.$error"
            :error-message="v$.title.$errors[0]?.$message?.toString()" @blur="v$.title.$touch" />

          <!-- Format Selection -->
          <q-select v-model="form.format" :options="formatOptions" label="Format *" outlined :error="v$.format.$error"
            :error-message="v$.format.$errors[0]?.$message?.toString()" @blur="v$.format.$touch" />

          <!-- Content Editor -->
          <q-editor v-model="form.content" :toolbar="[
            ['bold', 'italic', 'strike', 'underline'],
            ['numerated', 'outdent', 'indent'],
            ['quote', 'unordered', 'ordered'],
            ['undo', 'redo'],
            ['viewsource']
          ]" min-height="300px" :error="v$.content.$error" :error-message="v$.content.$errors[0]?.$message"
            @blur="v$.content.$touch" />

          <!-- Is Required Toggle -->
          <q-toggle v-model="form.is_required" label="Wajib dikerjakan" />
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
import { ref, reactive } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { useRequired, useNumeric } from 'src/composables/validators';
import { useNotify } from 'src/composables/notifications';
import { useModuleContentStore } from 'src/stores/module-content';
interface TextContentForm {
  module_id: number;
  title: string;
  content: string;
  format: 'markdown' | 'html';  // Change this to use literal types
  order: number;
  is_required: boolean;
  minimum_duration_seconds?: number;
}

const props = defineProps<{
  moduleId: number;
}>();

const emit = defineEmits(['refresh']);
const showDialog = ref(false);
const loading = ref(false);
const moduleContentStore = useModuleContentStore();
const maximizedToggle = ref(true)

const formatOptions = [
  { label: 'HTML', value: 'html' as const },
  { label: 'Markdown', value: 'markdown' as const }
];

const form = reactive<TextContentForm>({
  module_id: props.moduleId,
  title: '',
  content: '',
  format: 'html' as const,  // Add type assertion
  order: 1,
  is_required: true
});
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
    await moduleContentStore.createTextContent(form);
    useNotify('Konten teks berhasil ditambahkan', 'positive');
    emit('refresh');
    showDialog.value = false;

    // Reset form
    form.title = '';
    form.content = '';
    form.order = 1;
    form.is_required = true;
    v$.value.$reset();
  } catch (error) {
    useNotify('Gagal menambahkan konten teks', 'negative');
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
