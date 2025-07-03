<template>
  <q-dialog v-model="showDialog" persistent maximized>
    <q-card class="q-pa-md">
      <q-bar class="bg-primary text-white">
        <q-icon name="quiz" />
        <div>{{ dialogTitle }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-bar>

      <q-stepper v-model="step" ref="stepper" color="primary" animated header-nav>
        <!-- Step 1: Basic Info -->
        <q-step :name="1" title="Informasi Kuis" icon="info" :done="step > 1">
          <q-form @submit.prevent="nextStep">
            <q-card-section class="q-gutter-y-md">
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
            </q-card-section>
            <q-stepper-navigation>
              <q-btn @click="nextStep" color="primary" label="Lanjut" />
            </q-stepper-navigation>
          </q-form>
        </q-step>

        <!-- Step 2: Questions -->
        <q-step :name="2" title="Daftar Pertanyaan" icon="list" :done="step > 2">
          <q-card-section>
            <div class="row justify-between items-center q-mb-md">
              <div class="text-h6">Pertanyaan</div>
              <q-btn color="primary" icon="add" label="Tambah Pertanyaan" @click="addQuestion" unelevated />
            </div>

            <q-expansion-item v-for="(question, index) in form.questions" :key="index"
              :label="`Pertanyaan #${index + 1}: ${question.question || 'Baru'}`"
              header-class="bg-grey-2 text-dark" expand-separator>
              <template v-slot:header>
                <q-item-section>
                  <q-item-label>
                    #{{ index + 1 }} - {{ question.question || 'Pertanyaan Baru' }}
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
                      <q-select v-model="question.type" :options="questionTypeOptions" label="Tipe Pertanyaan *"
                        outlined emit-value map-options @update:model-value="onQuestionTypeChange(question)" />
                    </div>
                    <div class="col-12 col-md-6">
                      <q-input v-model.number="question.score" type="number" label="Skor *" outlined />
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

                    <q-select v-model="question.correct_answer"
                      :options="question.options.map((opt, i) => ({ label: opt, value: i }))" label="Jawaban Benar *"
                      outlined emit-value map-options class="q-mt-md" />
                  </template>

                  <!-- Answer for True/False -->
                  <template v-if="question.type === 'true_false'">
                    <q-select v-model="question.correct_answer" :options="[
                      { label: 'Benar', value: true },
                      { label: 'Salah', value: false }
                    ]" label="Jawaban Benar *" outlined emit-value map-options class="q-mt-md" />
                  </template>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-card-section>

          <q-stepper-navigation>
            <q-btn @click="onSubmit" :label="submitButtonLabel" color="primary" :loading="loading" />
            <q-btn flat @click="prevStep" color="primary" label="Kembali" class="q-ml-sm" />
          </q-stepper-navigation>
        </q-step>
      </q-stepper>
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
import { QStepper } from 'quasar';

// Local interface for the form's question structure
interface FormQuestion {
  question: string;
  type: 'multiple_choice' | 'true_false' | 'essay';
  options: string[];
  correct_answer: string | boolean | number | null;
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
const step = ref(1);
const stepper = ref<QStepper | null>(null);


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

const nextStep = () => {
  stepper.value?.next();
};

const prevStep = () => {
  stepper.value?.previous();
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
  } catch (error: unknown) {
    let errorMessage = `Gagal ${mode.value === 'edit' ? 'memperbarui' : 'menambahkan'} kuis`;
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
  Object.assign(form, { ...initialFormState, questions: [] });
  form.questions = []; // Ensure questions array is reset
  v$.value.$reset();
}

defineExpose({
  show: (contentToEdit: BaseContent | null = null) => {
    step.value = 1;
    if (contentToEdit && contentToEdit.content_type === 'quiz') {
      mode.value = 'edit';
      contentId.value = contentToEdit.id;

      const quizContent = JSON.parse(JSON.stringify(contentToEdit.content)) as QuizContent;

      if (quizContent.questions) {
        quizContent.questions.forEach((question) => {
          if (question.type === 'multiple_choice' && typeof question.correct_answer === 'string') {
            const answerIndex = question.options.indexOf(question.correct_answer);
            (question as FormQuestion).correct_answer = answerIndex !== -1 ? answerIndex : null;
          }
        });
      }

      Object.assign(form, {
        ...quizContent,
        title: contentToEdit.title,
        order: contentToEdit.order,
        is_required: contentToEdit.is_required,
        questions: quizContent.questions || [],
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
