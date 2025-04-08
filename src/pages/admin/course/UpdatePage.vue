<template>
  <div id="create-course-page">
    <div class="q-pa-md">
      <div class="text-h5 q-mb-md">Edit Kelas</div>
      <div class="row">
        <div class="col-md-7 col-sm-10 col-xs-12">
          <q-form @submit="onSubmit" class="q-gutter-md" enctype="multipart/form-data">
            <q-input outlined type="text" v-model="courseForm.name" lazy-rules label="Nama kelas *"
              :error="v$.name.$error" :error-message="v$.name.$errors.map((e) => e.$message).join()"
              @input="v$.name.$touch" @blur="v$.name.$touch" />
            <div class="text-body1">Konsep Utama: </div>
            <q-editor v-model="courseForm.key_concepts" :dense="$q.screen.lt.md" :toolbar="[
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
            <!-- Add new file inputs -->
            <q-file :filter="checkFileSize10Mb" hint="ukuran max 10mb" outlined v-model="courseForm.syllabus"
              accept=".pdf" counter use-chips label="Upload Syllabus" @rejected="onRejected">
              <template v-slot:default>
                <q-btn v-if="syllabusUrl" :href="syllabusUrl" target="_blank" color="primary" size="sm" dense
                  class="q-mb-sm">
                  Lihat Syllabus
                </q-btn>
              </template>
            </q-file>
            <q-file :filter="checkFileSize" hint="ukuran max 2mb" outlined v-model="courseForm.image"
              accept=".jpg, image/*" counter use-chips label="Upload gambar" @rejected="onRejected">
              <template v-slot:default v-if="imageUrl.length !== 0 && !courseForm.image">
                <q-img :src="imageUrl" width="100px" class="q-mb-sm" />
              </template>
            </q-file>
            <q-file :filter="checkFileSize20Mb" hint="ukuran max 20mb" outlined v-model="courseForm.guidelines"
              accept=".pdf" counter use-chips label="Upload Pedoman / handbook" @rejected="onRejected">
              <template v-slot:default>
                <q-btn :href="guidelinesUrl" target="_blank" color="primary" size="sm" dense class="q-mb-sm">Lihat
                  dokumen</q-btn>
              </template>
            </q-file>
            <q-file :filter="checkFileSize10Mb" hint="ukuran max 10mb" outlined v-model="courseForm.certificate_example"
              accept=".pdf,.jpg,.png" counter use-chips label="Upload Certificate Example" @rejected="onRejected">
              <template v-slot:default>
                <q-btn v-if="certificateExampleUrl" :href="certificateExampleUrl" target="_blank" color="primary"
                  size="sm" dense class="q-mb-sm">
                  Lihat Certificate Example
                </q-btn>
              </template>
            </q-file>

            <q-file :filter="checkFileSize10Mb" hint="ukuran max 10mb" outlined v-model="courseForm.schedule"
              accept=".pdf" counter use-chips label="Upload Schedule" @rejected="onRejected">
              <template v-slot:default>
                <q-btn v-if="scheduleUrl" :href="scheduleUrl" target="_blank" color="primary" size="sm" dense
                  class="q-mb-sm">
                  Lihat Schedule
                </q-btn>
              </template>
            </q-file>
            <q-select filled v-model="courseForm.trainer_selected" use-chips multiple clearable use-input stack-label
              fill-input input-debounce="0" label="Trainer untuk kelas ini" :options="courseForm.trainerSelect"
              @filter="filterFnAutoselect">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-btn color="primary" type="submit" :loading="loadingCreate">Update</q-btn>
          </q-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { UpdateCourseForm } from 'src/models/course'
import useVuelidate from '@vuelidate/core';
import { useName, useRequired, useDecimal, useNumeric } from 'src/composables/validators';
import { QRejectedEntry, QSelect, useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import { useMetaTitle } from 'src/composables/meta';
import { useCourseStore } from 'src/stores/course';
import { useTrainerStore } from 'src/stores/trainer';
import { storageBaseUrl } from 'src/boot/axios';
import { Trainer } from 'src/models/trainer';

useMetaTitle('Edit Kelas - Admin')
const { push: routerPush } = useRouter();
const { notify } = useQuasar();
const { updateCourse, showCourse } = useCourseStore();
const { getTrainers, $state } = useTrainerStore();
const { params: routeParam } = useRoute();

const courseForm = reactive<UpdateCourseForm>({
  name: '',
  description: '',
  key_concepts: '',
  facility: '',
  price: 0,
  image: null,
  operational_start: '',
  operational_end: '',
  place: '',
  duration: '',
  benefit: '',
  guidelines: null,
  syllabus: null,
  certificate_example: null,
  schedule: null,
  trainerSelect: [],
  trainer_ids: [],
  trainer_selected: []
})

// Add refs for new file URLs
const syllabusUrl = ref('');
const certificateExampleUrl = ref('');
const scheduleUrl = ref('');

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

const v$ = useVuelidate(rules, courseForm)
const onSubmit = async () => {
  // Use $touch instead of touch
  v$.value.$touch();
  console.log(v$.value);
  console.log(courseForm);
  // Check validation state
  if (v$.value.$invalid) {
    notify({
      type: 'negative',
      message: 'Please check the form for errors'
    });
    return;
  }

  try {
    loadingCreate.value = true;
    const trainerIds = courseForm.trainer_selected.map(trainer => trainer.value);

    await updateCourse(routeParam.id, {
      ...courseForm,
      trainer_ids: trainerIds,
      _method: 'PATCH'
    });

    notify({
      type: 'positive',
      message: 'Course updated successfully'
    });

    routerPush({ name: 'AdminCoursePage' });
  } catch (error) {
    notify({
      type: 'negative',
      message: 'Error updating course'
    });
    throw error;
  } finally {
    loadingCreate.value = false;
  }
}
type DoneFunction = (callbackFn: () => void, afterFn?: ((ref: QSelect) => void) | undefined) => void;
const filterFnAutoselect = async (val: string, update: DoneFunction) => {
  if (courseForm.trainerSelect.length === 0) {
    if ($state.trainers.length === 0) {
      await getTrainers();
      $state.trainers.map((trainer) => {
        courseForm.trainerSelect.push({ label: trainer.name, value: trainer.id })
      })
      update(() => { return })
    } else {
      $state.trainers.map((trainer) => {
        courseForm.trainerSelect.push({ label: trainer.name, value: trainer.id })
      })
      update(() => { return })
    }
  }
  update(() => { return })
};

const imageUrl = ref('');
const guidelinesUrl = ref('');
const loading = ref(false);


onMounted(async () => {
  try {
    loading.value = true;
    await getTrainers();

    // Clear and populate trainerSelect
    courseForm.trainerSelect = $state.trainers
      .filter(trainer => trainer.id)
      .map(trainer => ({
        label: trainer.name,
        value: trainer.id
      }));

    const response = await showCourse(routeParam.id);
    const data = response.data;

    // Update form values
    Object.assign(courseForm, {
      name: data.name || '',
      description: data.description || '',
      key_concepts: data.key_concepts || '',
      facility: data.facility || '',
      price: Number(data.price) || 0,
      place: data.place || '',
      duration: data.duration || '',
      benefit: data.benefit || '',
      operational_start: data.operational_start || '',
      operational_end: data.operational_end || '',
      trainer_selected: data.trainers?.map((trainer: Trainer) => ({
        label: trainer.name,
        value: trainer.id
      })) || []
    });

    // Set file URLs
    imageUrl.value = data.image ? `${storageBaseUrl}courses/${data.image}` : '';
    guidelinesUrl.value = data.guidelines ? `${storageBaseUrl}courses/guideline/${data.guidelines}` : '';
    syllabusUrl.value = data.syllabus_path ? `${storageBaseUrl}courses/syllabus/${data.syllabus_path}` : '';
    certificateExampleUrl.value = data.certificate_example_path ? `${storageBaseUrl}courses/certificates/${data.certificate_example_path}` : '';
    scheduleUrl.value = data.schedule_path ? `${storageBaseUrl}courses/schedules/${data.schedule_path}` : '';

    // Reset validation state
    await v$.value.$reset();

  } catch (error) {
    notify({
      type: 'negative',
      message: 'Error loading course data'
    });
    throw error;
  } finally {
    loading.value = false;
  }
});
const checkFileSize10Mb = (files: readonly unknown[] | FileList): readonly unknown[] => {
  const fileList = Array.from(files);
  return fileList.filter(file => (file instanceof File) && file.size < 10e+6);
};

</script>

<style scoped></style>
