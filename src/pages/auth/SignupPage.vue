<template>
  <div class="container text-center q-pa-md q-mt-lg">
    <div class="row justify-center">
      <div class="col-12">
        <div class="row justify-center">
          <div class="col-md-10 col-sm-10 col-xs-11">
            <q-card class="my-card" flat bordered>
              <q-card-section>
                <div class="text-h6">Daftar</div>
                <q-banner inline-actions
                  :class="signUpError.isError ? `text-white bg-red` : `text-white bg-red hidden `" rounded
                  v-show="signUpError.isError">
                  {{ signUpError.message }}
                  <template v-slot:action>
                    <q-btn flat dense icon="fa-solid fa-xmark" @click="signUpError.isError = false" />
                  </template>
                </q-banner>
                <q-banner inline-actions class="bg-green text-white" rounded v-show="successSignUp">
                  <div class="text-body1">
                    Berhasil mendaftar
                  </div>
                  <div class="text-body1">Verifikasi sudah di kirim ke email anda</div>
                </q-banner>
                <div class="text-body2 q-mt-sm" v-show="successSignUp">
                  Belum menerima verifikasi dari email?
                  <q-btn color="primary" flat size="sm" dense label="Kirim ulang verifikasi"
                    @click="sendEmailVerification" :loading="sendEmailVerificationLoading"></q-btn>
                </div>
              </q-card-section>

              <q-separator dark inset />
              <q-card-section>
                <q-form @submit="onSubmit" class="q-gutter-md">
                  <q-input outlined type="email" v-model="signUpForm.email" lazy-rules label="Email *"
                    :error="v$.email.$error" :error-message="v$.email.$errors.map((e) => e.$message).join()"
                    @input="v$.email.$touch" @blur="v$.email.$touch" />


                  <q-input outlined v-model="signUpForm.phoneNumber" label="Nomor WA *" lazy-rules type="number"
                    :error="v$.phoneNumber.$error" :error-message="v$.phoneNumber.$errors.map((e) => e.$message).join()"
                    @input="v$.phoneNumber.$touch" @blur="v$.phoneNumber.$touch" hint="Contoh 081...">

                  </q-input>
                  <q-input outlined v-model="signUpForm.name" label="Nama *" lazy-rules type="text"
                    :error="v$.name.$error" :error-message="v$.name.$errors.map((e) => e.$message).join()"
                    @input="v$.name.$touch" @blur="v$.name.$touch" />

                  <q-input outlined :type="showPassword ? 'text' : 'password'" v-model="signUpForm.password"
                    label="Password *" lazy-rules :error="v$.password.$error"
                    :error-message="v$.password.$errors.map((e) => e.$message).join()" @input="v$.password.$touch"
                    @blur="v$.password.$touch">

                    <template v-slot:append>
                      <q-btn :icon="showPassword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"
                        @click="showPassword = !showPassword" flat></q-btn>
                    </template>
                  </q-input>
                  <q-input outlined :type="showConfirmationPassword ? 'text' : 'password'"
                    v-model="signUpForm.passwordConfirmation" label="Konfirmasi Password *" lazy-rules
                    :error="v$.passwordConfirmation.$error"
                    :error-message="v$.passwordConfirmation.$errors.map((e) => e.$message).join()"
                    @input="v$.passwordConfirmation.$touch" @blur="v$.passwordConfirmation.$touch">

                    <template v-slot:append>
                      <q-btn :icon="showConfirmationPassword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"
                        @click="showConfirmationPassword = !showConfirmationPassword" flat></q-btn>
                    </template>
                  </q-input>


                  <q-card-actions>
                    <q-btn label="Daftar" type="submit" :loading="loadingSignup" color="primary" />
                  </q-card-actions>
                </q-form>
                <div class="text-center">
                  <div class="text-caption">Sudah punya akun ?<q-btn dense :to="{ name: 'auth.login' }" color="primary"
                      flat>
                      Login</q-btn></div>

                </div>
              </q-card-section>
            </q-card>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { SignUpForm, SignUpError } from 'src/models/auth';
import { useVuelidate } from '@vuelidate/core'
import { useEmail, useRequired, useMinLength, useName, usePhoneNumber } from 'src/composables/validators';
import { api } from 'boot/axios';
import axios from 'axios';
import { useMetaTitle } from 'src/composables/meta';

const successSignUp = ref(false);
const sendEmailVerificationLoading = ref(false);
const userEmail = reactive({
  email: '',
  id: 0
});
useMetaTitle('Sign Up')

const signUpForm = ref<SignUpForm>({
  email: '',
  password: '',
  passwordConfirmation: '',
  name: '',
  phoneNumber: 0
})
const showPassword = ref(false);
const showConfirmationPassword = ref(false);

const signUpError = ref<SignUpError>({
  isError: false,
  message: ''
})

const rules = {
  email: { required: useRequired(), email: useEmail() },
  password: { required: useRequired(), minLength: useMinLength(5) },
  name: { requried: useRequired(), minLenght: useName() },
  passwordConfirmation: { required: useRequired() },
  phoneNumber: { validNumber: usePhoneNumber(), required: useRequired() }
}


const v$ = useVuelidate(rules, signUpForm.value)
const loadingSignup = ref(false);

const sendEmailVerification = async () => {
  try {
    sendEmailVerificationLoading.value = true;

    await api.post('email/verify/resend', userEmail);
  } catch (error) {
    throw error;
  } finally {
    sendEmailVerificationLoading.value = false;
  }
}

const onSubmit = async () => {
  if (signUpForm.value.passwordConfirmation !== signUpForm.value.password) {
    signUpError.value.isError = true;
    signUpError.value.message = 'Konfirmasi password tidak valid';
    return;
  }
  if (!v$.value.$invalid) {
    loadingSignup.value = true;
    try {
      const userData = signUpForm.value;
      const response = await api.post('signup', {
        name: userData.name, email: userData.email, password: userData.password, password_confirmation: userData.passwordConfirmation, phone_number: userData.phoneNumber
      });

      successSignUp.value = true;
      userEmail.email = response.data.user.email;
      userEmail.id = response.data.user.id;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          signUpError.value.isError = true;
          signUpError.value.message = 'Password yang Anda masukkan salah.';
          throw new Error('Password yang Anda masukkan salah.');
        } else if (error.response.status === 404) {
          signUpError.value.isError = true;
          signUpError.value.message = error.response.data.message;
          throw new Error('Password yang Anda masukkan salah.');
        } else if (Array.isArray(error.response.data.email)) {
          error.response.data.email.forEach((errorMessage: string) => {
            signUpError.value.isError = true;
            if (errorMessage == 'The email has already been taken.') {
              signUpError.value.message = 'Email sudah terdaftar';
            } else {
              signUpError.value.message = errorMessage;
            }
          });
          throw new Error(error.response.data.message.join(', '));
        } else if (error.response.status === 500) {
          signUpError.value.isError = true;
          signUpError.value.message = 'Terjadi masalah pada server. Silakan hubungi administrator.';
          throw new Error('Terjadi masalah pada server. Silakan hubungi administrator.');
        } else {
          signUpError.value.isError = true;
          signUpError.value.message = 'Terjadi kesalahan saat proses autentikasi. Silakan coba lagi nanti.';
          throw new Error('Terjadi kesalahan saat proses autentikasi. Silakan coba lagi nanti.');
        }
      } else {
        throw error;
      }
    } finally {
      loadingSignup.value = false;
    }

  } else {
    v$.value.$touch();
  }
}
</script>

<style scoped></style>
