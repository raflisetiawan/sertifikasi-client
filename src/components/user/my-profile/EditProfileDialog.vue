<template>
  <div>
    <q-dialog v-model="$state.editDialog" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Edit Profile</div>
        </q-card-section>

        <q-form @submit="onSubmit">
          <q-card-section class="q-pt-none">
            <q-input v-model="formDialog.name" class="q-my-md" label="Nama" outlined type="text" :error="v$.name.$error"
              :error-message="v$.name.$errors.map((e) => e.$message).join()" @input="v$.name.$touch"
              @blur="v$.name.$touch" />
            <q-input v-model="formDialog.phone_number" class="q-my-md" label="Nomor Whatsapp" outlined type="text"
              :error="v$.phone_number.$error" :error-message="v$.phone_number.$errors.map((e) => e.$message).join()"
              @input="v$.phone_number.$touch" @blur="v$.phone_number.$touch" />
            <q-file hint="ukuran max 2mb" :filter="checkFileSize" outlined v-model="formDialog.image"
              accept=".jpg, image/*" counter use-chips label="Upload gambar profile" @rejected="onRejected" />
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn label="Edit" color="primary" type="submit" :loading="loading" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { UserEditForm } from 'src/models/user'
import { useUserDialog } from 'src/stores/userDialog';
import useVuelidate from '@vuelidate/core';
import { useRequired, useName, usePhoneNumber } from 'src/composables/validators';
import { useUserStore } from 'src/stores/user';
import { QRejectedEntry, useQuasar } from 'quasar';
import { api } from 'src/boot/axios';

const { $state } = useUserDialog()
const { $state: userState, editProfile } = useUserStore();
const { notify, cookies: qCookies } = useQuasar();

const formDialog = ref<UserEditForm>({
  name: '',
  phone_number: 0,
  image: null
})

const rules = {
  name: { required: useRequired(), name: useName() },
  phone_number: { required: useRequired(), phone: usePhoneNumber },
}

const v$ = useVuelidate(rules, formDialog.value)
const loading = ref(false);
const onSubmit = async () => {
  if (!v$.value.$invalid) {
    try {
      loading.value = true;
      await editProfile({ ...formDialog.value, _method: 'PATCH' });
      const response = await api.get(`user-profile/${userState.id}`, {
        headers: {
          Authorization: `Bearer ${qCookies.get('token')}`
        }
      });
      userState.image = response.data.data.image;
      $state.editDialog = false;
    } catch (error) {
      throw error
    } finally {
      loading.value = false;
    }
  } else {
    v$.value.$touch()
  }
}

const onRejected = (rejectedEntries: QRejectedEntry[]) => {
  notify({
    type: 'negative',
    message: `${rejectedEntries.length} file(s) did not pass validation constraints`
  })
}

const checkFileSize = (files: readonly unknown[] | FileList): readonly unknown[] => {
  const fileList = Array.from(files);
  return fileList.filter(file => (file instanceof File) && file.size < 2e+6);
};

watchEffect(() => {
  formDialog.value.name = userState.name;
  formDialog.value.phone_number = userState.phone_number;
})
</script>

<style scoped></style>
