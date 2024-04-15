<template>
  <div id="my-profile">
    <div class="row q-pa-md">
      <div class="col-md-10 col-sm-10 col-xs-12">
        <q-card class="my-card" flat bordered>
          <q-item class="row items-center">
            <div class="col-md-6">
              <div class="row items-center">
                <div class="col-md-7 col-sm-12">
                  <q-item-section avatar>
                    <q-avatar size="150px">
                      <img :src="$state.image">
                    </q-avatar>
                  </q-item-section>
                </div>
                <div class="col-md-5 col-sm-12">
                  <q-item-section>
                    <q-item-label>{{ $state.name }}</q-item-label>
                    <q-item-label caption>
                      {{ $state.phone_number }}
                    </q-item-label>
                    <q-item-label>
                      {{ $state.email }}
                    </q-item-label>
                  </q-item-section>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="row justify-around">
                <div class="col-md-4">
                  <q-item-section>
                    <q-item-label><q-btn color="green" @click="userDialogState.editDialog = true" class="q-mb-sm">Edit
                        Profile</q-btn></q-item-label>
                  </q-item-section>
                </div>
                <div class="col-md-4">
                  <q-item-section>
                    <q-item-label>
                      <q-btn color="blue" @click="changePasswordStore.showDialog = true" class="q-mb-sm">
                        Ubah Password
                      </q-btn>
                    </q-item-label>
                  </q-item-section>
                </div>
                <div class="col-md-">
                  <q-item-section v-show="$state.email_verified_at === null">
                    <q-item-label><q-btn color="warning" class="q-mb-sm">Verifikasi Email</q-btn></q-item-label>
                  </q-item-section>
                </div>
              </div>
            </div>
          </q-item>
        </q-card>
      </div>
    </div>
    <div class="q-pa-md">
      <Suspense>
        <template #default>
          <FollowedCourseCard />
        </template>

        <template #fallback>
          <LoadingCardComponent />
        </template>
      </Suspense>
      <div v-if="errorMessage.length !== 0">
        <div class="text-h6">{{ errorMessage }}</div>
      </div>
    </div>
    <edit-profile-dialog></edit-profile-dialog>
    <ChangePasswordDialog />
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { useMetaTitle } from 'src/composables/meta';
import { useUserStore } from 'src/stores/user';
import { defineAsyncComponent, onErrorCaptured, onMounted, ref } from 'vue';
import { useUserDialog } from 'stores/userDialog'
import EditProfileDialog from 'src/components/user/my-profile/EditProfileDialog.vue';
import LoadingCardComponent from 'src/components/user/my-profile/LoadingCardComponent.vue';
import { AxiosError } from 'axios';
import ChangePasswordDialog from 'src/components/user/change-password/ChangePasswordDialog.vue';
import { useChangePasswordStore } from 'src/stores/change-password';

const { cookies: qCookies } = useQuasar();
const FollowedCourseCard = defineAsyncComponent(() => import('components/user/my-profile/FollowedCourseCard.vue'));

useMetaTitle('My Profile')

const { $state: userDialogState } = useUserDialog()
const { $state } = useUserStore()
const { $state: changePasswordStore } = useChangePasswordStore();
const errorMessage = ref('');


onErrorCaptured((err) => {

  if (err instanceof AxiosError) {
    if (err.response?.status === 404) {
      errorMessage.value = 'Anda belum pernah mendaftar kelas'
    } else {
      errorMessage.value = err.message
    }
  }

  // handleLoad()
  return false; // Prevents the error from propagating further
});

onMounted(async () => {
  if ($state.image?.length === 0) {
    const response = await api.get(`user-profile/${$state.id}`, {
      headers: {
        Authorization: `Bearer ${qCookies.get('token')}`
      }
    });
    $state.image = response.data.data.image;
  }
})
</script>
