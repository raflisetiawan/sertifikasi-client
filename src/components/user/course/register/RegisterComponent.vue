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
                  <div class="text-subtitle2">
                    <template v-if="Number(course.price) === 0">Gratis</template>
                    <template v-else>Rp.</template>
                  </div>
                </template>
              </q-input>
            </div>
          </div>

          <div class="row justify-between q-mt-lg">
            <q-btn flat color="grey" label="Kembali" @click="$router.back()" />
            <q-btn color="primary" type="submit" :loading="loading">
              <span v-if="course.price > 0">Lanjut ke Pembayaran</span>
              <span v-else>Daftar Sekarang</span>
              <template v-slot:loading>
                <q-spinner-hourglass class="on-left" />
                Memproses...
              </template>
            </q-btn>
          </div>
        </q-form>
      </q-step>

      <!-- Step 2: Payment -->
      <q-step v-if="course.price > 0" :name="2" title="Pembayaran" icon="payment">
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
          <div class="text-h5 q-mt-md text-positive">Pendaftaran Berhasil!</div>
          <div class="text-subtitle1 q-mt-sm text-center">
            Terima kasih telah mendaftar kursus {{ course.name }}
          </div>
          <div class="text-subtitle2 q-mt-md text-grey-7">
            Anda sekarang dapat mengakses materi kursus.
          </div>
          <q-btn color="primary" label="Lihat Kelas" class="q-mt-lg"
            @click="router.push({ name: 'dashboard.courses.show', params: { id: route.params.id } })" />
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
          Anda akan mendaftar kursus <strong>{{ course.name }}</strong>.
          <span v-if="course.price > 0">
            Dengan biaya <strong>{{ registerCourseForm.priceRupiah }}</strong>.
          </span>
          <span v-else>
            Kursus ini <strong>Gratis</strong>.
          </span>
          Lanjutkan?
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
import { useFormatters } from 'src/composables/useFormatters';
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
const { formatPrice } = useFormatters();

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
  priceRupiah: '0', // ubah tipe di model jika perlu
})

const { params: routeParams } = useRoute();

const rules = {
  name: { required: useRequired(), validName: useName() },
  phone: { phone: usePhoneNumber() },
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
  loading.value = true;
  showConfirmDialog.value = false;

  try {
    // If course is free
    if (course.value.price === 0) {
      const response = await registrationStore.registerForCourse(Number(route.params.id));
      // Untuk kursus gratis, backend bisa mengembalikan enrollment langsung, atau hanya registration dengan status 'active'
      if ((response as any).enrollment || (response.registration && response.registration.status === 'active')) {
        useNotify('Pendaftaran berhasil! Anda sekarang terdaftar di kursus ini.', 'positive');
        step.value = 3; // Go to success step
      } else {
        // This case should ideally not happen for free courses based on backend logic
        handleError(new Error('Gagal mendapatkan data enrollment untuk kursus gratis.'));
      }
      return;
    }

    // --- Paid Course Logic (existing logic) ---
    // Create registration
    const registrationData = await registrationStore.registerForCourse(Number(route.params.id));
    const registrationId = registrationData.registration.id;


    // Create payment
    const amount = course.value.price; // Use the original price directly
    const payment = await registrationStore.createPayment(
      registrationId,
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

    // Ensure price is correctly handled as a number
    const courseData = response.data;
    courseData.price = Number(courseData.price);
    course.value = { ...courseData };

    registerCourseForm.value.priceRupiah = formatPrice(course.value.price);

    const storedToken = localStorage.getItem('paymentToken');
    // Only attempt to resume payment if the course is not free
    if (course.value.price > 0 && storedToken) {
      if (step.value === 2) {
        showPayment.value = true;
        initializeSnapPayment(storedToken);
      } else if (step.value === 1) {
        step.value = 2;
        showPayment.value = true;
        initializeSnapPayment(storedToken);
      }
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
