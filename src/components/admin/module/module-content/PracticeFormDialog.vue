<template>
  <q-dialog v-model="showDialog" persistent maximized>
    <q-card class="q-pa-md">
      <q-bar class="bg-primary text-white">
        <q-icon name="fitness_center" />
        <div>{{ dialogTitle }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-bar>

      <q-stepper v-model="step" ref="stepper" color="primary" animated header-nav>
        <!-- Step 1: Basic Info -->
        <q-step :name="1" title="Informasi Latihan" icon="info" :done="step > 1">
          <q-form @submit="stepper?.next()">
            <q-card-section class="q-gutter-y-md">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input v-model="form.title" label="Judul Latihan *" outlined :error="v$.title.$error"
                    :error-message="v$.title.$errors[0]?.$message?.toString()" @blur="v$.title.$touch" />
                </div>
                <div class="col-12 col-md-6">
                  <q-input v-model.number="form.order" type="number" label="Urutan *" outlined :error="v$.order.$error"
                    :error-message="v$.order.$errors[0]?.$message?.toString()" @blur="v$.order.$touch" />
                </div>
                <div class="col-12">
                  <q-input v-model="form.description" type="textarea" label="Deskripsi *" outlined
                    :error="v$.description.$error" :error-message="v$.description.$errors[0]?.$message?.toString()"
                    @blur="v$.description.$touch" />
                </div>
                <div class="col-12 col-md-6">
                  <q-input v-model.number="form.time_limit_minutes" type="number" label="Batas Waktu (menit) *"
                    outlined :error="v$.time_limit_minutes.$error"
                    :error-message="v$.time_limit_minutes.$errors[0]?.$message?.toString()"
                    @blur="v$.time_limit_minutes.$touch" />
                </div>
                <div class="col-12">
                  <q-toggle v-model="form.is_required" label="Wajib dikerjakan" />
                </div>
              </div>
            </q-card-section>
            <q-stepper-navigation>
              <q-btn type="submit" color="primary" label="Lanjut" />
            </q-stepper-navigation>
          </q-form>
        </q-step>

        <!-- Step 2: Questions -->
        <q-step :name="2" title="Daftar Soal" icon="list" :done="step > 2">
          <q-card-section>
            <div class="row justify-between items-center q-mb-md">
              <div class="text-h6">Soal</div>
              <q-btn color="primary" icon="add" label="Tambah Soal" @click="addQuestion" unelevated />
            </div>

            <q-expansion-item v-for="(question, index) in form.questions" :key="index"
              :label="`Soal #${index + 1}: ${question.question || 'Baru'}`" header-class="bg-grey-2 text-dark"
              expand-separator>
              <template v-slot:header>
                <q-item-section>
                  <q-item-label>
                    #{{ index + 1 }} - {{ question.question || 'Soal Baru' }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn round flat color="negative" icon="delete" @click.stop="removeQuestion(index)" />
                </q-item-section>
              </template>

              <q-card>
                <q-card-section class="q-gutter-y-md">
                  <q-input v-model="question.question" label="Pertanyaan *" outlined
                    :error="!!getQuestionErrorMessage(index, 'question')"
                    :error-message="getQuestionErrorMessage(index, 'question')?.toString()" />

                  <div class="row q-col-gutter-md">
                    <div class="col-12 col-md-6">
                      <q-select v-model="question.type" :options="questionTypeOptions" label="Tipe Soal *" outlined
                        emit-value map-options />
                    </div>
                  </div>

                  <!-- Options for Multiple Choice -->
                  <template v-if="question.type === 'multiple_choice'">
                    <div class="text-subtitle2 q-mt-md">Pilihan Jawaban</div>
                    <div v-for="(option, optionIndex) in question.options" :key="optionIndex"
                      class="row items-center q-gutter-sm q-mb-sm">
                      <q-input v-model="question.options[optionIndex]" outlined dense class="col"
                        :label="`Pilihan ${optionIndex + 1}`" />
                      <q-btn flat round color="negative" icon="close" @click="removeOption(index, optionIndex)"
                        :disable="question.options.length <= 2" />
                    </div>
                    <q-btn flat color="primary" icon="add" label="Tambah Pilihan" @click="addOption(index)"
                      class="q-mt-sm" />

                    <q-select v-model="question.answer_key" :options="question.options" label="Jawaban Benar *"
                      outlined class="q-mt-md" />
                  </template>

                  <!-- Answer for True/False -->
                  <template v-if="question.type === 'true_false'">
                    <q-select v-model="question.answer_key" :options="[
                      { label: 'Benar', value: 'true' },
                      { label: 'Salah', value: 'false' }
                    ]" label="Jawaban Benar *" outlined emit-value map-options class="q-mt-md" />
                  </template>

                  <!-- Short Answer -->
                  <template v-if="question.type === 'short_answer'">
                    <q-input v-model="question.answer_key" label="Kunci Jawaban *" outlined class="q-mt-md" />
                  </template>

                  <q-input v-model="question.explanation" type="textarea" label="Penjelasan *" outlined />
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-card-section>

          <q-stepper-navigation>
            <q-btn @click="onSubmit" :label="submitButtonLabel" color="primary" :loading="loading" />
            <q-btn flat @click="stepper?.previous()" color="primary" label="Kembali" class="q-ml-sm" />
          </q-stepper-navigation>
        </q-step>
      </q-stepper>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { useNotify } from 'src/composables/notifications';
import { useModuleContentStore } from 'src/stores/module-content';
import { PracticeQuestion } from 'src/models/practice';
import { BaseContent, PracticeContent } from 'src/models/module-content';
import { QStepper } from 'quasar';

const props = defineProps<{
  moduleId: number;
}>();

const emit = defineEmits(['refresh']);
const showDialog = ref(false);
const loading = ref(false);
const moduleContentStore = useModuleContentStore();
const mode = ref<'add' | 'edit'>('add');
const contentId = ref<number | null>(null);
const step = ref(1);
const stepper = ref<QStepper | null>(null);

const questionTypeOptions = [
  { label: 'Pilihan Ganda', value: 'multiple_choice' },
  { label: 'Benar/Salah', value: 'true_false' },
  { label: 'Isian Singkat', value: 'short_answer' }
];

const initialFormState: PracticeContent = {
  module_id: props.moduleId,
  title: '',
  description: '',
  time_limit_minutes: 30,
  order: 1,
  is_required: true,
  questions: []
};

const form = reactive<PracticeContent>({ ...initialFormState });

const isEditing = computed(() => mode.value === 'edit');
const dialogTitle = computed(() => isEditing.value ? 'Edit Latihan' : 'Tambah Latihan Baru');
const submitButtonLabel = computed(() => isEditing.value ? 'Update' : 'Simpan');

const rules = computed(() => ({
  title: { required: (val: string) => !!val || 'Judul latihan wajib diisi' },
  description: { required: (val: string) => !!val || 'Deskripsi wajib diisi' },
  time_limit_minutes: {
    required: (val: number) => !!val || 'Batas waktu wajib diisi',
    minValue: (val: number) => val > 0 || 'Batas waktu harus lebih dari 0'
  },
  order: {
    required: (val: number) => !!val || 'Urutan wajib diisi',
    minValue: (val: number) => val > 0 || 'Urutan harus lebih dari 0'
  },
  questions: {
    required: (val: PracticeQuestion[]) => val.length > 0 || 'Minimal harus ada 1 soal',
    $each: {
      question: { required: (val: string) => !!val || 'Pertanyaan wajib diisi' },
      type: { required: (val: string) => !!val || 'Tipe soal wajib dipilih' },
      answer_key: { required: (val: string) => !!val || 'Kunci jawaban wajib diisi' },
      explanation: { required: (val: string) => !!val || 'Penjelasan wajib diisi' },
      options: {
        minLength: (val: string[], siblings: PracticeQuestion) =>
          siblings.type !== 'multiple_choice' || val.length >= 2 || 'Minimal harus ada 2 pilihan'
      }
    }
  }
}));

const v$ = useVuelidate(rules, form);

const addQuestion = () => {
  form.questions.push({
    question: '',
    type: 'multiple_choice',
    options: ['', ''],
    answer_key: '',
    explanation: ''
  });
};

const removeQuestion = (index: number) => {
  form.questions.splice(index, 1);
};

const addOption = (questionIndex: number) => {
  form.questions[questionIndex].options.push('');
};

const removeOption = (questionIndex: number, optionIndex: number) => {
  const question = form.questions[questionIndex];
  if (question.options.length > 2) {
    question.options.splice(optionIndex, 1);
  }
};

const getQuestionErrorMessage = (index: number, field: string) => {
  const error = v$.value.questions?.$each?.[index]?.[field]?.$errors?.[0];
  return error ? error.$message : '';
};

const onSubmit = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) {
    useNotify('Mohon periksa form kembali', 'negative');
    return;
  }

  try {
    loading.value = true;
    if (isEditing.value && contentId.value) {
      await moduleContentStore.updatePracticeContent(contentId.value, form);
      useNotify('Latihan berhasil diperbarui', 'positive');
    } else {
      await moduleContentStore.createPracticeContent(form);
      useNotify('Latihan berhasil ditambahkan', 'positive');
    }
    emit('refresh');
    showDialog.value = false;
  } catch (error) {
    useNotify('Gagal menyimpan latihan', 'negative');
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  Object.assign(form, initialFormState);
  v$.value.$reset();
};

defineExpose({
  show: (contentToEdit: BaseContent | null = null) => {
    step.value = 1;
    if (contentToEdit && contentToEdit.content_type === 'practice') {
      mode.value = 'edit';
      contentId.value = contentToEdit.id;

      const practiceContent = contentToEdit.content as PracticeContent;
      Object.assign(form, {
        ...practiceContent,
        title: contentToEdit.title,
        order: contentToEdit.order,
        is_required: contentToEdit.is_required,
        questions: practiceContent.questions.map(q => ({
          ...q,
          options: q.options || [],
          explanation: q.explanation || ''
        }))
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
