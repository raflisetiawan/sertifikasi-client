<template>
  <div>
    <q-dialog v-model="zoomLinkState.addZoomDialog" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Buat Link Zoom</div>
        </q-card-section>
        <q-form @submit="onSubmit">
          <q-card-section class="q-pt-none">
            <q-input dense v-model="zoomForm.link" autofocus outlined type="text" :error="v$.link.$error"
              :error-message="v$.link.$errors.map((e) => e.$message).join()" @input="v$.link.$touch"
              @blur="v$.link.$touch">
              <template v-slot:prepend><q-icon name="link"></q-icon></template>
            </q-input>
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn color="primary" label="Buat" type="submit" :loading="loading" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { useRequired, useUrl } from 'src/composables/validators';
import { ref } from 'vue';
import { useNotify } from 'src/composables/notifications';
import { useZoomLinkStore } from 'src/stores/zoomLink';

const { $state: zoomLinkState, addZoomLink } = useZoomLinkStore()
const zoomForm = ref({
  link: ''
});

const rules = {
  link: { required: useRequired(), url: useUrl() },
}

const v$ = useVuelidate(rules, zoomForm.value)
const emit = defineEmits(['getCourses'])

const loading = ref(false);
const onSubmit = async () => {
  if (!v$.value.$invalid) {
    try {
      loading.value = true;
      await addZoomLink(zoomForm.value.link)
      emit('getCourses');
    } catch (error) {
      useNotify('terjadi masalah', 'red')
      throw error;
    } finally {
      loading.value = false
      zoomLinkState.addZoomDialog = false;
    }
  } else {
    v$.value.$touch()
  }
}
</script>

<style scoped></style>
