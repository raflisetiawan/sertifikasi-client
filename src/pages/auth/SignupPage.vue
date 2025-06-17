<template>
  <div class="auth-form-wrapper">
    <!-- Auth Form Container -->
    <div class="auth-container">
      <!-- Header -->
      <div class="text-center q-mb-xl">
        <div class="text-h4 text-weight-bold text-primary">Daftar Akun</div>
        <div class="text-subtitle1 text-grey-7 q-mt-sm">
          Bergabunglah dan mulai perjalanan belajar Anda
        </div>
      </div>

      <!-- Alert Messages -->
      <transition-group appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
        <q-banner v-if="signUpError.isError" class="alert-banner error-banner" rounded dense key="error">
          <template v-slot:avatar>
            <q-icon name="error" color="white" />
          </template>
          {{ signUpError.message }}
          <template v-slot:action>
            <q-btn flat dense icon="close" color="white" @click="signUpError.isError = false" />
          </template>
        </q-banner>

        <q-banner v-if="successSignUp" class="alert-banner success-banner" rounded dense key="success">
          <template v-slot:avatar>
            <q-icon name="check_circle" color="white" />
          </template>
          <div class="text-body1">Berhasil mendaftar</div>
          <div class="text-body2">Verifikasi sudah dikirim ke email Anda</div>
          <div class="text-caption q-mt-sm">
            Belum menerima verifikasi?
            <q-btn flat dense color="white" label="Kirim ulang" @click="sendEmailVerification"
              :loading="sendEmailVerificationLoading" />
          </div>
        </q-banner>
      </transition-group>

      <!-- Social Sign Up -->
      <div class="social-signup q-mb-lg">
        <q-btn class="google-btn full-width" unelevated color="white" text-color="dark" @click="handleGoogleSignup">
          <q-icon name="fab fa-google" size="18px" class="q-mr-sm" />
          Daftar dengan Google
        </q-btn>
      </div>

      <div class="separator">
        <span>atau daftar dengan email</span>
      </div>

      <!-- Sign Up Form -->
      <q-form @submit="onSubmit" class="q-mt-lg">
        <div class="row q-col-gutter-md">
          <!-- Name Input -->
          <div class="col-12">
            <q-input outlined v-model="signUpForm.name" label="Nama Lengkap *" class="modern-input"
              :error="v$.name.$error" :error-message="v$.name.$errors.map((e) => e.$message).join()"
              @input="v$.name.$touch" @blur="v$.name.$touch">
              <template v-slot:prepend>
                <q-icon name="person" color="grey-7" />
              </template>
            </q-input>
          </div>

          <!-- Email Input -->
          <div class="col-12">
            <q-input outlined type="email" v-model="signUpForm.email" label="Email *" class="modern-input"
              :error="v$.email.$error" :error-message="v$.email.$errors.map((e) => e.$message).join()"
              @input="v$.email.$touch" @blur="v$.email.$touch">
              <template v-slot:prepend>
                <q-icon name="email" color="grey-7" />
              </template>
            </q-input>
          </div>

          <!-- Phone Number Input -->
          <div class="col-12">
            <q-input outlined v-model="signUpForm.phoneNumber" label="Nomor WhatsApp *" type="tel" class="modern-input"
              :error="v$.phoneNumber.$error" :error-message="v$.phoneNumber.$errors.map((e) => e.$message).join()"
              @input="v$.phoneNumber.$touch" @blur="v$.phoneNumber.$touch" hint="Contoh: 081234567890">
              <template v-slot:prepend>
                <q-icon name="phone" color="grey-7" />
              </template>
            </q-input>
          </div>

          <!-- Password Input -->
          <div class="col-12">
            <q-input outlined v-model="signUpForm.password" :type="showPassword ? 'text' : 'password'"
              label="Password *" class="modern-input" :error="v$.password.$error"
              :error-message="v$.password.$errors.map((e) => e.$message).join()" @input="v$.password.$touch"
              @blur="v$.password.$touch">
              <template v-slot:prepend>
                <q-icon name="lock" color="grey-7" />
              </template>
              <template v-slot:append>
                <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                  @click="showPassword = !showPassword" />
              </template>
            </q-input>
          </div>

          <!-- Password Confirmation -->
          <div class="col-12">
            <q-input outlined v-model="signUpForm.passwordConfirmation"
              :type="showConfirmationPassword ? 'text' : 'password'" label="Konfirmasi Password *" class="modern-input"
              :error="v$.passwordConfirmation.$error"
              :error-message="v$.passwordConfirmation.$errors.map((e) => e.$message).join()"
              @input="v$.passwordConfirmation.$touch" @blur="v$.passwordConfirmation.$touch">
              <template v-slot:prepend>
                <q-icon name="lock" color="grey-7" />
              </template>
              <template v-slot:append>
                <q-icon :name="showConfirmationPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                  @click="showConfirmationPassword = !showConfirmationPassword" />
              </template>
            </q-input>
          </div>
        </div>

        <!-- Submit Button -->
        <q-btn unelevated color="primary" class="full-width submit-btn q-mt-lg" label="Daftar Sekarang" type="submit"
          :loading="loadingSignup" />
      </q-form>

      <!-- Login Link -->
      <div class="text-center q-mt-lg">
        <span class="text-grey-7">Sudah punya akun?</span>
        <q-btn flat color="primary" :to="{ name: 'auth.login' }" label="Masuk" class="q-ml-sm no-caps" />
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

const handleGoogleSignup = async () => {
  try {
    const response = await api.get('auth/google');
    if (response.data.url) {
      window.location.href = response.data.url;
    }
  } catch (error) {
    signUpError.value.isError = true;
    signUpError.value.message = 'Gagal melakukan pendaftaran dengan Google';
  }
};

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

<style lang="scss" scoped>
.auth-form-wrapper {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
}

.auth-container {
  padding: 2rem;
}

.alert-banner {
  margin-bottom: 1rem;

  &.error-banner {
    background: #ff5252;
    color: white;
  }

  &.success-banner {
    background: #4caf50;
    color: white;
  }
}

.social-signup {
  .google-btn {
    border: 1px solid rgba(0, 0, 0, 0.12);
    height: 48px;
    font-weight: 500;

    &:hover {
      background: #f5f5f5;
    }
  }
}

.separator {
  position: relative;
  text-align: center;
  margin: 1.5rem 0;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    width: 100%;
    height: 1px;
    background: rgba(0, 0, 0, 0.12);
  }

  span {
    background: white;
    padding: 0 1rem;
    color: rgba(0, 0, 0, 0.6);
    position: relative;
  }
}

.modern-input {
  .q-field__control {
    height: 48px;
  }
}

.submit-btn {
  height: 48px;
  font-weight: 500;
  font-size: 1.1rem;
}
</style>
