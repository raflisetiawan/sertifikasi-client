<template>
  <div class="auth-form-wrapper">
    <ForgetPasswordDialog />

    <!-- Auth Form Container -->
    <div class="auth-container">
      <!-- Header -->
      <div class="text-center q-mb-xl">
        <div class="text-h4 text-weight-bold text-primary">Selamat Datang Kembali!</div>
        <div class="text-subtitle1 text-grey-7 q-mt-sm">
          Silakan masuk untuk melanjutkan pembelajaran Anda
        </div>
      </div>

      <!-- Alert Messages -->
      <transition-group appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
        <q-banner v-if="signInError.isError" class="alert-banner error-banner" rounded dense key="error">
          <template v-slot:avatar>
            <q-icon name="error" color="white" />
          </template>
          {{ signInError.message }}
          <template v-slot:action>
            <q-btn flat dense icon="close" color="white" @click="signInError.isError = false" />
          </template>
        </q-banner>

        <q-banner v-if="afterSignup" class="alert-banner success-banner" rounded dense key="success">
          <template v-slot:avatar>
            <q-icon name="check_circle" color="white" />
          </template>
          Email anda sudah terverifikasi, silakan login
          <template v-slot:action>
            <q-btn flat dense icon="close" color="white" @click="afterSignup = false" />
          </template>
        </q-banner>
      </transition-group>

      <!-- Social Login -->
      <div class="social-login q-mb-lg">
        <q-btn class="google-btn" unelevated color="white" text-color="dark" @click="handleGoogleLogin"
          :loading="googleLoading">
          <q-icon name="fab fa-google" size="18px" class="q-mr-sm" />
          Masuk dengan Google
        </q-btn>
      </div>

      <div class="separator">
        <span>atau</span>
      </div>

      <!-- Login Form -->
      <q-form @submit="onSubmit" class="q-mt-md">
        <div class="form-group">
          <q-input outlined v-model="signInForm.email" label="Email" class="modern-input" lazy-rules
            :error="v$.email.$error" :error-message="v$.email.$errors.map((e) => e.$message).join()"
            @input="v$.email.$touch" @blur="v$.email.$touch">
            <template v-slot:prepend>
              <q-icon name="email" color="grey-7" />
            </template>
          </q-input>
        </div>

        <div class="form-group">
          <q-input outlined v-model="signInForm.password" :type="showPassword ? 'text' : 'password'" label="Password"
            class="modern-input" lazy-rules :error-message="v$.password.$errors.map((e) => e.$message).join()"
            @input="v$.password.$touch" @blur="v$.password.$touch">
            <template v-slot:prepend>
              <q-icon name="lock" color="grey-7" />
            </template>
            <template v-slot:append>
              <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                @click="showPassword = !showPassword" />
            </template>
          </q-input>
        </div>

        <div class="form-actions row items-center justify-between q-mb-md">
          <!-- <q-checkbox v-model="rememberMe" label="Ingat saya" color="primary" dense /> -->
          <q-btn flat color="primary" label="Lupa Password?" class="no-caps"
            @click="$state.showForgetPasswordDialog = true" />
        </div>

        <q-btn unelevated color="primary" class="full-width submit-btn" label="Masuk" type="submit"
          :loading="loadingSignIn" />
      </q-form>

      <!-- Register Link -->
      <div class="text-center q-mt-lg">
        <span class="text-grey-7">Belum punya akun?</span>
        <q-btn flat color="primary" :to="{ name: 'auth.register' }" label="Daftar" class="q-ml-sm no-caps" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { SignInForm, SignInError } from 'src/models/auth';
import { useVuelidate } from '@vuelidate/core'
import { useEmail, useRequired, useMinLength } from 'src/composables/validators';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { useMetaTitle } from 'src/composables/meta';
import { useChangePasswordStore } from 'src/stores/change-password';
import ForgetPasswordDialog from 'src/components/forget-password/ForgetPasswordDialog.vue';
const router = useRouter();
const route = useRoute();
const { cookies: qCookies } = useQuasar();
const afterSignup = ref(false);
const { $state } = useChangePasswordStore();


useMetaTitle('Sign In')

const signInForm = ref<SignInForm>({
  email: '',
  password: ''
})
const showPassword = ref(false);
const googleLoading = ref(false);
const signInError = ref<SignInError>({
  isError: false,
  message: ''
})

const rules = {
  email: { required: useRequired(), email: useEmail() },
  password: { required: useRequired(), minLength: useMinLength(5) }
}


const v$ = useVuelidate(rules, signInForm.value)
const loadingSignIn = ref(false);
const onSubmit = async () => {
  if (!v$.value.$invalid) {
    loadingSignIn.value = true;
    try {
      const response = await api.post('signin', signInForm.value);

      // Store both token and expiration time
      qCookies.set('token', response.data.token, {
        path: '/',
        expires: '1d',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax'
      });

      qCookies.set('expires_at', response.data.expires_at, {
        path: '/',
        expires: '1d',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax'
      });

      if (response.data.user.role_id === 1) {
        router.push({ name: 'AdminPage' });
      } else {
        router.push({ name: 'home' });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          signInError.value.isError = true;
          signInError.value.message = 'Password yang Anda masukkan salah.';
          throw new Error('Password yang Anda masukkan salah.');
        } else if (error.response.status === 404) {
          signInError.value.isError = true;
          signInError.value.message = error.response.data.message;
          throw new Error('Password yang Anda masukkan salah.');
        } else if (Array.isArray(error.response.data.message)) {
          error.response.data.message.forEach((errorMessage: string) => {
            signInError.value.isError = true;
            signInError.value.message = errorMessage;
          });
          throw new Error(error.response.data.message.join(', '));
        } else if (error.response.status === 500) {
          signInError.value.isError = true;
          signInError.value.message = 'Terjadi masalah pada server. Silakan hubungi administrator.';
          throw new Error('Terjadi masalah pada server. Silakan hubungi administrator.');
        } else {
          signInError.value.isError = true;
          signInError.value.message = 'Terjadi kesalahan saat proses autentikasi. Silakan coba lagi nanti.';
          throw new Error('Terjadi kesalahan saat proses autentikasi. Silakan coba lagi nanti.');
        }
      }
    } finally {
      loadingSignIn.value = false;
    }

  } else {
    v$.value.$touch();
  }
}

const handleGoogleLogin = async () => {
  try {
    googleLoading.value = true;
    const response = await api.get('auth/google');
    if (response.data.url) {
      window.location.href = response.data.url;
    }
  } catch (error) {
    signInError.value.isError = true;
    signInError.value.message = 'Gagal melakukan login dengan Google';
  } finally {
    googleLoading.value = false;
  }
};

onMounted(() => {
  if (route.query.hasOwnProperty('after-signup')) {
    afterSignup.value = true;
  } else {
    afterSignup.value = false;
  }

  const token = route.query.token as string;
  if (token) {
    qCookies.set('token', token);
    router.push({ name: 'home' });
  }
})
</script>

<style lang="scss" scoped>
.auth-form-wrapper {
  width: 100%;
  max-width: 440px;
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

.social-login {
  .google-btn {
    width: 100%;
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

.form-group {
  margin-bottom: 1.5rem;

  .modern-input {
    .q-field__control {
      height: 48px;
    }
  }
}

.submit-btn {
  height: 48px;
  font-weight: 500;
  font-size: 1.1rem;
}
</style>
