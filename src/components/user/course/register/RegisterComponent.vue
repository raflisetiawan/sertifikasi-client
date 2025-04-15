<template>
  <div class="q-pa-md">
    <q-ajax-bar ref="bar" color="pink-11" position="top" size="5px" skip-hijack />

    <!-- Stepper -->
    <q-stepper v-model="step" ref="stepper" color="primary" animated>
      <!-- Step 1: Review Information -->
      <q-step :name="1" title="Review Information" icon="person" :done="step > 1">
        <div class="row q-mb-md">
          <div class="text-h5">
            Pendaftaran Kursus
            <q-skeleton type="text" v-if="loading" width="150px" />
            <span v-else class="text-weight-bold text-primary">{{ course.name }}</span>
          </div>
        </div>

        <q-form @submit="confirmSubmit" class="q-gutter-md">
          <div class="row q-col-gutter-md">
            <div class="col-md-6 col-sm-8 col-xs-12">
              <q-input outlined class="q-mr-sm" type="text" v-model="registerCourseForm.name" lazy-rules label="Nama *"
                :error="v$.name.$error" :error-message="v$.name.$errors.map((e) => e.$message).join()"
                @input="v$.name.$touch" @blur="v$.name.$touch" disable>
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
            </div>

            <div class="col-md-6 col-sm-8 col-xs-12">
              <q-input outlined type="number" class="q-mr-sm" v-model="registerCourseForm.phone" lazy-rules
                label="Nomor WA *" :error="v$.phone.$error"
                :error-message="v$.phone.$errors.map((e) => e.$message).join()" @input="v$.phone.$touch"
                @blur="v$.phone.$touch" disable>
                <template v-slot:prepend>
                  <q-icon name="phone" />
                </template>
              </q-input>
            </div>

            <div class="col-md-7 col-sm-10 col-xs-12">
              <q-input outlined type="email" v-model="registerCourseForm.email" lazy-rules label="Email *"
                :error="v$.email.$error" :error-message="v$.email.$errors.map((e) => e.$message).join()"
                @input="v$.email.$touch" @blur="v$.email.$touch" disable>
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>

              <q-input outlined type="text" v-model="registerCourseForm.priceRupiah" lazy-rules label="Biaya *" disable>
                <template v-slot:prepend>
                  <div class="text-subtitle2">Rp.</div>
                </template>
              </q-input>
            </div>
          </div>

          <div class="row justify-between q-mt-lg">
            <q-btn flat color="grey" label="Kembali" @click="$router.back()" />
            <q-btn color="primary" type="submit" :loading="loading">
              Lanjut ke Pembayaran
              <template v-slot:loading>
                <q-spinner-hourglass class="on-left" />
                Memproses...
              </template>
            </q-btn>
          </div>
        </q-form>
      </q-step>

      <!-- Step 2: Payment -->
      <q-step :name="2" title="Pembayaran" icon="payment">
        <div class="payment-container q-mt-md">
          <div class="text-h6 q-mb-md">
            <q-icon name="payment" class="q-mr-sm" />
            Pembayaran
          </div>

          <div v-if="!showPayment" class="text-center q-pa-md">
            <q-spinner size="3em" color="primary" />
            <div class="text-subtitle1 q-mt-md">Memuat form pembayaran...</div>
          </div>

          <div id="snap-container" class="q-pa-md"></div>
        </div>
      </q-step>
      <!-- Step 3: Success -->
      <q-step :name="3" title="Berhasil" icon="check_circle">
        <div class="column items-center q-pa-lg">
          <q-icon name="check_circle" color="positive" size="4em" />
          <div class="text-h5 q-mt-md text-positive">Pembayaran Berhasil!</div>
          <div class="text-subtitle1 q-mt-sm text-center">
            Terima kasih telah mendaftar kursus {{ course.name }}
          </div>
          <div class="text-subtitle2 q-mt-md text-grey-7">
            Detail pembayaran telah dikirim ke email Anda
          </div>
          <q-btn color="primary" label="Lihat Kelas" class="q-mt-lg"
            @click="router.push({ name: 'MyProfileDetailCoursePage', params: { id: route.params.id } })" />
        </div>
      </q-step>
    </q-stepper>

    <!-- Confirmation Dialog -->
    <q-dialog v-model="showConfirmDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="help" color="primary" text-color="white" />
          <span class="q-ml-sm">Konfirmasi Pendaftaran</span>
        </q-card-section>

        <q-card-section>
          Anda akan mendaftar kursus <strong>{{ course.name }}</strong> dengan biaya
          <strong>{{ registerCourseForm.priceRupiah }}</strong>. Lanjutkan?
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Batal" color="grey" v-close-popup />
          <q-btn flat label="Lanjutkan" color="primary" @click="onSubmit" :loading="loading" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script setup lang="ts" async>
import { CreateRegisterForm } from 'src/models/course';
import { useCourseStore } from 'src/stores/course';
import { onMounted, ref, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core'
import { useEmail, useRequired, useName, usePhoneNumber } from 'src/composables/validators';
import { useUserStore } from 'src/stores/user';
import { useMetaTitle } from 'src/composables/meta';
import { useNotify } from 'src/composables/notifications';
import toRupiah from '@develoka/angka-rupiah-js';
import { getMidtransErrorMessage } from 'src/models/midtrans';
import { useRegistrationStore } from 'src/stores/registration';
import type { PaymentResult, PaymentError } from 'src/models/payment';
interface SnapOptions {
  embedId: string;
  onSuccess: (result: PaymentResult) => void;
  onPending: () => void;
  onError: (error: PaymentError) => void;
  onClose: () => void;
}

interface Course {
  id: number;
  name: string;
  description: string;
  facility: string;
  image: string | null;
  operational_end: string;
  operational_start: string;
  place: string;
  price: number;
  time: string;
}

declare global {
  interface Window {
    snap: {
      embed: (token: string, options: SnapOptions) => void;
    };
  }
}

useMetaTitle('Pendaftaran')
const showConfirmDialog = ref(false)
const { name: userName, email: userEmail, phone_number: userPhone } = useUserStore()
const bar = ref();
const registrationStore = useRegistrationStore();
const courseStore = useCourseStore();
const route = useRoute();
const router = useRouter();
const step = ref(parseInt(route.query.step as string) || 1);
const loading = ref<boolean>(false);
const course = ref<Course>({
  id: 0,
  name: '',
  description: '',
  facility: '',
  image: null,
  operational_end: '2023/02/02',
  operational_start: '2023/02/02',
  place: '',
  price: 0,
  time: ''
});

const showPayment = ref(false);
const snapToken = ref('');

const registerCourseForm = ref<CreateRegisterForm>({
  bank: null,
  email: userEmail,
  name: userName,
  phone: userPhone,
  price: 0,
  priceRupiah: 0,
})

const { params: routeParams } = useRoute();

const rules = {
  name: { required: useRequired(), validName: useName() },
  phone: { required: useRequired(), phone: usePhoneNumber() },
  email: { required: useRequired(), email: useEmail() },
}


const v$ = useVuelidate(rules, registerCourseForm.value)
const confirmSubmit = () => {
  if (!v$.value.$invalid) {
    showConfirmDialog.value = true
  } else {
    v$.value.$touch()
  }
}

const onSubmit = async () => {
  try {
    loading.value = true;
    // Create registration
    const registration = await registrationStore.registerForCourse(
      Number(route.params.id)
    );


    // Create payment
    const priceWithoutCurrency = course.value.price.toString().replace(/[^\d]/g, '');
    const amount = parseInt(priceWithoutCurrency);
    const payment = await registrationStore.createPayment(
      registration.id,
      amount
    );

    // Handle payment
    handlePayment(payment.snap_token);
  } catch (error) {
    handleError(error);
  } finally {
    loading.value = false;
  }
};

const handlePayment = (token: string | null) => {
  if (!token) {
    useNotify('Token pembayaran tidak valid', 'negative');
    return;
  }

  showConfirmDialog.value = false;
  step.value = 2;

  const existingContainer = document.getElementById('snap-container');
  if (existingContainer) {
    existingContainer.innerHTML = '';
  }
  showPayment.value = true;
  snapToken.value = token;
  localStorage.setItem('paymentToken', token);

  setTimeout(() => {
    initializeSnapPayment(token);
  }, 500);
}

const handleError = (error: unknown) => {
  if (error instanceof Error) {
    useNotify(error.message, 'negative');
  } else {
    useNotify('Terjadi kesalahan', 'negative');
  }
};



const handlePaymentSuccess = async (result: PaymentResult) => {
  try {
    await registrationStore.updatePaymentStatus({
      order_id: result.order_id,
      status_code: result.status_code,
      transaction_id: result.transaction_id,
      transaction_status: result.transaction_status,
      transaction_time: result.transaction_time,
      payment_type: result.payment_type,
      gross_amount: result.gross_amount,
      fraud_status: result.fraud_status,
      status_message: result.status_message,  // Add this
      finish_redirect_url: result.finish_redirect_url  // Add this
    });

    useNotify('Pembayaran berhasil diverifikasi!', 'positive');
    step.value = 3;
    localStorage.removeItem('paymentToken');
  } catch (error) {
    useNotify('Gagal memperbarui status pembayaran', 'negative');
  }
};

const initializeSnapPayment = (token: string) => {
  try {
    if (window.snap && !document.querySelector('.snap-iframe')) {
      window.snap.embed(token, {
        embedId: 'snap-container',
        onSuccess: async (result: PaymentResult) => {
          useNotify('Pembayaran berhasil!', 'positive');
          showPayment.value = false;
          await handlePaymentSuccess(result);
          localStorage.removeItem('paymentToken');
        },
        onPending: () => {
          useNotify('Menunggu pembayaran', 'warning');
        },
        onError: (error: PaymentError) => {
          if (error.status_code === '300' && error.finish_redirect_url) {
            window.location.href = error.finish_redirect_url;
          }
          const errorMessage = getMidtransErrorMessage(error.status_code);
          useNotify(`Pembayaran gagal: ${errorMessage}`, 'negative');
          showPayment.value = false;
          localStorage.removeItem('paymentToken');
        },
        onClose: () => {
          showPayment.value = false;
          const container = document.getElementById('snap-container');
          if (container) {
            container.innerHTML = '';
          }
        }
      });
    } else {
      useNotify('Terjadi kesalahan saat memuat form pembayaran', 'negative');
      showPayment.value = false;
    }
  } catch (error) {
    console.error('Snap embed error:', error);
    useNotify('Gagal memuat form pembayaran', 'negative');
    showPayment.value = false;
  }
};

onMounted(async () => {
  try {
    bar.value.start()
    const response = await courseStore.showCourse(routeParams.id)
    course.value = { ...response.data, priceRupiah: toRupiah(response.data.price) }
    registerCourseForm.value.priceRupiah = toRupiah(course.value.price);
    const storedToken = localStorage.getItem('paymentToken');
    if (storedToken && step.value === 2) {
      showPayment.value = true;
      initializeSnapPayment(storedToken);
    } else if (storedToken && step.value === 1) {
      step.value = 2;
      showPayment.value = true;
      initializeSnapPayment(storedToken);
    }
  } catch (error) {

  } finally {
    bar.value.stop();
  }

})

onUnmounted(() => {
  showPayment.value = false;
  // Clean up snap container
  const container = document.getElementById('snap-container');
  if (container) {
    container.innerHTML = '';
  }
});

watch(step, (newStep) => {
  router.replace({
    query: {
      ...route.query,
      step: newStep.toString()
    }
  });
});
</script>

<style scoped>
.payment-container {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
}

#snap-container {
  width: 100%;
  min-height: 600px;
}

.q-stepper {
  background: transparent;
}
</style>
