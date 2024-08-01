<template>
  <div class="q-pa-md">
    <q-ajax-bar ref="bar" color="pink-11" position="top" size="5px" skip-hijack />
    <div class="row">
      <div class="text-h5">Pendaftaran <span class="text-weight-bold"> {{ course.name }}</span></div>
    </div>
    <q-form @submit="onSubmit" class="q-gutter-md">
      <div class="row">
        <div class="col-md-6 col-sm-8 col-xs-12">
          <q-input outlined class="q-mr-sm" type="text" v-model="registerCourseForm.name" lazy-rules label="Nama *"
            :error="v$.name.$error" :error-message="v$.name.$errors.map((e) => e.$message).join()"
            @input="v$.name.$touch" @blur="v$.name.$touch" disable />
        </div>
        <div class="col-md-6 col-sm-8 col-xs-12">
          <q-input outlined type="number" class="q-mr-sm" v-model="registerCourseForm.phone" lazy-rules
            label="Nomor WA *" :error="v$.phone.$error" :error-message="v$.phone.$errors.map((e) => e.$message).join()"
            @input="v$.phone.$touch" @blur="v$.phone.$touch" disable />
        </div>
        <div class="col-md-7 col-sm-10 col-xs-12">
          <q-input outlined type="email" v-model="registerCourseForm.email" lazy-rules label="Email *"
            :error="v$.email.$error" :error-message="v$.email.$errors.map((e) => e.$message).join()"
            @input="v$.email.$touch" @blur="v$.email.$touch" disable />
          <q-input outlined type="text" v-model="registerCourseForm.priceRupiah" lazy-rules label="Biaya *" disable>
            <template v-slot:prepend>
              <div class="text-subtitle2">Rp.</div>
            </template>
          </q-input>
          <q-file accept=".jpg, image/*" lazy-rules hint="file berupa gambar .jpg .jpeg .png" class="q-mt-md"
            label="Upload bukti pembayaran" outlined v-model="registerCourseForm.proofOfPayment"
            :error="v$.proofOfPayment.$error" :error-message="v$.proofOfPayment.$errors.map((e) => e.$message).join()"
            @input="v$.proofOfPayment.$touch" @blur="v$.proofOfPayment.$touch">
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4 col-sm-6 col-xs-10">
          <q-list dense bordered padding class="rounded-borders">
            <q-item-label header>Bank Transfer</q-item-label>
            <q-item clickable v-ripple>
              <q-item-section>
                <div class="text-body1"> Bank {{ bank.name }} </div>
              </q-item-section>

            </q-item>

            <q-item clickable v-ripple>
              <q-item-section>
                <div class="text-body1">Nomor Rekening : {{ bank.account }}</div>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section no-wrap>
                <div class="text-body1">Nama Pemilik Rekening : <div></div> {{ bank.account_owner }}</div>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <div class="col-md-8 col-sm-6 col-xs-10">
          <q-card :class="$q.screen.gt.sm ? 'my-card q-ml-md' : 'my-card q-mt-md'" flat bordered>
            <q-card-section>
              <div class="text-h6">Instruksi Transfer</div>
              <ol>
                <li>
                  <div class="text-body2">Silakan transfer jumlah biaya kelas ke rekening bank yang tertera di atas.
                  </div>
                </li>
                <li>
                  <div class="text-body2">Pastikan untuk menyertakan nomor pendaftaran Anda sebagai referensi
                    pembayaran.
                  </div>
                </li>
                <li>
                  <div class="text-body2">
                    Setelah melakukan transfer, konfirmasikan pembayaran dengan mengunggah bukti transfer.
                  </div>
                </li>
              </ol>
            </q-card-section>
          </q-card>

        </div>
      </div>
      <q-btn color="primary" type="submit" :loading="loading">Daftar</q-btn>
    </q-form>
    <q-dialog v-model="pendingApproval">
      <q-card>
        <q-card-section>
          <div class="text-h6">Pendaftaran Anda Berhasil!</div>
          <div class="text-body1 q-mb-sm">Terima kasih telah mendaftar kelas <span class="text-weight-bold"> {{
        course.name
      }}.</span>
          </div>
          <div class="text-body1 q-mb-sm">Pendaftaran Anda berhasil, namun saat ini sedang menunggu verifikasi dari
            admin.
          </div>
          <div class="text-body1 q-mb-sm">Kami akan segera memberitahu Anda melalui email setelah pendaftaran Anda
            diverifikasi.
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Lihat Detail Kelas" @click="$router.push({ name: 'MyProfileIndexPage' })" color="primary"
            v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script setup lang="ts" async>
import { Courses, CreateRegisterForm } from 'src/models/course';
import { useCourseStore } from 'src/stores/course';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useVuelidate } from '@vuelidate/core'
import { useEmail, useRequired, useName, usePhoneNumber } from 'src/composables/validators';
import { useUserStore } from 'src/stores/user';
import { useMetaTitle } from 'src/composables/meta';
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar';
import { AxiosError } from 'axios';
import { useNotify } from 'src/composables/notifications';
import toRupiah from '@develoka/angka-rupiah-js';

useMetaTitle('Pendaftaran')
const { name: userName, email: userEmail, phone_number: userPhone } = useUserStore()
const bar = ref();
const { $state: userState } = useUserStore()
const { cookies: qCookies } = useQuasar();
const pendingApproval = ref<boolean>(false);
const loading = ref<boolean>(false);
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
  priceRupiah: 0,
  proofOfPayment: null
})

const bank = {
  name: 'Mandiri',
  account: '123456789',
  account_owner: 'rafli'
}

const { showCourse } = useCourseStore()

const { params: routeParams } = useRoute();

const rules = {
  name: { required: useRequired(), validName: useName() },
  phone: { required: useRequired(), phone: usePhoneNumber() },
  email: { required: useRequired(), email: useEmail() },
  proofOfPayment: { required: useRequired() }
}


const v$ = useVuelidate(rules, registerCourseForm.value)

const onSubmit = async () => {
  if (!v$.value.$invalid) {
    try {
      loading.value = true;
      const registrationResponse = await api.post('registration', { user_id: userState.id, course_id: routeParams.id, payment_proof: registerCourseForm.value.proofOfPayment }, {
        headers: {
          Authorization: `Bearer ${qCookies.get('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      const priceWithoutCurrency = course.value.price.toString().replace(/[^\d]/g, '');
      const amount = parseInt(priceWithoutCurrency);
      const paymentResponse = await api.post('payments/create', {
        user_id: userState.id,
        course_id: routeParams.id,
        amount: amount,
        registration_id: registrationResponse.data.registration_id
      }, {
        headers: {
          Authorization: `Bearer ${qCookies.get('token')}`
        }
      });
      console.log(paymentResponse)
      pendingApproval.value = true;
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        if (error.response?.status == 422) {
          useNotify(error.response?.data.message, 'negative');
        } else {
          useNotify(error.message, 'red');
        }
      } else {
        useNotify('Terjadi masalah', 'red');
      }
    } finally {
      loading.value = false;
    }

  } else {
    v$.value.$touch();
  }
}
onMounted(async () => {
  try {
    bar.value.start()
    const response = await showCourse(routeParams.id)
    course.value = { ...response.data, priceRupiah: toRupiah(response.data.price) }
    registerCourseForm.value.priceRupiah = toRupiah(course.value.price);

  } catch (error) {

  } finally {
    bar.value.stop();
  }

})
</script>

<style scoped></style>
