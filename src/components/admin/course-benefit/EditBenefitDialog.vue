<template>
  <q-dialog v-model="courseBenefitStore.editBenefitDialog" persistent>
    <q-card style="width: 700px; max-width: 80vw;">
      <q-card-section class="row items-center">
        <div class="text-h6">Edit Benefit</div>
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

          <div v-if="benefitForm.gambar" class="q-mb-md">
            <p class="text-caption">Contoh Gambar Sertifikat Saat Ini:</p>
            <q-img :src="benefitForm.gambar" width="200px" fit="cover" />
          </div>

          <!-- Image Input -->
          <q-file v-model="benefitForm.new_gambar" label="Upload Contoh Gambar Sertifikat" use-chips counter clearable
            accept=".jpg, .png, .jpeg, .jfif" :filter="checkFileSize" @rejected="onRejected">
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
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
import { ref, reactive, watch } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { useRequired } from 'src/composables/validators';
import { useNotify } from 'src/composables/notifications';
import { useCourseBenefitStore } from 'src/stores/course-benefit';
import { CourseBenefit } from 'src/models/course-benefit';
import { QRejectedEntry } from 'quasar';

interface BenefitForm {
  id: number;
  course_id: number;
  judul: string;
  subjudul: string;
  deskripsi: string;
  diperoleh_melalui: string;
  gambar: null;
  new_gambar: File | null;
}

const props = defineProps<{
  selectedBenefit: CourseBenefit | null;
}>();

const emit = defineEmits(['refreshData']);
const courseBenefitStore = useCourseBenefitStore();
const loading = ref(false);

// Watch for changes in selected benefit
watch(() => props.selectedBenefit, (newBenefit) => {
  if (newBenefit) {
    Object.assign(benefitForm, {
      ...newBenefit,
      new_gambar: null
    });
  }
}, { immediate: true });

const benefitForm = reactive<BenefitForm>({
  id: 0,
  course_id: courseBenefitStore.courseId,
  judul: '',
  subjudul: '',
  deskripsi: '',
  gambar: null,
  diperoleh_melalui: '',
  new_gambar: null,
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

    formData.append('_method', 'PUT');
    formData.append('course_id', courseBenefitStore.courseId.toString());
    formData.append('title', benefitForm.judul);
    formData.append('subtitle', benefitForm.subjudul);
    formData.append('description', benefitForm.deskripsi);
    formData.append('earn_by', benefitForm.diperoleh_melalui);

    if (benefitForm.new_gambar instanceof File) {
      formData.append('image', benefitForm.new_gambar);
    }

    await courseBenefitStore.updateBenefit(benefitForm.id, formData);

    useNotify('Benefit berhasil di update', 'positive');
    emit('refreshData');

    // Reset form
    benefitForm.judul = '';
    benefitForm.subjudul = '';
    benefitForm.deskripsi = '';
    benefitForm.diperoleh_melalui = '';
    benefitForm.course_id = courseBenefitStore.courseId;
    v$.value.$reset();

  } catch (error) {
    useNotify('Gagal menambahkan Benefit', 'negative');
  } finally {
    loading.value = false;
  }
};

const checkFileSize = (files: readonly unknown[] | FileList): readonly unknown[] => {
  const fileList = Array.from(files);
  return fileList.filter(file => (file instanceof File) && file.size < 2e+6);
};

const onRejected = (rejectedEntries: QRejectedEntry[]) => {
  useNotify(`${rejectedEntries.length} file tidak memenuhi persyaratan`, 'negative');
};

</script>
