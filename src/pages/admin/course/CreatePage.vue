<template>
  <div id="create-course-page">
    <div class="q-pa-md">
      <div class="text-h5 q-mb-md">Buat Kelas baru</div>
      <div class="row">
        <div class="col-md-7 col-sm-10 col-xs-12">
          <q-form @submit="onSubmit" class="q-gutter-md" enctype="multipart/form-data">
            <q-input outlined type="text" v-model="courseForm.name" lazy-rules label="Nama kelas *"
              :error="v$.name.$error" :error-message="v$.name.$errors.map((e) => e.$message).join()"
              @input="v$.name.$touch" @blur="v$.name.$touch" />
            <q-input outlined type="text" autogrow v-model="courseForm.description" lazy-rules label="Deskripsi *"
              :error="v$.description.$error" :error-message="v$.description.$errors.map((e) => e.$message).join()"
              @input="v$.description.$touch" @blur="v$.description.$touch" />
            <q-input outlined type="text" autogrow v-model="courseForm.facility" lazy-rules label="Fasilitas *"
              :error="v$.facility.$error" :error-message="v$.facility.$errors.map((e) => e.$message).join()"
              @input="v$.facility.$touch" @blur="v$.facility.$touch" />
            <q-input outlined type="number" autogrow v-model="courseForm.price" lazy-rules label="Harga *"
              :error="v$.price.$error" :error-message="v$.price.$errors.map((e) => e.$message).join()"
              @input="v$.price.$touch" @blur="v$.price.$touch" hint="Contoh: 1000 / 10.000">
              <template v-slot:prepend>
                <div class="text-body1">Rp.</div>
              </template>
            </q-input>

            <q-input outlined type="text" autogrow v-model="courseForm.place" lazy-rules label="Tempat *"
              :error="v$.place.$error" :error-message="v$.place.$errors.map((e) => e.$message).join()"
              @input="v$.place.$touch" @blur="v$.place.$touch" />
            <div class="text-body1">Operational / waktu</div>
            <q-input filled v-model="courseForm.operational_start">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="courseForm.operational_start" mask="YYYY-MM-DD HH:mm">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-time v-model="courseForm.operational_start" mask="YYYY-MM-DD HH:mm" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input filled v-model="courseForm.operational_end">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="courseForm.operational_end" mask="YYYY-MM-DD HH:mm">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-time v-model="courseForm.operational_end" mask="YYYY-MM-DD HH:mm" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input outlined type="text" v-model="courseForm.time" lazy-rules label="Durasi *" :error="v$.time.$error"
              :error-message="v$.time.$errors.map((e) => e.$message).join()" @input="v$.time.$touch"
              @blur="v$.time.$touch" />
            <q-file :filter="checkFileSize" hint="ukuran max 2mb" outlined v-model="courseForm.image"
              accept=".jpg, image/*" counter use-chips label="Upload gambar" @rejected="onRejected" />
            <q-btn color="primary" type="submit" :loading="loadingCreate">Create</q-btn>
          </q-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { CreateCourseForm } from 'src/models/course'
import useVuelidate from '@vuelidate/core';
import { useName, useRequired, useDecimal, useNumeric } from 'src/composables/validators';
import { QRejectedEntry, useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useMetaTitle } from 'src/composables/meta';
import { useCourseStore } from 'src/stores/course';

useMetaTitle('Buat Kelas - Admin')
const { push: routerPush } = useRouter();
const { notify } = useQuasar();
const { storeCourse } = useCourseStore();

const courseForm = ref<CreateCourseForm>({
  name: '',
  description: '',
  facility: '',
  price: 0,
  image: null,
  operational_start: '2023/10/20 12:44',
  operational_end: '2023/1025 12:44',
  place: '',
  time: '',
})

const rules = {
  name: { required: useRequired(), validName: useName() },
  description: { required: useRequired() },
  facility: { required: useRequired() },
  price: { required: useRequired(), numeric: useNumeric(), decimal: useDecimal() },
  place: { required: useRequired() },
  time: { required: useRequired() },
}
const checkFileSize = (files: readonly any[] | FileList): readonly any[] => {
  const fileList = Array.from(files);
  return fileList.filter(file => (file instanceof File) && file.size < 2e+6);
};
const loadingCreate = ref(false);

const onRejected = (rejectedEntries: QRejectedEntry[]) => {
  notify({
    type: 'negative',
    message: `${rejectedEntries.length} file(s) did not pass validation constraints`
  })
}

const v$ = useVuelidate(rules, courseForm.value)
const onSubmit = async () => {
  if (!v$.value.$invalid) {
    try {
      loadingCreate.value = true;
      await storeCourse(courseForm.value)
      routerPush({ name: 'AdminCoursePage' })
    } catch (error) {
      throw error;
    } finally {
      loadingCreate.value = false;
    }
  } else {
    v$.value.$touch();
  }
}
</script>

<style scoped></style>
