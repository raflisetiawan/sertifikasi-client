<template>
  <div id="create-course-page">
    <div class="q-pa-md">
      <div class="text-h5 q-mb-md">Edit Kelas</div>
      <div class="row">
        <div class="col-md-7 col-sm-10 col-xs-12">
          <q-form @submit="onSubmit" class="q-gutter-md" enctype="multipart/form-data">
            <q-input outlined type="text" v-model="courseForm.name" lazy-rules label="Nama kelas *"
              :error="v$.name.$error || !!serverErrors.name"
              :error-message="v$.name.$errors.map((e) => e.$message).join() || (serverErrors.name ? serverErrors.name[0] : '')"
              @input="v$.name.$touch" @blur="v$.name.$touch" />
            <q-input outlined type="text" autogrow v-model="courseForm.description" lazy-rules label="Deskripsi *"
              :error="v$.description.$error || !!serverErrors.description"
              :error-message="v$.description.$errors.map((e) => e.$message).join() || (serverErrors.description ? serverErrors.description[0] : '')"
              @input="v$.description.$touch" @blur="v$.description.$touch" />
            <div class="text-body1 q-mb-sm">Konsep Utama:</div>
            <q-select v-model="courseForm.key_concepts" label="Konsep Utama *" filled use-input use-chips multiple
              hide-dropdown-icon input-debounce="0" new-value-mode="add-unique"
              :error="v$.key_concepts.$error || !!serverErrors.key_concepts"
              :error-message="v$.key_concepts.$errors.map((e) => e.$message).join() || (serverErrors.key_concepts ? serverErrors.key_concepts[0] : '')"
              @blur="v$.key_concepts.$touch" />
            <div class="text-body1 q-mb-sm">Fasilitas:</div>
            <q-select v-model="courseForm.facility" label="Fasilitas *" filled use-input use-chips multiple
              hide-dropdown-icon input-debounce="0" new-value-mode="add-unique"
              :error="v$.facility.$error || !!serverErrors.facility"
              :error-message="v$.facility.$errors.map((e) => e.$message).join() || (serverErrors.facility ? serverErrors.facility[0] : '')"
              @blur="v$.facility.$touch" />
            <q-input outlined type="text" autogrow v-model="courseForm.benefit" lazy-rules label="Benefit *"
              :error="v$.benefit.$error || !!serverErrors.benefit"
              :error-message="v$.benefit.$errors.map((e) => e.$message).join() || (serverErrors.benefit ? serverErrors.benefit[0] : '')"
              @input="v$.benefit.$touch" @blur="v$.benefit.$touch" />
            <q-input outlined type="number" autogrow v-model="courseForm.price" lazy-rules label="Harga *"
              :error="v$.price.$error || !!serverErrors.price"
              :error-message="v$.price.$errors.map((e) => e.$message).join() || (serverErrors.price ? serverErrors.price[0] : '')"
              @input="v$.price.$touch" @blur="v$.price.$touch" hint="Contoh: 1000 / 10.000">
              <template v-slot:prepend>
                <div class="text-body1">Rp.</div>
              </template>
            </q-input>

            <q-input outlined type="text" autogrow v-model="courseForm.place" lazy-rules label="Tempat *"
              :error="v$.place.$error || !!serverErrors.place"
              :error-message="v$.place.$errors.map((e) => e.$message).join() || (serverErrors.place ? serverErrors.place[0] : '')"
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
              :error="v$.duration.$error || !!serverErrors.duration"
              :error-message="v$.duration.$errors.map((e) => e.$message).join() || (serverErrors.duration ? serverErrors.duration[0] : '')"
              @input="v$.duration.$touch" @blur="v$.duration.$touch" />
            <q-file :filter="checkFileSize" hint="ukuran max 2mb" outlined v-model="courseForm.image"
              accept=".jpg, image/*" counter use-chips label="Upload gambar" @rejected="onRejected">
              <template v-slot:default v-if="imageUrl.length !== 0 && !courseForm.image">
                <q-img :src="imageUrl" width="100px" class="q-mb-sm" />
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
import { AxiosError } from 'axios';

useMetaTitle('Edit Kelas - Admin')
const { push: routerPush } = useRouter();
const { notify } = useQuasar();
const { updateCourse, showCourse } = useCourseStore();
const { getTrainers, $state } = useTrainerStore();
const { params: routeParam } = useRoute();
const serverErrors = ref<Record<string, string[]>>({});

const courseForm = reactive<UpdateCourseForm>({
  name: '',
  description: '',
  key_concepts: [], // Change to array
  facility: [], // Change to array
  price: 0,
  image: null,
  operational_start: '',
  operational_end: '',
  place: '',
  duration: '',
  benefit: '',
  certificate_example: null,
  schedule: null,
  trainerSelect: [],
  trainer_ids: [],
  trainer_selected: []
});

// Add refs for new file URLs
const certificateExampleUrl = ref('');
const scheduleUrl = ref('');

const rules = {
  name: { required: useRequired(), validName: useName() },
  description: { required: useRequired() },
  key_concepts: {
    required: useRequired(),
    minLength: (value: string[]) => value.length > 0
  },
  facility: {
    required: useRequired(),
    minLength: (value: string[]) => value.length > 0
  },
  price: { required: useRequired(), numeric: useNumeric(), decimal: useDecimal() },
  place: { required: useRequired() },
  duration: { required: useRequired() },
  benefit: { required: useRequired() },
};

const checkFileSize = (files: readonly unknown[] | FileList): readonly unknown[] => {
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

const v$ = useVuelidate(rules, courseForm)
const onSubmit = async () => {
  serverErrors.value = {};
  v$.value.$touch();
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
    const formData = {
      ...courseForm,
      key_concepts: courseForm.key_concepts, // Remove JSON.stringify
      facility: courseForm.facility, // Remove JSON.stringify
      trainer_ids: trainerIds,
      _method: 'POST'
    };

    await updateCourse(routeParam.id, formData);

    notify({
      type: 'positive',
      message: 'Course updated successfully'
    });

    routerPush({ name: 'AdminCoursePage' });
  } catch (error) {
    if (error instanceof AxiosError && error.response && error.response.data) {
      serverErrors.value = error.response.data.errors;
      notify({
        type: 'negative',
        message: error.response.data.message || 'Terjadi kesalahan saat memperbarui kelas.'
      });
    } else {
      console.error(error);
      notify({
        type: 'negative',
        message: 'Terjadi kesalahan yang tidak diketahui.'
      });
    }
  } finally {
    loadingCreate.value = false;
  }
};
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
const loading = ref(false);


onMounted(async () => {
  try {
    loading.value = true;
    await getTrainers();

    courseForm.trainerSelect = $state.trainers
      .filter(trainer => trainer.id)
      .map(trainer => ({
        label: trainer.name,
        value: trainer.id
      }));

    const response = await showCourse(routeParam.id);
    const data = response.data;

    // Parse arrays from JSON strings if needed
    const keyConcepts = Array.isArray(data.key_concepts)
      ? data.key_concepts
      : (typeof data.key_concepts === 'string'
        ? JSON.parse(data.key_concepts)
        : []);

    const facilities = Array.isArray(data.facility)
      ? data.facility
      : (typeof data.facility === 'string'
        ? JSON.parse(data.facility)
        : []);

    // Update form values
    Object.assign(courseForm, {
      name: data.name || '',
      description: data.description || '',
      key_concepts: keyConcepts,
      facility: facilities,
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
    certificateExampleUrl.value = data.certificate_example_path ?
      `${storageBaseUrl}courses/certificates/${data.certificate_example_path}` : '';
    scheduleUrl.value = data.schedule_path ? `${storageBaseUrl}courses/schedules/${data.schedule_path}` : '';

    await v$.value.$reset();
  } catch (error) {
    notify({
      type: 'negative',
      message: 'Error loading course data'
    });
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
