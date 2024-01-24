<template>
  <div class="container text-center q-pa-md q-mt-lg">
    <div class="row justify-center">
      <div class="col-12">
        <div class="row justify-center">
          <div class="col-md-10 col-sm-10 col-xs-11">
            <q-card class="my-card" bordered flat>
              <q-card-section>
                <div class="text-h6">Sign In</div>
                <q-banner inline-actions :class="signInError.isError ? `text-white bg-red` : `text-white bg-red hidden `"
                  rounded v-show="signInError.isError">
                  {{ signInError.message }}
                  <template v-slot:action>
                    <q-btn flat dense icon="fa-solid fa-xmark" @click="signInError.isError = false" />
                  </template>
                </q-banner>
              </q-card-section>

              <q-separator dark inset />
              <q-card-section>
                <q-form @submit="onSubmit" class="q-gutter-md">
                  <q-input outlined type="email" v-model="signInForm.email" lazy-rules label="Email *"
                    :error="v$.email.$error" :error-message="v$.email.$errors.map((e) => e.$message).join()"
                    @input="v$.email.$touch" @blur="v$.email.$touch" />

                  <q-input outlined :type="showPassword ? 'text' : 'password'" v-model="signInForm.password"
                    label="Password *" lazy-rules :error="v$.password.$error"
                    :error-message="v$.password.$errors.map((e) => e.$message).join()" @input="v$.password.$touch"
                    @blur="v$.password.$touch">

                    <template v-slot:append>
                      <q-btn :icon="showPassword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"
                        @click="showPassword = !showPassword" flat></q-btn>
                    </template>
                  </q-input>
                  <q-card-actions>
                    <q-btn label="Sign In" type="submit" :loading="loadingSignIn" color="primary" />
                  </q-card-actions>
                  <div class="text-center">
                    <div class="text-body2">Tidak punya akun ?<q-btn dense :to="{ name: 'SignUpPage' }" color="primary"
                        flat>
                        Daftar</q-btn></div>

                  </div>
                </q-form>
              </q-card-section>
            </q-card>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SignInForm, SignInError } from 'src/models/auth';
import { useVuelidate } from '@vuelidate/core'
import { useEmail, useRequired, useMinLength } from 'src/composables/validators';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useMetaTitle } from 'src/composables/meta';

const router = useRouter();
const { cookies: qCookies } = useQuasar();

useMetaTitle('Sign In')

const signInForm = ref<SignInForm>({
  email: '',
  password: ''
})
const showPassword = ref(false);

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
      qCookies.set('token', response.data.token);
      if (response.data.user.role_id === 1) router.push({ name: 'AdminPage' })
      else router.push({ name: 'HomePage' })
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
</script>

<style scoped></style>
