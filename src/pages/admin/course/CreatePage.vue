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
            <div class="text-body1">Deskripsi:</div>
            <q-editor v-model="courseForm.description" :dense="$q.screen.lt.md" :toolbar="[
              [
                {
                  label: $q.lang.editor.align,
                  icon: $q.iconSet.editor.align,
                  fixedLabel: true,
                  list: 'only-icons',
                  options: ['left', 'center', 'right', 'justify']
                },
                {
                  label: $q.lang.editor.align,
                  icon: $q.iconSet.editor.align,
                  fixedLabel: true,
                  options: ['left', 'center', 'right', 'justify']
                }
              ],
              ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
              ['token', 'hr', 'link', 'custom_btn'],
              ['print', 'fullscreen'],
              [
                {
                  label: $q.lang.editor.formatting,
                  icon: $q.iconSet.editor.formatting,
                  list: 'no-icons',
                  options: [
                    'p',
                    'h1',
                    'h2',
                    'h3',
                    'h4',
                    'h5',
                    'h6',
                    'code'
                  ]
                },
                {
                  label: $q.lang.editor.fontSize,
                  icon: $q.iconSet.editor.fontSize,
                  fixedLabel: true,
                  fixedIcon: true,
                  list: 'no-icons',
                  options: [
                    'size-1',
                    'size-2',
                    'size-3',
                    'size-4',
                    'size-5',
                    'size-6',
                    'size-7'
                  ]
                },
                {
                  label: $q.lang.editor.defaultFont,
                  icon: $q.iconSet.editor.font,
                  fixedIcon: true,
                  list: 'no-icons',
                  options: [
                    'default_font',
                    'arial',
                    'arial_black',
                    'comic_sans',
                    'courier_new',
                    'impact',
                    'lucida_grande',
                    'times_new_roman',
                    'verdana'
                  ]
                },
                'removeFormat'
              ],
              ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

              ['undo', 'redo'],
              ['viewsource']
            ]" :fonts="{
  arial: 'Arial',
  arial_black: 'Arial Black',
  comic_sans: 'Comic Sans MS',
  courier_new: 'Courier New',
  impact: 'Impact',
  lucida_grande: 'Lucida Grande',
  times_new_roman: 'Times New Roman',
  verdana: 'Verdana'
}">
            </q-editor>
            <q-input outlined type="text" autogrow v-model="courseForm.facility" lazy-rules label="Fasilitas *"
              :error="v$.facility.$error" :error-message="v$.facility.$errors.map((e) => e.$message).join()"
              @input="v$.facility.$touch" @blur="v$.facility.$touch" />
            <q-input outlined type="text" autogrow v-model="courseForm.benefit" lazy-rules label="Benefit *"
              :error="v$.benefit.$error" :error-message="v$.benefit.$errors.map((e) => e.$message).join()"
              @input="v$.benefit.$touch" @blur="v$.benefit.$touch" />
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
                    <q-date v-model="courseForm.operational_start" mask="YYYY-MM-DD">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input filled v-model="courseForm.operational_end">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="courseForm.operational_end" mask="YYYY-MM-DD">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input outlined type="text" v-model="courseForm.duration" lazy-rules label="Durasi *"
              :error="v$.duration.$error" :error-message="v$.duration.$errors.map((e) => e.$message).join()"
              @input="v$.duration.$touch" @blur="v$.duration.$touch" />
            <q-file :filter="checkFileSize" hint="ukuran max 2mb" outlined v-model="courseForm.image"
              accept=".jpg, image/*" counter use-chips label="Upload gambar" @rejected="onRejected" />
            <q-file :filter="checkFileSize20Mb" hint="ukuran max 20mb" outlined v-model="courseForm.guidelines"
              accept=".pdf" counter use-chips label="Upload Pedoman / handbook" @rejected="onRejected" />
            <q-select filled v-model="courseForm.trainer_selected" clearable use-input hide-selected fill-input
              input-debounce="0" label="Trainer untuk kelas ini" :options="courseForm.trainerSelect"
              @filter="filterFnAutoselect">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
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
import { QRejectedEntry, QSelect, useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useMetaTitle } from 'src/composables/meta';
import { useCourseStore } from 'src/stores/course';
import { useTrainerStore } from 'src/stores/trainer';

useMetaTitle('Buat Kelas - Admin')
const { push: routerPush } = useRouter();
const { notify } = useQuasar();
const { storeCourse } = useCourseStore();
const { getTrainers, $state } = useTrainerStore();

const courseForm = ref<CreateCourseForm>({
  name: '',
  description: '',
  facility: '',
  price: 0,
  image: null,
  operational_start: '2023/10/20',
  operational_end: '2023/1025',
  place: '',
  duration: '',
  benefit: '',
  guidelines: null,
  trainerSelect: [],
  trainer_id: 0,
  trainer_selected: {
    label: '',
    value: 0
  }
})

const rules = {
  name: { required: useRequired(), validName: useName() },
  description: { required: useRequired() },
  facility: { required: useRequired() },
  price: { required: useRequired(), numeric: useNumeric(), decimal: useDecimal() },
  place: { required: useRequired() },
  duration: { required: useRequired() },
  benefit: { required: useRequired() },
}
const checkFileSize = (files: readonly unknown[] | FileList): readonly unknown[] => {
  const fileList = Array.from(files);
  return fileList.filter(file => (file instanceof File) && file.size < 2e+6);
};

const checkFileSize20Mb = (files: readonly unknown[] | FileList): readonly unknown[] => {
  const fileList = Array.from(files);
  return fileList.filter(file => (file instanceof File) && file.size < 20e+6);
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
      if (courseForm.value.trainer_selected.value !== undefined) {
        await storeCourse({ ...courseForm.value, trainer_id: courseForm.value.trainer_selected.value })
      }
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
type DoneFunction = (callbackFn: () => void, afterFn?: ((ref: QSelect) => void) | undefined) => void;
const filterFnAutoselect = async (val: string, update: DoneFunction) => {
  if (courseForm.value.trainerSelect.length === 0) {
    if ($state.trainers.length === 0) {
      await getTrainers();
      $state.trainers.map((trainer) => {
        courseForm.value.trainerSelect.push({ label: trainer.name, value: trainer.id })
      })
      update(() => { return })
    } else {
      $state.trainers.map((trainer) => {
        courseForm.value.trainerSelect.push({ label: trainer.name, value: trainer.id })
      })
      update(() => { return })
    }
  }
  update(() => { return })
};


</script>

<style scoped></style>
