<template>
  <q-dialog v-model="showDialog" persistent maximized>
    <q-card class="q-pa-md">
      <q-card-section class="row items-center">
        <div class="text-h6">{{ dialogTitle }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-form @submit="onSubmit">
        <q-card-section class="q-gutter-md">
          <!-- Basic Info Section -->
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input v-model="form.title" label="Judul Kuis *" outlined :error="v$.title.$error"
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

            <div class="col-12 col-md-4">
              <q-input v-model.number="form.time_limit_minutes" type="number" label="Batas Waktu (menit) *" outlined
                :error="v$.time_limit_minutes.$error"
                :error-message="v$.time_limit_minutes.$errors[0]?.$message?.toString()"
                @blur="v$.time_limit_minutes.$touch" />
            </div>

            <div class="col-12 col-md-4">
              <q-input v-model.number="form.passing_score" type="number" label="Nilai Kelulusan (0-100) *" outlined
                :error="v$.passing_score.$error" :error-message="v$.passing_score.$errors[0]?.$message?.toString()"
                @blur="v$.passing_score.$touch" />
            </div>

            <div class="col-12 col-md-4">
              <q-input v-model.number="form.max_attempts" type="number" label="Jumlah Percobaan *" outlined
                :error="v$.max_attempts.$error" :error-message="v$.max_attempts.$errors[0]?.$message?.toString()"
                @blur="v$.max_attempts.$touch" />
            </div>

            <div class="col-12">
              <q-toggle v-model="form.is_required" label="Wajib dikerjakan" />
            </div>
          </div>

          <!-- Questions Section -->
          <div class="text-h6 q-mt-lg">Daftar Pertanyaan</div>
          <q-btn color="primary" icon="add" label="Tambah Pertanyaan" @click="addQuestion" />

          <div v-for="(question, index) in form.questions" :key="index"
            class="q-pa-md bg-grey-2 q-mb-md rounded-borders">
            <div class="row justify-between items-center q-mb-md">
              <div class="text-subtitle1">Pertanyaan #{{ index + 1 }}</div>
              <q-btn round flat color="negative" icon="delete" @click="removeQuestion(index)" />
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-input v-model="question.question" label="Pertanyaan *" outlined
                  :error="!!getQuestionErrorMessage(index, 'question')"
                  :error-message="getQuestionErrorMessage(index, 'question')?.toString()" />
              </div>

              <div class="col-12 col-md-6">
                <q-select v-model="question.type" :options="questionTypeOptions" label="Tipe Pertanyaan *" outlined
                  emit-value map-options @update:model-value="onQuestionTypeChange(question)" />
              </div>

              <div class="col-12 col-md-6">
                <q-input v-model.number="question.score" type="number" label="Skor *" outlined />
              </div>

              <!-- Multiple Choice Options -->
              <template v-if="question.type === 'multiple_choice'">
                <div class="col-12">
                  <div class="text-subtitle2">Pilihan Jawaban</div>
                  <div v-for="(option, optionIndex) in question.options" :key="optionIndex"
                    class="row q-gutter-sm q-mb-sm">
                    <q-input v-model="question.options[optionIndex]" outlined dense class="col"
                      :label="`Pilihan ${optionIndex + 1}`" />
                    <q-btn flat round color="negative" icon="close" @click="removeOption(index, optionIndex)"
                      :disable="question.options.length <= 2" />
                  </div>
                  <q-btn flat color="primary" icon="add" label="Tambah Pilihan" @click="addOption(index)"
                    class="q-mt-sm" />
                </div>

                <div class="col-12">
                  <q-select v-model="question.correct_answer"
                    :options="question.options.map((opt, i) => ({ label: opt, value: i }))" label="Jawaban Benar *"
                    outlined emit-value map-options />
                </div>
              </template>

              <!-- True/False Answer -->
              <template v-if="question.type === 'true_false'">
                <div class="col-12">
                  <q-select v-model="question.correct_answer" :options="[
                    { label: 'Benar', value: true },
                    { label: 'Salah', value: false }
                  ]" label="Jawaban Benar *" outlined emit-value map-options />
                </div>
              </template>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Batal" color="grey" v-close-popup />
          <q-btn type="submit" :label="submitButtonLabel" color="primary" :loading="loading" />
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
import type { BaseContent, QuizContent } from 'src/models/module-content';

// Local interface for the form's question structure
interface FormQuestion {
  question: string;
  type: 'multiple_choice' | 'true_false' | 'essay';
  options: string[];
  correct_answer: string | boolean | number | null; // Allow number for v-model binding
  score: number;
}

// Local interface for the form state, decoupled from the imported model
interface QuizForm {
  module_id: number;
  title: string;
  description: string;
  time_limit_minutes: number;
  passing_score: number;
  max_attempts: number;
  questions: FormQuestion[];
  order: number;
  is_required: boolean;
}

const props = defineProps<{
  moduleId: number;
}>();

const emit = defineEmits(['refresh']);
const showDialog = ref(false);
const loading = ref(false);
const moduleContentStore = useModuleContentStore();
const mode = ref<'add' | 'edit'>('add');
const contentId = ref<number | null>(null);

// Computed properties for dynamic UI
const dialogTitle = computed(() => mode.value === 'edit' ? 'Edit Kuis' : 'Tambah Kuis Baru');
const submitButtonLabel = computed(() => mode.value === 'edit' ? 'Update' : 'Simpan');

const questionTypeOptions = [
  { label: 'Pilihan Ganda', value: 'multiple_choice' },
  { label: 'Benar/Salah', value: 'true_false' },
  { label: 'Essay', value: 'essay' }
];

const initialFormState: QuizForm = {
  module_id: props.moduleId,
  title: '',
  description: '',
  time_limit_minutes: 30,
  passing_score: 70,
  max_attempts: 1,
  questions: [],
  order: 1,
  is_required: true
};

const form = reactive<QuizForm>({ ...initialFormState });

const rules = computed(() => ({
  title: { required: useRequired() },
  description: { required: useRequired() },
  time_limit_minutes: {
    required: useRequired(),
    numeric: useNumeric(),
    minValue: (value: number) => value >= 1
  },
  passing_score: {
    required: useRequired(),
    numeric: useNumeric(),
    between: (value: number) => value >= 0 && value <= 100
  },
  max_attempts: {
    required: useRequired(),
    numeric: useNumeric(),
    minValue: (value: number) => value >= 1
  },
  order: { required: useRequired(), numeric: useNumeric() },
  questions: {
    required: useRequired(),
    $each: {
      question: { required: useRequired() },
      type: { required: useRequired() },
      score: {
        required: useRequired(),
        numeric: useNumeric(),
        minValue: (value: number) => value >= 1
      },
      options: {
        required: (value: string[], parentVm: { type: string }) =>
          parentVm.type === 'multiple_choice' ? value.length >= 2 : true
      },
      correct_answer: {
        required: (value: string | boolean, parentVm: { type: string }) =>
          parentVm.type !== 'essay'
      }
    }
  }
}));


const v$ = useVuelidate(rules, form);

const addQuestion = () => {
  const newQuestion: FormQuestion = {
    question: '',
    type: 'multiple_choice',
    options: ['', ''],
    correct_answer: null,
    score: 1
  };
  form.questions = [...form.questions, newQuestion];
};

const getQuestionErrorMessage = (index: number, field: string) => {
  return v$.value.questions?.$each?.[index]?.[field]?.$errors?.[0]?.$message;
};

const removeQuestion = (index: number) => {
  form.questions.splice(index, 1);
};

const addOption = (questionIndex: number) => {
  form.questions[questionIndex].options.push('');
};

const removeOption = (questionIndex: number, optionIndex: number) => {
  form.questions[questionIndex].options.splice(optionIndex, 1);
};

const onQuestionTypeChange = (question: FormQuestion) => {
  question.correct_answer = null; // Reset correct answer when type changes
  if (question.type === 'multiple_choice' && question.options.length < 2) {
    question.options = ['', ''];
  }
};

const onSubmit = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) {
    useNotify('Mohon periksa form kembali', 'negative');
    return;
  }

  // Create a deep copy to avoid modifying the original form state directly
  const formToSubmit = JSON.parse(JSON.stringify(form));

  // Convert correct_answer to the option string before submitting
  formToSubmit.questions.forEach((question: FormQuestion) => {
    if (question.type === 'multiple_choice' && typeof question.correct_answer === 'number') {
      question.correct_answer = question.options[question.correct_answer];
    }
  });


  try {
    loading.value = true;
    if (mode.value === 'edit' && contentId.value) {
      await moduleContentStore.updateQuizContent(contentId.value, formToSubmit);
      useNotify('Kuis berhasil diperbarui', 'positive');
    } else {
      await moduleContentStore.createQuizContent(formToSubmit);
      useNotify('Kuis berhasil ditambahkan', 'positive');
    }
    emit('refresh');
    showDialog.value = false;
  } catch (error) {
    useNotify(`Gagal ${mode.value === 'edit' ? 'memperbarui' : 'menambahkan'} kuis`, 'negative');
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  Object.assign(form, { ...initialFormState, questions: [] });
  form.questions = []; // Ensure questions array is reset
  v$.value.$reset();
}

defineExpose({
  show: (contentToEdit: (BaseContent & { content: QuizContent }) | null = null) => {
    if (contentToEdit) {
      // Edit Mode
      mode.value = 'edit';
      contentId.value = contentToEdit.id;

      // Create a deep copy to avoid modifying the original store data
      const editableContent = JSON.parse(JSON.stringify(contentToEdit));

      // Map correct_answer from string to index for multiple choice questions
      if (editableContent.content.questions) {
        editableContent.content.questions.forEach((question: FormQuestion) => {
          if (question.type === 'multiple_choice' && typeof question.correct_answer === 'string') {
            const answerIndex = question.options.indexOf(question.correct_answer);
            question.correct_answer = answerIndex !== -1 ? answerIndex : null;
          }
        });
      }

      form.title = editableContent.title;
      form.order = editableContent.order;
      form.is_required = editableContent.is_required;
      form.description = editableContent.content.description;
      form.time_limit_minutes = editableContent.content.time_limit_minutes;
      form.passing_score = editableContent.content.passing_score;
      form.max_attempts = editableContent.content.max_attempts;
      form.questions = editableContent.content.questions || [];

    } else {
      // Add Mode
      mode.value = 'add';
      contentId.value = null;
      resetForm();
    }
    showDialog.value = true;
  }
});
</script>
