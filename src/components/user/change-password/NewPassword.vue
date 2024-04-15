<template>
  <div>
    <div class="text-body1">Kami sudah mengirim kode verifikasi ke email anda</div>
    <q-form @submit="onSubmit">
      <q-input type="number" outlined v-model.number="newPasswordForm.code" label="Kode Verifikasi *" lazy-rules
        :error="v$.code.$error" :error-message="v$.code.$errors.map((e) => e.$message).join()" @input="v$.code.$touch"
        @blur="v$.code.$touch" />
      <div class="row items-center q-mb-sm">
        <div class="text-body2 q-mr-md">Tidak menerima kode verifikasi dari email?
        </div>
        <q-btn class="float-right" color="primary" flat dense label="Kirim ulang kode verifikasi"
          @click="retrySendVerificationCode" :loading="retryCodeVerificationLoading"></q-btn>
      </div>

      <q-input outlined v-model="newPasswordForm.password" type="password" label="Password Baru *" lazy-rules
        :error="v$.password.$error" :error-message="v$.password.$errors.map((e) => e.$message).join()"
        @input="v$.password.$touch" @blur="v$.password.$touch" />
      <q-input outlined v-model="newPasswordForm.password_confirmation" type="password"
        label="Konfirmasi Password Baru *" lazy-rules :error="v$.password_confirmation.$error"
        :error-message="v$.password_confirmation.$errors.map((e) => e.$message).join()"
        @input="v$.password_confirmation.$touch" @blur="v$.password_confirmation.$touch" />
      <q-btn label="Ganti Password" type="submit" color="primary" :loading="props.newPasswordLoadingValues"></q-btn>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { AxiosError } from 'axios';
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { useMinLength, useNumeric, useRequired } from 'src/composables/validators'
import { reactive, ref } from 'vue'

const emit = defineEmits(['newPasswordSubmited'])
const props = defineProps(['newPasswordLoadingValues', 'email'])
const { notify } = useQuasar()

const newPasswordForm = reactive({
  code: '',
  password: '',
  password_confirmation: ''
})

const rules = {
  password: { required: useRequired(), minLength: useMinLength(5) },
  password_confirmation: { required: useRequired(), minLength: useMinLength(5) },
  code: { required: useRequired(), numeric: useNumeric() },
}

const retryCodeVerificationLoading = ref(false);


const v$ = useVuelidate(rules, newPasswordForm)

const onSubmit = () => {
  if (!v$.value.$invalid) {
    emit('newPasswordSubmited', newPasswordForm)

  } else {
    v$.value.$touch()
  }
}

const retrySendVerificationCode = async () => {
  try {
    retryCodeVerificationLoading.value = true;
    await api.post('password/email', {
      email: props.email
    })
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        notify({
          message: 'Password salah',
          color: 'negative',
          position: 'top-right',
          icon: 'error',
        })
      } else {
        notify({
          message: error.message,
          color: 'negative',
          position: 'top-right',
          icon: 'error',
        })
      }
    } else {
      notify({
        message: 'Terjadi masalah',
        color: 'negative',
        position: 'top-right',
        icon: 'error',
      })
    }
    console.log(error);
    throw error;
  }
  finally {
    retryCodeVerificationLoading.value = false;
  }
}
</script>

<style scoped></style>
