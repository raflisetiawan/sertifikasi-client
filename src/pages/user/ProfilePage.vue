<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <!-- Profile Image Section -->
      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section class="column items-center">
            <q-avatar size="150px">
              <q-skeleton v-if="loading" type="QAvatar" />
              <template v-else>
                <q-img :src="profileImage" ratio="1">
                  <template v-slot:error>
                    <div class="absolute-full flex flex-center bg-grey-3">
                      <q-icon name="account_circle" size="80px" color="grey-7" />
                    </div>
                  </template>
                </q-img>
              </template>
            </q-avatar>

            <div class="q-mt-md q-gutter-sm">
              <q-file v-model="newImage" accept="image/*" label="Ubah Foto" outlined dense style="max-width: 200px"
                @update:model-value="handleImageChange">
                <template v-slot:prepend>
                  <q-icon name="photo_camera" />
                </template>
              </q-file>

              <q-btn v-if="profile?.image" color="negative" outline label="Hapus Foto" class="q-mt-sm" dense
                @click="confirmRemoveImage" :loading="loading" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Profile Info Section -->
      <div class="col-12 col-md-8">
        <q-card>
          <q-card-section>
            <div class="text-h6">Informasi Profil</div>

            <q-form @submit="onSubmit" class="q-gutter-md q-mt-md">
              <q-input v-model="form.name" label="Nama Lengkap" outlined :error="v$.name?.$error"
                :error-message="v$.name.$errors.map((e) => e.$message).join()" @blur="v$.name.$touch">
              </q-input>
              <q-input v-model="form.email" label="Email" outlined readonly>
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>

              <q-input v-model="form.phone_number" label="Nomor Telepon" outlined :error="v$.phone_number.$error"
                :error-message="v$.phone_number.$errors.map((e) => e.$message).join()" @blur="v$.phone_number.$touch">
                <template v-slot:prepend>
                  <q-icon name="phone" />
                </template>
              </q-input>

              <div class="text-subtitle2 q-mt-lg">Ubah Password</div>
              <q-separator />

              <q-input v-model="form.current_password" label="Password Saat Ini" outlined
                :type="isPwd ? 'password' : 'text'" :error="v$.current_password.$error"
                :error-message="v$.current_password.$errors.map((e) => e.$message).join()"
                @blur="v$.current_password.$touch">
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
                <template v-slot:append>
                  <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                    @click="isPwd = !isPwd" />
                </template>
              </q-input>

              <q-input v-model="form.new_password" label="Password Baru" outlined :type="isPwd ? 'password' : 'text'"
                :error="v$.new_password.$error" :error-message="v$.new_password.$errors.map((e) => e.$message).join()"
                @blur="v$.new_password.$touch">
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
                <template v-slot:append>
                  <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                    @click="isPwd = !isPwd" />
                </template>
              </q-input>

              <q-input v-model="form.new_password_confirmation" label="Konfirmasi Password Baru" outlined
                :type="isPwd ? 'password' : 'text'" :error="v$.new_password_confirmation.$error"
                :error-message="v$.new_password_confirmation.$errors.map((e) => e.$message).join()"
                @blur="v$.new_password_confirmation.$touch">
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
                <template v-slot:append>
                  <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                    @click="isPwd = !isPwd" />
                </template>
              </q-input>

              <div class="row justify-end q-mt-md">
                <q-btn type="submit" color="primary" label="Simpan Perubahan" :loading="loading" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { useRequired, useName, usePhoneNumber } from 'src/composables/validators';
import { useQuasar } from 'quasar';
import { useUserProfileStore } from 'src/stores/user-proflie-store';

// Type the form properly
interface ProfileFormData {
  name: string;
  email: string;
  phone_number: string;
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

// Type the update data properly
interface UpdateProfileData {
  name?: string;
  phone_number?: string;
  current_password?: string;
  new_password?: string;
  new_password_confirmation?: string;
}

const $q = useQuasar();
const userProfileStore = useUserProfileStore();
const loading = ref(false);
const isPwd = ref(true);
const newImage = ref<File | null>(null);

const profile = computed(() => userProfileStore.profile);

const profileImage = computed(() => {
  if (!profile.value?.image) return '';
  return profile.value.image;
});


const form = reactive<ProfileFormData>({
  name: '',
  email: '',
  phone_number: '',
  current_password: '',
  new_password: '',
  new_password_confirmation: ''
});

const rules = {
  name: {
    required: useRequired(),
    validName: useName()
  },
  phone_number: {
    required: useRequired(),
    phone: usePhoneNumber()
  },
  current_password: {
    required: (value: string) => !value || Boolean(form.new_password)
  },
  new_password: {
    minLength: (value: string) => {
      if (!value) return true;
      return value.length >= 8;
    }
  },
  new_password_confirmation: {
    sameAsPassword: (value: string) => !form.new_password || value === form.new_password
  }
};

const v$ = useVuelidate(rules, form);

const handleImageChange = async (file: File) => {
  if (!file || !profile.value) return;

  try {
    loading.value = true;
    await userProfileStore.updateProfileImage(profile.value.id, file);
    $q.notify({
      type: 'positive',
      message: 'Foto profil berhasil diperbarui'
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Gagal mengubah foto profil'
    });
  } finally {
    loading.value = false;
    newImage.value = null;
  }
};

const confirmRemoveImage = () => {
  $q.dialog({
    title: 'Konfirmasi',
    message: 'Apakah Anda yakin ingin menghapus foto profil?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    if (!profile.value) return;

    try {
      loading.value = true;
      await userProfileStore.removeProfileImage(profile.value.id);
      $q.notify({
        type: 'positive',
        message: 'Foto profil berhasil dihapus'
      });
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Gagal menghapus foto profil'
      });
    } finally {
      loading.value = false;
    }
  });
};


const onSubmit = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) {
    $q.notify({
      type: 'negative',
      message: 'Mohon periksa kembali form Anda'
    });
    return;
  }

  try {
    loading.value = true;
    const updateData: UpdateProfileData = {};

    if (form.name !== profile.value?.name) {
      updateData.name = form.name;
    }
    if (form.phone_number !== profile.value?.phone_number) {
      updateData.phone_number = form.phone_number;
    }
    if (form.new_password) {
      updateData.current_password = form.current_password;
      updateData.new_password = form.new_password;
      updateData.new_password_confirmation = form.new_password_confirmation;
    }

    if (Object.keys(updateData).length === 0) {
      $q.notify({
        type: 'warning',
        message: 'Tidak ada perubahan yang dilakukan'
      });
      return;
    }
    await userProfileStore.updateProfile(updateData);
    $q.notify({
      type: 'positive',
      message: 'Profil berhasil diperbarui'
    });

    // Reset password fields
    form.current_password = '';
    form.new_password = '';
    form.new_password_confirmation = '';
    v$.value.$reset();

  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Gagal memperbarui profil'
    });
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  try {
    loading.value = true;
    await userProfileStore.fetchProfile();
    if (profile.value) {
      form.name = profile.value.name;
      form.email = profile.value.email;
      form.phone_number = profile.value.phone_number;
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Gagal memuat data profil'
    });
  } finally {
    loading.value = false;
  }
});
</script>

<style lang="scss" scoped>
.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  /* Standard property */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.q-avatar {
  border: 2px solid $primary;
}
</style>
