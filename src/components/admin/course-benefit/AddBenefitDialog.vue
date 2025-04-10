<template>
  <q-dialog v-model="courseBenefitStore.addBenefitDialog" persistent>
    <q-card style="width: 700px; max-width: 80vw;">
      <q-card-section class="row items-center">
        <div class="text-h6">Tambah Benefit Baru</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-form @submit="onSubmit">
        <q-card-section class="q-gutter-md">
          <!-- Title Input -->
          <q-input v-model="benefitForm.judul" label="Judul Benefit *" outlined :error="v$.judul.$error"
            :error-message="v$.judul.$errors[0]?.$message?.toString()" @blur="v$.judul.$touch" />
          <!-- Subtitle Input -->
          <q-input v-model="benefitForm.subjudul" label="Subjudul Benefit" outlined :error="v$.subjudul.$error"
            :error-message="v$.subjudul.$errors[0]?.$message?.toString()" @blur="v$.subjudul.$touch" />
          <!-- Description Input -->
          <q-input v-model="benefitForm.deskripsi" label="Deskripsi Benefit" outlined :error="v$.deskripsi.$error"
            :error-message="v$.deskripsi.$errors[0]?.$message?.toString()" @blur="v$.deskripsi.$touch" />
          <!-- Image Input -->
          <q-file v-model="benefitForm.gambar" label="Upload Contoh Gambar Sertifikat" use-chips counter clearable
            accept=".jpg, .png, .jpeg, .jfif" />
          <!-- Obtained Through Input -->
          <q-input v-model="benefitForm.diperoleh_melalui" label="Diperoleh Melalui" outlined
            :error="v$.diperoleh_melalui.$error" :error-message="v$.diperoleh_melalui.$errors[0]?.$message?.toString()"
            @blur="v$.diperoleh_melalui.$touch" />

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
import { useRequired } from 'src/composables/validators';
import { useNotify } from 'src/composables/notifications';
import { useCourseBenefitStore } from 'src/stores/course-benefit';

interface BenefitForm {
  course_id: number;
  judul: string;
  subjudul: string;
  deskripsi: string;
  gambar: File | null;
  diperoleh_melalui: string;
}

const emit = defineEmits(['refreshData']);
const courseBenefitStore = useCourseBenefitStore();
const loading = ref(false);

const benefitForm = reactive<BenefitForm>({
  course_id: courseBenefitStore.courseId,
  judul: '',
  subjudul: '',
  deskripsi: '',
  gambar: null,
  diperoleh_melalui: ''
});

const rules = {
  judul: { required: useRequired() },
  subjudul: {},
  deskripsi: { required: useRequired() },
  gambar: { required: useRequired() },
  diperoleh_melalui: { required: useRequired() }
};

const v$ = useVuelidate(rules, benefitForm);

const onSubmit = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) {
    useNotify('Mohon periksa form kembali', 'negative');
    return;
  }

  try {
    loading.value = true;
    const formData = new FormData();

    formData.append('course_id', courseBenefitStore.courseId.toString());
    formData.append('title', benefitForm.judul);
    formData.append('subtitle', benefitForm.subjudul);
    formData.append('description', benefitForm.deskripsi);
    formData.append('earn_by', benefitForm.diperoleh_melalui);
    formData.append('image', benefitForm.gambar as File);
    if (benefitForm.gambar instanceof File) {
      formData.append('image', benefitForm.gambar);
    }

    await courseBenefitStore.createBenefit(formData);

    useNotify('Benefit berhasil ditambahkan', 'positive');
    emit('refreshData');

    // Reset form
    benefitForm.judul = '';
    benefitForm.subjudul = '';
    benefitForm.deskripsi = '';
    benefitForm.gambar = null;
    benefitForm.diperoleh_melalui = '';
    benefitForm.course_id = courseBenefitStore.courseId;
    v$.value.$reset();

  } catch (error) {
    useNotify('Gagal menambahkan Benefit', 'negative');
  } finally {
    loading.value = false;
  }
};
</script>
