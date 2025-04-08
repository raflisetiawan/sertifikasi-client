<template>
  <q-dialog v-model="exerciseStore.addExerciseDialog" persistent>
    <q-card style="width: 700px; max-width: 80vw;">
      <q-card-section class="row items-center">
        <div class="text-h6">Tambah Latihan Baru</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-form @submit="onSubmit">
        <q-card-section class="q-gutter-md">
          <!-- Order Input -->
          <q-input v-model.number="exerciseForm.order" type="number" label="Urutan *" outlined :error="v$.order.$error"
            :error-message="v$.order.$errors[0]?.$message?.toString()" @blur="v$.order.$touch" />

          <!-- Description Input -->
          <q-editor v-model="exerciseForm.description" label="Deskripsi *" :error="v$.description.$error"
            min-height="200px" :toolbar="[
              ['bold', 'italic', 'strike', 'underline'],
              ['token', 'hr', 'link'],
              [
                {
                  label: 'Font Size',
                  icon: 'format_size',
                  fixedLabel: true,
                  fixedIcon: true,
                  list: 'no-icons',
                  options: ['size-1', 'size-2', 'size-3', 'size-4', 'size-5', 'size-6', 'size-7']
                }
              ],
              ['quote', 'unordered', 'ordered'],
              ['undo', 'redo']
            ]" />
          <div class="text-negative text-caption" v-if="v$.description.$error">
            {{ v$.description.$errors[0]?.$message }}
          </div>
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
import { useModuleExerciseStore } from 'src/stores/module-exercise';

const emit = defineEmits(['refreshData']);
const exerciseStore = useModuleExerciseStore();
const loading = ref(false);

const exerciseForm = reactive({
  order: 1,
  description: ''
});

const rules = {
  order: { required: useRequired(), numeric: useNumeric() },
  description: { required: useRequired() }
};

const v$ = useVuelidate(rules, exerciseForm);

const onSubmit = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) {
    useNotify('Mohon periksa form kembali', 'negative');
    return;
  }

  try {
    loading.value = true;
    await exerciseStore.createExercise(exerciseStore.moduleId, {
      order: exerciseForm.order,
      description: exerciseForm.description
    });

    useNotify('Latihan berhasil ditambahkan', 'positive');
    emit('refreshData');

    // Reset form
    exerciseForm.order = 1;
    exerciseForm.description = '';
    v$.value.$reset();

  } catch (error) {
    useNotify('Gagal menambahkan latihan', 'negative');
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss">
.q-editor {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
}
</style>
