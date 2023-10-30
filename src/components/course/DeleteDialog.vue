<template>
  <div>
    <q-dialog v-model="dialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="primary" text-color="white" />
          <span class="q-ml-sm"> Apakah anda yakin ingin menghapus kelas <div class="text-weight-bold">{{ course.name }}
            </div></span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" @click="$emit('closeDeleteDialog')" />
          <q-btn color="red" label="Delete" :loading="deleteLoading" @click="deleteCourse" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { api } from 'src/boot/axios';
import { computed, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useNotify } from 'src/composables/notifications';
const props = defineProps(['isDeleteDialogShow', 'course'])
const { localStorage: qLocalStorage } = useQuasar();
const emit = defineEmits(['successDelete', 'closeDeleteDialog'])

const dialog = computed(() => props.isDeleteDialogShow);
const deleteLoading = ref(false);
const deleteCourse = async () => {
  try {
    deleteLoading.value = true
    await api.delete(`course/${props.course.id}`, {
      headers: {
        Authorization: 'Bearer ' + qLocalStorage.getItem('token'),
      }
    })
    emit('successDelete');
    emit('closeDeleteDialog');
    useNotify('Berhasil di hapus', 'green')
  } catch (error) {
    throw error;
  } finally {
    deleteLoading.value = false
  }
}

</script>

<style scoped></style>
