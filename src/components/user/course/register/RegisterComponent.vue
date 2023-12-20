<template>
  <div class="q-pa-md">
    <q-ajax-bar ref="bar" color="pink-11" position="top" size="5px" skip-hijack />
    <div class="row">
      <div class="text-h5">Pendaftaran <span class="text-weight-bold"> {{ course.name }}</span></div>
    </div>
    <div class="row">
      <div class="col-md-7 col-sm-10 col-xs-12">
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input outlined type="text" v-model="registerCourseForm.name" lazy-rules label="Nama *"
            :error="v$.name.$error" :error-message="v$.name.$errors.map((e) => e.$message).join()" @input="v$.name.$touch"
            @blur="v$.name.$touch" />
          <q-input outlined type="number" v-model="registerCourseForm.phone" lazy-rules label="Nomor WA *"
            :error="v$.phone.$error" :error-message="v$.phone.$errors.map((e) => e.$message).join()"
            @input="v$.phone.$touch" hint="contoh: 081..." @blur="v$.phone.$touch" />
          <q-input outlined type="email" v-model="registerCourseForm.email" lazy-rules label="Email *"
            :error="v$.email.$error" :error-message="v$.email.$errors.map((e) => e.$message).join()"
            @input="v$.email.$touch" @blur="v$.email.$touch" />
          <q-input outlined type="text" v-model="registerCourseForm.price" lazy-rules label="Biaya *" disable>
            <template v-slot:prepend>
              <div class="text-subtitle2">Rp.</div>
            </template>
          </q-input>

          <q-select class="text-black" outlined v-model="registerCourseForm.bank" :options="options"
            label="Bank Transfer">
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section avatar>
                  <q-img :src="scope.opt.img" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ scope.opt.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-input outlined type="text" v-model="registerCourseForm.voucher_code" lazy-rules label="Kode Voucher *"
            :error="v$.voucher_code.$error" :error-message="v$.voucher_code.$errors.map((e) => e.$message).join()"
            @input="v$.voucher_code.$touch" @blur="v$.voucher_code.$touch" />
          <q-btn color="primary" type="submit" class="q-mt-lg">Bayar</q-btn>
        </q-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" async>
import { Courses, CreateRegisterForm } from 'src/models/course';
import { useCourseStore } from 'src/stores/course';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core'
import { useEmail, useRequired, useName, usePhoneNumber } from 'src/composables/validators';
import { useUserStore } from 'src/stores/user';
import { useMetaTitle } from 'src/composables/meta';
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar';
import { AxiosError } from 'axios';
import { useNotify } from 'src/composables/notifications';

useMetaTitle('Pendaftaran')
const { name: userName, email: userEmail, phone_number: userPhone } = useUserStore()
const bar = ref();
const router = useRouter();
const { $state: userState } = useUserStore()
const { localStorage: qLocalStorage } = useQuasar();
const course = ref<Courses>({
  name: '',
  description: '',
  facility: '',
  image: null,
  operational_end: '2023/02/02',
  operational_start: '2023/02/02',
  place: '',
  price: 0,
  time: '',
  id: 0
})

const registerCourseForm = ref<CreateRegisterForm>({
  bank: null,
  email: userEmail,
  name: userName,
  phone: userPhone,
  price: 0,
  voucher_code: ''
})

const { showCourse } = useCourseStore()

const { params: routeParams } = useRoute();


const options = [
  {
    label: 'Mandiri',
    value: 'Mandiri',
    img: '/src/assets/mandiri.png',
  },
  {
    label: 'BCA',
    value: 'BCA',
    img: '/src/assets/bca.png',
  },
  {
    label: 'BRI',
    value: 'BRI',
    img: '/src/assets/bri.png',
  },
]

const rules = {
  name: { required: useRequired(), validName: useName() },
  phone: { required: useRequired(), phone: usePhoneNumber() },
  email: { required: useRequired(), email: useEmail() },
  voucher_code: {},
}


const v$ = useVuelidate(rules, registerCourseForm.value)

const onSubmit = async () => {

  if (!v$.value.$invalid) {
    try {
      await api.post('registration', { user_id: userState.id, course_id: routeParams.id }, {
        headers: {
          Authorization: `Bearer ${qLocalStorage.getItem('token')}`
        }
      });
      router.push({ name: 'MyProfileIndexPage' });
    } catch (error) {
      if (error instanceof AxiosError) {

        if (error.response?.status == 422) {
          useNotify(error.response?.data.message, 'warning');
        } else {
          useNotify(error.message, 'red');
        }
      } else {
        useNotify('Terjadi masalah', 'red');
      }
    }

  } else {
    v$.value.$touch();
  }
}
onMounted(async () => {
  bar.value.start()
  const response = await showCourse(routeParams.id)
  course.value = response.data
  registerCourseForm.value.price = course.value.price;
  bar.value.stop();

})
</script>

<style scoped></style>
