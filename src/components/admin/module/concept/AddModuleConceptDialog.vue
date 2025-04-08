<template>
  <q-dialog v-model="conceptStore.addConceptDialog" persistent>
    <q-card style="width: 700px; max-width: 80vw;">
      <q-card-section class="row items-center">
        <div class="text-h6">Tambah Konsep Baru</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-form @submit="onSubmit">
        <q-card-section class="q-gutter-md">
          <!-- Order Input -->
          <q-input v-model.number="conceptForm.order" type="number" label="Urutan *" outlined :error="v$.order.$error"
            :error-message="v$.order.$errors[0]?.$message?.toString()" @blur="v$.order.$touch" />

          <!-- Title Input -->
          <q-input v-model="conceptForm.title" label="Judul Konsep *" outlined :error="v$.title.$error"
            :error-message="v$.title.$errors[0]?.$message?.toString()" @blur="v$.title.$touch" />
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
import { useModuleConceptStore } from 'src/stores/module-concept';

interface ConceptForm {
  module_id: number;
  order: number;
  title: string;
}

const emit = defineEmits(['refreshData']);
const conceptStore = useModuleConceptStore();
const loading = ref(false);

const conceptForm = reactive<ConceptForm>({
  module_id: conceptStore.moduleId,
  order: 1,
  title: ''
});

const rules = {
  order: { required: useRequired(), numeric: useNumeric() },
  title: { required: useRequired() }
};

const v$ = useVuelidate(rules, conceptForm);

const onSubmit = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) {
    useNotify('Mohon periksa form kembali', 'negative');
    return;
  }

  try {
    loading.value = true;
    await conceptStore.createConcept(conceptStore.moduleId, {
      order: conceptForm.order,
      title: conceptForm.title
    });

    useNotify('Konsep berhasil ditambahkan', 'positive');
    emit('refreshData');

    // Reset form
    conceptForm.order = 1;
    conceptForm.title = '';
    v$.value.$reset();

  } catch (error) {
    useNotify('Gagal menambahkan konsep', 'negative');
  } finally {
    loading.value = false;
  }
};
</script>
