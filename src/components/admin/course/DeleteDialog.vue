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
import { computed, ref } from 'vue';
import { useNotify } from 'src/composables/notifications';
import { useCourseStore } from 'src/stores/course';
const { destroyCourse } = useCourseStore()
const props = defineProps(['isDeleteDialogShow', 'course'])
const emit = defineEmits(['successDelete', 'closeDeleteDialog'])

const dialog = computed(() => props.isDeleteDialogShow);
const deleteLoading = ref(false);
const deleteCourse = async () => {
  try {
    deleteLoading.value = true
    await destroyCourse(props.course.id)
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
