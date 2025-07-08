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
            <div class="text-body1">Konsep Utama:</div>
            <q-select v-model="courseForm.key_concepts" label="Konsep Utama *" filled use-input use-chips multiple
              hide-dropdown-icon input-debounce="0" new-value-mode="add-unique" :error="v$.key_concepts.$error"
              :error-message="v$.key_concepts.$errors.map((e) => e.$message).join()" @blur="v$.key_concepts.$touch" />
            <q-input outlined type="text" autogrow v-model="courseForm.description" lazy-rules label="Deskripsi *"
              :error="v$.description.$error" :error-message="v$.description.$errors.map((e) => e.$message).join()"
              @input="v$.description.$touch" @blur="v$.description.$touch" />
            <q-select v-model="courseForm.facility" label="Fasilitas *" filled use-input use-chips multiple
              hide-dropdown-icon input-debounce="0" new-value-mode="add-unique" :error="v$.facility.$error"
              :error-message="v$.facility.$errors.map((e) => e.$message).join()" @blur="v$.facility.$touch" />
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
            <q-file :filter="checkFileSize10Mb" hint="ukuran max 10mb" outlined v-model="courseForm.certificate_example"
              accept=".pdf,.jpg,.png" counter use-chips label="Upload Certificate Example" @rejected="onRejected" />
            <q-file :filter="checkFileSize10Mb" hint="ukuran max 10mb" outlined v-model="courseForm.schedule"
              accept=".pdf" counter use-chips label="Upload Schedule" @rejected="onRejected" />
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
  key_concepts: [], // Change to array
  facility: [], // Change to array
  price: 0,
  image: null,
  operational_start: '2023/10/20',
  operational_end: '2023/10/25',
  place: '',
  duration: '',
  benefit: '',
  certificate_example: null,
  schedule: null,
  trainerSelect: [],
  trainer_ids: [],
  trainer_selected: []
});
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

const v$ = useVuelidate(rules, courseForm.value)
const onSubmit = async () => {
  if (!v$.value.$invalid) {
    try {
      loadingCreate.value = true;
      const trainerIds = courseForm.value.trainer_selected.map(trainer => trainer.value);
      const formData = {
        ...courseForm.value,
        key_concepts: courseForm.value.key_concepts,
        facility: courseForm.value.facility,
        trainer_ids: trainerIds
      };
      await storeCourse(formData);
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
  console.log(courseForm.value.trainer_selected);
  if (courseForm.value.trainerSelect.length === 0) {
    if ($state.trainers.length === 0) {
      await getTrainers();
      $state.trainers.forEach((trainer) => {
        if (trainer.id) { // Check if id exists
          courseForm.value.trainerSelect.push({
            label: trainer.name,
            value: trainer.id
          });
        }
      });
      update(() => { return });
    } else {
      $state.trainers.forEach((trainer) => {
        if (trainer.id) { // Check if id exists
          courseForm.value.trainerSelect.push({
            label: trainer.name,
            value: trainer.id
          });
        }
      });
      update(() => { return });
    }
  }
  update(() => { return });
};
const checkFileSize10Mb = (files: readonly unknown[] | FileList): readonly unknown[] => {
  const fileList = Array.from(files);
  return fileList.filter(file => (file instanceof File) && file.size < 10e+6);
};
</script>

<style scoped></style>
