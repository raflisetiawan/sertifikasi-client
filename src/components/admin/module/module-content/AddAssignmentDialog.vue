<template>
  <q-dialog v-model="showDialog" persistent maximized>
    <q-card>
      <q-card-section class="row items-center">
        <div class="text-h6">Tambah Tugas Baru</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-form @submit="onSubmit">
        <q-card-section class="q-gutter-md">
          <div class="row q-col-gutter-md">
            <!-- Basic Info -->
            <div class="col-12 col-md-6">
              <q-input v-model="form.title" label="Judul Tugas *" outlined :error="v$.title.$error"
                :error-message="v$.title.$errors[0]?.$message?.toString()" @blur="v$.title.$touch" />
            </div>

            <div class="col-12 col-md-6">
              <q-input v-model.number="form.order" type="number" label="Urutan *" outlined :error="v$.order.$error"
                :error-message="v$.order.$errors[0]?.$message?.toString()" @blur="v$.order.$touch" />
            </div>

            <!-- Description -->
            <div class="col-12">
              <q-input v-model="form.description" type="textarea" label="Deskripsi *" outlined
                :error="v$.description.$error" :error-message="v$.description.$errors[0]?.$message?.toString()"
                @blur="v$.description.$touch" />
            </div>

            <!-- Instructions -->
            <div class="col-12">
              <q-editor v-model="form.instructions" label="Instruksi *" :toolbar="[
                ['bold', 'italic', 'strike', 'underline'],
                ['numerated', 'outdent', 'indent'],
                ['quote', 'unordered', 'ordered'],
              ]" min-height="200px" :error="v$.instructions.$error"
                :error-message="v$.instructions.$errors[0]?.$message?.toString()" @blur="v$.instructions.$touch" />
            </div>

            <!-- Submission Requirements -->
            <div class="col-12">
              <div class="text-subtitle2 q-mb-sm">Persyaratan Submission *</div>
              <div v-for="(req, index) in form.submission_requirements" :key="index" class="row q-gutter-sm q-mb-sm">
                <q-input v-model="form.submission_requirements[index]" outlined dense class="col"
                  :label="`Persyaratan ${index + 1}`" />
                <q-btn flat round color="negative" icon="close" @click="removeRequirement(index)"
                  :disable="form.submission_requirements.length <= 1" />
              </div>
              <q-btn flat color="primary" icon="add" label="Tambah Persyaratan" @click="addRequirement"
                class="q-mt-sm" />
            </div>

            <!-- Due Date -->
            <div class="col-12 col-md-6">
              <q-input v-model="form.due_date" label="Deadline *" outlined :error="v$.due_date.$error"
                :error-message="v$.due_date.$errors[0]?.$message?.toString()" @blur="v$.due_date.$touch">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <div class="row q-pa-md">
                        <div class="col-12 q-mb-md">
                          <q-date v-model="selectedDate" minimal :options="dateOptions"
                            @update:model-value="updateDateTime" />
                        </div>
                        <div class="col-12">
                          <q-time v-model="selectedTime" format24h @update:model-value="updateDateTime" />
                        </div>
                        <div class="col-12 q-mt-md row justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </div>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <!-- Add to script section: -->
            <!-- File Size Limit -->
            <div class="col-12 col-md-4">
              <q-input v-model.number="form.max_file_size_mb" type="number" label="Ukuran File Maksimal (MB) *" outlined
                :error="v$.max_file_size_mb.$error"
                :error-message="v$.max_file_size_mb.$errors[0]?.$message?.toString()"
                @blur="v$.max_file_size_mb.$touch" />
            </div>

            <!-- Allowed File Types -->
            <div class="col-12 col-md-4">
              <q-input v-model="form.allowed_file_types" label="Tipe File yang Diizinkan *" outlined
                hint="Contoh: pdf,doc,docx" :error="v$.allowed_file_types.$error"
                :error-message="v$.allowed_file_types.$errors[0]?.$message?.toString()"
                @blur="v$.allowed_file_types.$touch" />
            </div>

            <!-- Is Required Toggle -->
            <div class="col-12">
              <q-toggle v-model="form.is_required" label="Wajib dikerjakan" />
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
import { useRequired, useNumeric } from 'src/composables/validators';
import { useNotify } from 'src/composables/notifications';
import { useModuleContentStore } from 'src/stores/module-content';
import type { AssignmentContent } from 'src/models/module-content';

const props = defineProps<{
  moduleId: number;
}>();

const emit = defineEmits(['refresh']);
const showDialog = ref(false);
const loading = ref(false);
const moduleContentStore = useModuleContentStore();
const selectedDate = ref('');
const selectedTime = ref('');

const updateDateTime = () => {
  if (selectedDate.value && selectedTime.value) {
    const date = new Date(selectedDate.value);
    const [hours, minutes] = selectedTime.value.split(':');
    date.setHours(parseInt(hours), parseInt(minutes));
    form.due_date = date.toISOString();
  }
};

const form = reactive<AssignmentContent>({
  module_id: props.moduleId,
  title: '',
  description: '',
  instructions: '',
  submission_requirements: [''],
  due_date: '',
  max_file_size_mb: 10,
  allowed_file_types: 'pdf,doc,docx',
  order: 1,
  is_required: true
});

const rules = {
  title: { required: useRequired() },
  description: { required: useRequired() },
  instructions: { required: useRequired() },
  submission_requirements: {
    required: useRequired(),
    minLength: (value: string[]) => value.length >= 1
  },
  due_date: {
    required: useRequired(),
    afterNow: (value: string) => new Date(value) > new Date()
  },
  max_file_size_mb: {
    required: useRequired(),
    numeric: useNumeric(),
    between: (value: number) => value >= 1 && value <= 100
  },
  allowed_file_types: { required: useRequired() },
  order: { required: useRequired(), numeric: useNumeric() }
};

const v$ = useVuelidate(rules, form);

const addRequirement = () => {
  form.submission_requirements.push('');
};
const dateOptions = (date: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDate = new Date(date);
  return selectedDate >= today;
};

const removeRequirement = (index: number) => {
  form.submission_requirements.splice(index, 1);
};

const onSubmit = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) {
    useNotify('Mohon periksa form kembali', 'negative');
    return;
  }

  try {
    loading.value = true;
    await moduleContentStore.createAssignmentContent(form);
    useNotify('Tugas berhasil ditambahkan', 'positive');
    emit('refresh');
    showDialog.value = false;

    // Reset form
    form.title = '';
    form.description = '';
    form.instructions = '';
    form.submission_requirements = [''];
    form.due_date = '';
    form.max_file_size_mb = 10;
    form.allowed_file_types = 'pdf,doc,docx';
    form.order = 1;
    form.is_required = true;
    selectedDate.value = '';
    selectedTime.value = '';
    v$.value.$reset();
  } catch (error) {
    useNotify('Gagal menambahkan tugas', 'negative');
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
