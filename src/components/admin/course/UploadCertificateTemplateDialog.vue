<template>
  <div>
    <q-dialog v-model="courseState.showUploadCertificateTemplateDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Upload Template Sertifikat</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-file v-model="file" label="Pilih File PDF" filled style="max-width: 300px;" use-chips counter clearable
            accept=".pdf" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="primary" label="Upload" @click="uploadCertificate" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { api } from 'src/boot/axios';
import { qCookies } from 'src/boot/cookies';
import { useCourseStore } from 'src/stores/course';
import { ref } from 'vue';

const file = ref();
const { $state: courseState } = useCourseStore()
const emit = defineEmits(['getCourses']);

const uploadCertificate = async () => {
  try {
    await api.post(
      `course/${courseState.uploadedCerticiateTemplateDialogId}/upload-certificate`,
      {
        certificate_template: file.value
      },
      {
        headers: {
          Authorization: 'Bearer ' + qCookies.get('token'),
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    courseState.showUploadCertificateTemplateDialog = false;
    emit('getCourses');
  } catch (error) {

  }
}
</script>

<style scoped></style>
