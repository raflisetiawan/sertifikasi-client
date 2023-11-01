<template>
  <div id="update-course-page">
    <q-ajax-bar ref="bar" color="pink-11" position="top" size="5px" skip-hijack />
    <div class="q-pa-md">
      <div class="text-h5 q-mb-md">Edit Kelas</div>
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
            <div class="row">
              <div class="col-6 ">
                <q-file @update:model-value="changeImagePreview" class="q-mr-md" :filter="checkFileSize"
                  hint="ukuran max 2mb" outlined v-model="courseForm.image" accept=".jpg, image/*" counter use-chips
                  label="Upload gambar" @rejected="onRejected" />
              </div>
              <div class="col-6">
                <q-img :src="imageUrl" spinner-color="white"
                  style="height: 140px; max-width: 150px; border: 1px solid #C2C2C2;" />
              </div>
            </div>
            <q-btn color="primary" type="submit" :loading="loadingCreate">Update</q-btn>
          </q-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { UpdateCourseForm } from 'src/models/course'
import useVuelidate from '@vuelidate/core';
import { useName, useRequired, useDecimal, useNumeric } from 'src/composables/validators';
import { QRejectedEntry, useQuasar } from 'quasar';
import { storageBaseUrl } from 'src/boot/axios';
import { useRouter, useRoute } from 'vue-router';
import { useMetaTitle } from 'src/composables/meta';
import { useCourseStore } from 'src/stores/course';

useMetaTitle('Edit Kelas - Admin')
const { push: routerPush } = useRouter();
const { params: routeParams } = useRoute();
const { notify } = useQuasar();
const imageUrl = ref();
const bar = ref();
const { showCourse, updateCourse } = useCourseStore()

const courseForm = ref<UpdateCourseForm>({
  name: '',
  description: '',
  facility: '',
  price: 0,
  image: null,
  operational_start: '2023/10/20 12:44',
  operational_end: '2023/10/25 12:44',
  place: '',
  time: '',
  _method: 'PATCH'
})

onMounted(async () => {
  try {
    bar.value.start();
    await getCourse()
  } catch (error) {
    throw error;
  } finally {
    bar.value.stop();
  }

})

const getCourse = async () => {
  const response = await showCourse(routeParams.id);
  const course = response.data;
  courseForm.value.name = course.name
  courseForm.value.description = course.description
  courseForm.value.facility = course.facility
  courseForm.value.operational_start = course.operational_start
  courseForm.value.operational_end = course.operational_end
  courseForm.value.place = course.place
  courseForm.value.price = course.price
  courseForm.value.time = course.time
  imageUrl.value = storageBaseUrl + 'courses/' + course.image;
}

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
      await updateCourse(routeParams.id, courseForm.value)
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


const changeImagePreview = (value: File) => {
  if (value) {
    const reader = new FileReader();

    reader.onload = (event: any) => {
      // Set the image URL to the preview
      imageUrl.value = event.target.result;
    };

    // Read the selected file as a data URL (which can be used as an image source)
    reader.readAsDataURL(value);
  }
}
</script>

<style scoped></style>
