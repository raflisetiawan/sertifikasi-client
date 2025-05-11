<template>
  <q-dialog v-model="showDialog" persistent maximized>
    <q-card>
      <q-card-section class="row items-center">
        <div class="text-h6">Tambah Latihan Baru</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-form @submit="onSubmit">
        <q-card-section class="q-gutter-md">
          <!-- Basic Info Section -->
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input v-model="form.title" label="Judul Latihan *" outlined :error="!!getErrorMessage('title')"
                :error-message="getErrorMessage('title')" @blur="v$.title.$touch" />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model.number="form.order" type="number" label="Urutan *" outlined
                :error="!!getErrorMessage('order')" :error-message="getErrorMessage('order')" @blur="v$.order.$touch" />
            </div>

            <div class="col-12">
              <q-input v-model="form.description" type="textarea" label="Deskripsi *" outlined
                :error="!!getErrorMessage('description')" :error-message="getErrorMessage('description')"
                @blur="v$.description.$touch" />
            </div>

            <div class="col-12 col-md-6">
              <q-input v-model.number="form.time_limit_minutes" type="number" label="Batas Waktu (menit) *" outlined
                :error="!!getErrorMessage('time_limit_minutes')" :error-message="getErrorMessage('time_limit_minutes')"
                @blur="v$.time_limit_minutes.$touch" />
            </div>

            <div class="col-12">
              <q-toggle v-model="form.is_required" label="Wajib dikerjakan" />
            </div>
          </div>

          <!-- Questions Section -->
          <div class="text-h6 q-mt-lg">Daftar Soal</div>
          <q-btn color="primary" icon="add" label="Tambah Soal" @click="addQuestion" />

          <div v-for="(question, index) in form.questions" :key="index"
            class="q-pa-md bg-grey-2 q-mb-md rounded-borders">
            <div class="row justify-between items-center q-mb-md">
              <div class="text-subtitle1">Soal #{{ index + 1 }}</div>
              <q-btn round flat color="negative" icon="delete" @click="removeQuestion(index)" />
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-input v-model="question.question" label="Pertanyaan *" outlined
                  :error="!!getQuestionErrorMessage(index, 'question')"
                  :error-message="getQuestionErrorMessage(index, 'question')" />
              </div>

              <div class="col-12 col-md-6">
                <q-select v-model="question.type" :options="questionTypeOptions" label="Tipe Soal *" outlined emit-value
                  map-options />
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
                  <q-select v-model="question.answer_key" :options="question.options" label="Jawaban Benar *"
                    outlined />
                </div>
              </template>

              <!-- True/False Answer -->
              <template v-if="question.type === 'true_false'">
                <div class="col-12">
                  <q-select v-model="question.answer_key" :options="[
                    { label: 'Benar', value: 'true' },
                    { label: 'Salah', value: 'false' }
                  ]" label="Jawaban Benar *" outlined emit-value map-options />
                </div>
              </template>

              <!-- Short Answer -->
              <template v-if="question.type === 'short_answer'">
                <div class="col-12">
                  <q-input v-model="question.answer_key" label="Kunci Jawaban *" outlined />
                </div>
              </template>

              <div class="col-12">
                <q-input v-model="question.explanation" type="textarea" label="Penjelasan *" outlined />
              </div>
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
import { ref, reactive, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { useNotify } from 'src/composables/notifications';
import { usePracticeStore } from 'src/stores/practice';
import { CreatePracticePayload, PracticeQuestion } from 'src/models/practice';

const props = defineProps<{
  moduleId: number;
}>();

const emit = defineEmits(['refresh']);
const showDialog = ref(false);
const loading = ref(false);
const practiceStore = usePracticeStore();

const questionTypeOptions = [
  { label: 'Pilihan Ganda', value: 'multiple_choice' },
  { label: 'Benar/Salah', value: 'true_false' },
  { label: 'Isian Singkat', value: 'short_answer' }
];

const form = reactive<CreatePracticePayload>({
  module_id: props.moduleId,
  title: '',
  description: '',
  time_limit_minutes: 30,
  order: 1,
  is_required: true,
  questions: [] // Initialize as empty array
});
const rules = computed(() => ({
  title: {
    required: (val: string) => !!val || 'Judul latihan wajib diisi'
  },
  description: {
    required: (val: string) => !!val || 'Deskripsi wajib diisi'
  },
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
      question: {
        required: (val: string) => !!val || 'Pertanyaan wajib diisi'
      },
      type: {
        required: (val: string) => !!val || 'Tipe soal wajib dipilih'
      },
      answer_key: {
        required: (val: string) => !!val || 'Kunci jawaban wajib diisi'
      },
      explanation: {
        required: (val: string) => !!val || 'Penjelasan wajib diisi'
      },
      options: {
        minLength: (val: string[], siblings: any) =>
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
    options: ['', ''], // Initialize with empty options
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
  return v$.value.questions?.$each?.[index]?.[field]?.$errors?.[0]?.$message;
};

const getErrorMessage = (field: string): string => {
  return v$.value[field].$errors.map(e => e.$message).join(', ');
};

const onSubmit = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) {
    useNotify('Mohon periksa form kembali', 'negative');
    return;
  }

  try {
    loading.value = true;
    await practiceStore.createPractice(form);
    useNotify('Latihan berhasil ditambahkan', 'positive');
    emit('refresh');
    showDialog.value = false;
    resetForm();
  } catch (error) {
    useNotify('Gagal menambahkan latihan', 'negative');
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  form.title = '';
  form.description = '';
  form.time_limit_minutes = 30;
  form.order = 1;
  form.is_required = true;
  form.questions = [];
  v$.value.$reset();
};

defineExpose({
  show: () => {
    showDialog.value = true;
  }
});
</script>
