<template>
  <div id="create-course-page">
    <div class="q-pa-md">
      <div class="text-h5 q-mb-md">Buat Kelas baru</div>
      <div class="row">
        <div class="col-md-7 col-sm-10 col-xs-12">
          <q-form @submit="onSubmit" class="q-gutter-md">
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
            <q-input filled v-model="courseForm.operational" mask="date" :rules="['date']">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="courseForm.operational">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
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

const courseForm = ref<CreateCourseForm>({
  name: '',
  description: '',
  facility: '',
  price: 0,
  image: '',
  operational: '2023/10/20',
  place: '',
  time: '',
})

const rules = {
  name: { required: useRequired(), validName: useName() },
  description: { required: useRequired() },
  facility: { required: useRequired() },
  price: { required: useRequired(), numeric: useNumeric(), decimal: useDecimal() },
  place: { required: useRequired() },
}
const v$ = useVuelidate(rules, courseForm.value)
const onSubmit = () => {
  if (!v$.value.$invalid) {

    console.log('ok');
  } else {
    v$.value.$touch();
  }

}
</script>

<style scoped></style>
