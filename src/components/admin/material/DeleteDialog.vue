<template>
  <div>
    <q-dialog v-model="$state.deleteDialog" persistent>
      <q-card>
        <q-form @submit="onSubmit">
          <q-card-section class="row items-center">
            <q-avatar icon="delete" color="primary" text-color="white" />
            <span class="q-ml-sm">Yakin menghapus {{ $state.material.title }} ?</span>
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
import { useMaterialStore } from 'src/stores/material';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();

const { $state, deleteMaterial } = useMaterialStore()
const loading = ref(false)
const onSubmit = async () => {
  try {
    loading.value = true;
    await deleteMaterial($state.material.id, route.params.id);
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
