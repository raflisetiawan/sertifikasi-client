<template>
  <q-dialog v-model="showDialog" persistent maximized>
    <q-card class="q-pa-md">
      <q-bar class="bg-primary text-white">
        <q-icon name="assignment" />
        <div>{{ dialogTitle }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-bar>

      <q-form @submit="onSubmit">
        <q-card-section class="q-gutter-y-md">
          <q-card bordered flat>
            <q-card-section class="q-gutter-y-md">
              <div class="text-subtitle1 text-weight-medium">Detail Tugas</div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                  <q-input v-model="form.title" label="Judul Tugas *" outlined :error="v$.title.$error"
                    :error-message="v$.title.$errors[0]?.$message?.toString()" @blur="v$.title.$touch" />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input v-model.number="form.order" type="number" label="Urutan *" outlined :error="v$.order.$error"
                    :error-message="v$.order.$errors[0]?.$message?.toString()" @blur="v$.order.$touch" />
                </div>
              </div>
              <q-input v-model="form.description" type="textarea" label="Deskripsi *" outlined
                :error="v$.description.$error" :error-message="v$.description.$errors[0]?.$message?.toString()"
                @blur="v$.description.$touch" />
            </q-card-section>
          </q-card>

          <q-card bordered flat>
            <q-card-section class="q-gutter-y-md">
              <div class="text-subtitle1 text-weight-medium">Instruksi Pengerjaan</div>
              <q-editor v-model="form.instructions" :toolbar="[
                ['bold', 'italic', 'strike', 'underline'],
                ['numerated', 'outdent', 'indent'],
                ['quote', 'unordered', 'ordered'],
              ]" min-height="200px" :error="v$.instructions.$error"
                :error-message="v$.instructions.$errors[0]?.$message?.toString()" @blur="v$.instructions.$touch" />
            </q-card-section>
          </q-card>

          <q-card bordered flat>
            <q-card-section class="q-gutter-y-md">
              <div class="text-subtitle1 text-weight-medium">Pengaturan Submission</div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input v-model="form.due_date" label="Deadline *" outlined :error="v$.due_date.$error"
                    :error-message="v$.due_date.$errors[0]?.$message?.toString()" @blur="v$.due_date.$touch">
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <div class="row q-pa-md">
                            <div class="col-12 q-mb-md">
                              <q-date v-model="selectedDate" minimal @update:model-value="updateDateTime" />
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
                <div class="col-12 col-md-6">
                  <q-input v-model.number="form.max_file_size_mb" type="number" label="Ukuran File Maksimal (MB) *"
                    outlined :error="v$.max_file_size_mb.$error"
                    :error-message="v$.max_file_size_mb.$errors[0]?.$message?.toString()"
                    @blur="v$.max_file_size_mb.$touch" />
                </div>
                <div class="col-12">
                  <q-input v-model="form.allowed_file_types" label="Tipe File yang Diizinkan *" outlined
                    hint="Contoh: pdf,doc,docx" :error="v$.allowed_file_types.$error"
                    :error-message="v$.allowed_file_types.$errors[0]?.$message?.toString()"
                    @blur="v$.allowed_file_types.$touch" />
                </div>
              </div>
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
import type { AssignmentContent, BaseContent } from 'src/models/module-content';

const props = defineProps<{
  moduleId: number;
}>();

const emit = defineEmits(['refresh']);
const showDialog = ref(false);
const loading = ref(false);
const moduleContentStore = useModuleContentStore();
const mode = ref<'add' | 'edit'>('add');
const contentId = ref<number | null>(null);
const selectedDate = ref('');
const selectedTime = ref('');

const isEditMode = computed(() => mode.value === 'edit');
const dialogTitle = computed(() => isEditMode.value ? 'Edit Tugas' : 'Tambah Tugas Baru');
const submitButtonLabel = computed(() => isEditMode.value ? 'Update' : 'Simpan');

const initialFormState: AssignmentContent = {
  module_id: props.moduleId,
  title: '',
  description: '',
  instructions: '',
  submission_requirements: [''],
  due_date: '',
  max_file_size_mb: 10,
  allowed_file_types: 'pdf,doc,docx',
  order: 1,
  is_required: true,
};

const form = reactive<AssignmentContent>({ ...initialFormState });

const updateDateTime = () => {
  if (selectedDate.value && selectedTime.value) {
    const date = new Date(selectedDate.value);
    const [hours, minutes] = selectedTime.value.split(':');
    date.setHours(parseInt(hours), parseInt(minutes));
    form.due_date = date.toISOString();
  }
};

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

const resetForm = () => {
  Object.assign(form, initialFormState);
  selectedDate.value = '';
  selectedTime.value = '';
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
      await moduleContentStore.updateAssignmentContent(contentId.value, form);
      useNotify('Tugas berhasil diperbarui', 'positive');
    } else {
      await moduleContentStore.createAssignmentContent(form);
      useNotify('Tugas berhasil ditambahkan', 'positive');
    }
    emit('refresh');
    showDialog.value = false;
  } catch (error) {
    useNotify(`Gagal ${isEditMode.value ? 'memperbarui' : 'menambahkan'} tugas`, 'negative');
  } finally {
    loading.value = false;
  }
};

defineExpose({
  show: (contentToEdit: BaseContent | null = null) => {
    if (contentToEdit && contentToEdit.content_type === 'assignment') {
      mode.value = 'edit';
      contentId.value = contentToEdit.id;

      const assignmentContent = contentToEdit.content as AssignmentContent;
      Object.assign(form, {
        ...assignmentContent,
        title: contentToEdit.title,
        order: contentToEdit.order,
        is_required: contentToEdit.is_required,
      });

      const dueDate = new Date(form.due_date);
      selectedDate.value = dueDate.toISOString().split('T')[0];
      selectedTime.value = `${dueDate.getHours().toString().padStart(2, '0')}:${dueDate.getMinutes().toString().padStart(2, '0')}`;
    } else {
      mode.value = 'add';
      contentId.value = null;
      resetForm();
    }
    showDialog.value = true;
  }
});
</script>
