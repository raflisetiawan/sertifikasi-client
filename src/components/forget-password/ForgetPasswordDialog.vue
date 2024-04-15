<template>
  <div>
    <q-dialog v-model="$state.showForgetPasswordDialog" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Lupa Password</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-sm">
          <q-form @submit="requestCode">
            <div class="row items-center">
              <div class="col-md-11 col-sm-10 col-xs-12">
                <q-input :disable="showForm" outlined type="email" v-model="forgotPasswordForm.email"
                  label="Masukkan email anda *" lazy-rules :error="v$.email.$error"
                  :error-message="v$.email.$errors.map((e) => e.$message).join()" @input="v$.email.$touch"
                  @blur="v$.email.$touch" />
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <q-btn :disable="showForm" type="submit" label="Kirim kode verifikasi" color="primary"
                  :loading="oldPasswordLoading"></q-btn>
              </div>
            </div>
          </q-form>
        </q-card-section>
        <q-card-section v-if="showForm">
          <NewPassword :newPasswordLoadingValues="newPasswordLoading" :email="forgotPasswordForm.email"
            @newPasswordSubmited="(data: NewPasswordType) => handleNewPasswordSubmited(data)" />
        </q-card-section>

      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core';
import { AxiosError } from 'axios';
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { useEmail } from 'src/composables/validators';
import { useChangePasswordStore } from 'src/stores/change-password';
import { reactive, ref } from 'vue';
import NewPassword from 'components/user/change-password/NewPassword.vue'
import { NewPasswordType } from 'src/models/newPassword'

const { $state } = useChangePasswordStore();
const { notify } = useQuasar()
const newPasswordLoading = ref(false);

const forgotPasswordForm = reactive({
  email: ''
});

const showForm = ref(false);
const oldPasswordLoading = ref(false);

const rules = {
  email: { email: useEmail() },
}

const v$ = useVuelidate(rules, forgotPasswordForm)

const requestCode = async () => {
  if (!v$.value.$invalid) {
    try {
      oldPasswordLoading.value = true;
      const response = await api.post('password/email', {
        email: forgotPasswordForm.email
      })
      if (response.status === 200) {
        showForm.value = true;
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          notify({
            message: 'Password salah',
            color: 'negative',
            position: 'top-right',
            icon: 'error',
          })
          forgotPasswordForm.email = ''
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
      throw error;
    }
    finally {
      oldPasswordLoading.value = false;
    }
  } else {
    v$.value.$touch();
  }
}

const handleNewPasswordSubmited = async (data: NewPasswordType) => {
  try {
    newPasswordLoading.value = true;
    const response = await api.post('password/code/check', { ...data, code: data.code.toString() }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (response.status === 200) {
      notify({
        message: 'Password berhasil di ganti',
        color: 'green',
        icon: 'done',
        position: 'top-right'
      })
      $state.showForgetPasswordDialog = false;
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response && error.response.status === 422 && error.response.data.code) {
        error.response.data.code[0] || 'Terjadi kesalahan saat memproses permintaan.';
        notify({
          message: 'Kode tidak valid',
          color: 'red',
          icon: 'error',
          position: 'top-right'
        })
      } else if (error.response && error.response.status === 422 && error.response.data.password) {
        error.response.data.password[0] || 'Terjadi kesalahan saat memproses permintaan.';
        notify({
          message: 'Konfirmasi password tidak valid',
          color: 'red',
          icon: 'error',
          position: 'top-right'
        })
      }
    } else {
      notify({
        message: 'Terjadi kesalahan saat memproses permintaan.',
        color: 'red',
        icon: 'error',
        position: 'top-right'
      })
      throw error;
    }
  } finally {
    newPasswordLoading.value = false;
  }
}


</script>

<style scoped></style>
