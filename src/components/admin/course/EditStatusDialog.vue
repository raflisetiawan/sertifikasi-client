<template>
  <div>
    <q-dialog v-model="courseState.showEditStatusDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Ubah Status</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-option-group :options="options" type="radio" v-model="statusGroup" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn label="Ubah" color="primary" @click="updateStatus" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { api } from 'src/boot/axios';
import { qCookies } from 'src/boot/cookies';
import { useNotify } from 'src/composables/notifications';
import { useCourseStore } from 'src/stores/course';
import { ref } from 'vue';

const { $state: courseState } = useCourseStore()
const emit = defineEmits(['getCourses'])

const statusGroup = ref(null);

const options = [
  { label: 'Not Started', value: 'not_started' },
  { label: 'Ongoing', value: 'ongoing' },
  { label: 'Completed', value: 'completed' }
]

const updateStatus = async () => {
  try {
    await api.patch(
      `course/updateStatus/${courseState.editedStatusDialog}`,
      {
        status: statusGroup.value
      },
      {
        headers: {
          Authorization: 'Bearer ' + qCookies.get('token'),
        },
      }
    );
    courseState.showEditStatusDialog = false;
    emit('getCourses');

  } catch (error) {
    useNotify('gagal', 'red');
    throw error;
  }
}
</script>

<style scoped></style>
