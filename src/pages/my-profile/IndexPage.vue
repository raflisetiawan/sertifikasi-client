<template>
  <div id="my-profile">
    <div class="row q-pa-md">
      <div class="col-md-10 col-sm-10 col-xs-12">
        <q-card class="my-card" flat bordered>
          <q-item>
            <q-item-section avatar>
              <q-avatar size="150px">
                <img :src="$state.image">
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ $state.name }}</q-item-label>
              <q-item-label caption>
                {{ $state.phone_number }}
              </q-item-label>
              <q-item-label header>
                {{ $state.email }}
              </q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label><q-btn color="green" @click="userDialogState.editDialog = true">Edit
                  Profile</q-btn></q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label><q-btn color="blue">Ubah Password</q-btn></q-item-label>
            </q-item-section>
            <q-item-section v-if="$state.email_verified_at === null">
              <q-item-label><q-btn color="warning">Verifikasi Email</q-btn></q-item-label>
            </q-item-section>
          </q-item>
        </q-card>
      </div>
    </div>
    <div class="q-pa-md">
      <suspense>
        <followed-course-card></followed-course-card>
        <template #fallback>Loading..</template>
      </suspense>
    </div>
    <edit-profile-dialog></edit-profile-dialog>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { useMetaTitle } from 'src/composables/meta';
import { useUserStore } from 'src/stores/user';
import { defineAsyncComponent, onMounted } from 'vue';
import { useUserDialog } from 'stores/userDialog'
import EditProfileDialog from 'src/components/user/my-profile/EditProfileDialog.vue';

const { localStorage: qLocalStorage } = useQuasar();
const FollowedCourseCard = defineAsyncComponent(() => import('components/user/my-profile/FollowedCourseCard.vue'));
useMetaTitle('My Profile')

const { $state: userDialogState } = useUserDialog()
const { $state } = useUserStore()

onMounted(async () => {
  if ($state.image?.length === 0) {
    const response = await api.get(`user-profile/${$state.id}`, {
      headers: {
        Authorization: `Bearer ${qLocalStorage.getItem('token')}`
      }
    });
    $state.image = response.data.data.image;
  }
})
</script>

<style scoped></style>
