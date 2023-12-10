<template>
  <div>
    <q-dialog v-model="$state.deleteDialog" persistent>
      <q-card>
        <q-form @submit="onSubmit">
          <q-card-section class="row items-center">
            <q-avatar icon="delete" color="primary" text-color="white" />
            <span class="q-ml-sm">Yakin menghapus {{ $state.trainer.name }} ?</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn color="red" label="Hapus" type="submit" :loading="loading" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { useNotify } from 'src/composables/notifications';
import { useTrainerStore } from 'src/stores/trainer';
import { ref } from 'vue';

const { $state, deleteTrainer } = useTrainerStore()
const loading = ref(false)
const id = ref()
const onSubmit = async () => {
  id.value = $state.trainer.id
  try {
    loading.value = true;
    await deleteTrainer(id.value);
    $state.deleteDialog = false;
  } catch (error) {
    useNotify('Terjdi masalah', 'red')
    throw error;
  } finally {
    loading.value = false
  }
}
</script>

<style scoped></style>
