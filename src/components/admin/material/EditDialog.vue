<template>
  <div>
    <q-dialog v-model="$state.editDialog" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card>
        <q-card-section class="bg-primary text-white">
          <div class="row justify-between">
            <div class="col-6">
              <div class="text-h6">Edit Materi</div>
            </div>
            <div class="col-1">
              <q-btn dense flat icon="close" v-close-popup>
                <q-tooltip class="bg-white text-primary">Close</q-tooltip>
              </q-btn>
            </div>
          </div>

        </q-card-section>
        <q-separator></q-separator>
        <q-form @submit="onSubmit">
          <q-card-section class="q-pt-none">
            <q-input v-model="formDialog.title" class="q-my-md" label="Judul materi" outlined type="text"
              :error="v$.title.$error" :error-message="v$.title.$errors.map((e) => e.$message).join()"
              @input="v$.title.$touch" @blur="v$.title.$touch" />
            <div class="col-md-6 col-sm-8 col-xs-12">
              <q-file hint="ukuran max 20mb" :filter="checkFileSize" outlined v-model="formDialog.file"
                accept=".pdf, .docx" counter use-chips label="Upload file materi pdf" @rejected="onRejected">
                <template v-slot:default><q-btn :href="$state.material.file" dense class="q-mb-md" target="_blank">Lihat
                    dokumen
                    PDF sebelumnya</q-btn></template>
              </q-file>
            </div>
            <div class="text-body1 q-mt-md">Deskripsi</div>

            <q-editor v-model="formDialog.description" :dense="$q.screen.lt.md" :toolbar="[
              [
                {
                  label: $q.lang.editor.align,
                  icon: $q.iconSet.editor.align,
                  fixedLabel: true,
                  list: 'only-icons',
                  options: ['left', 'center', 'right', 'justify']
                },
                {
                  label: $q.lang.editor.align,
                  icon: $q.iconSet.editor.align,
                  fixedLabel: true,
                  options: ['left', 'center', 'right', 'justify']
                }
              ],
              ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
              ['token', 'hr', 'link', 'custom_btn'],
              ['print', 'fullscreen'],
              [
                {
                  label: $q.lang.editor.formatting,
                  icon: $q.iconSet.editor.formatting,
                  list: 'no-icons',
                  options: [
                    'p',
                    'h1',
                    'h2',
                    'h3',
                    'h4',
                    'h5',
                    'h6',
                    'code'
                  ]
                },
                {
                  label: $q.lang.editor.fontSize,
                  icon: $q.iconSet.editor.fontSize,
                  fixedLabel: true,
                  fixedIcon: true,
                  list: 'no-icons',
                  options: [
                    'size-1',
                    'size-2',
                    'size-3',
                    'size-4',
                    'size-5',
                    'size-6',
                    'size-7'
                  ]
                },
                {
                  label: $q.lang.editor.defaultFont,
                  icon: $q.iconSet.editor.font,
                  fixedIcon: true,
                  list: 'no-icons',
                  options: [
                    'default_font',
                    'arial',
                    'arial_black',
                    'comic_sans',
                    'courier_new',
                    'impact',
                    'lucida_grande',
                    'times_new_roman',
                    'verdana'
                  ]
                },
                'removeFormat'
              ],
              ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

              ['undo', 'redo'],
              ['viewsource']
            ]" :fonts="{
  arial: 'Arial',
  arial_black: 'Arial Black',
  comic_sans: 'Comic Sans MS',
  courier_new: 'Courier New',
  impact: 'Impact',
  lucida_grande: 'Lucida Grande',
  times_new_roman: 'Times New Roman',
  verdana: 'Verdana'
}" />
            <div class="q-ml-md text-body2 text-red-8" v-if="v$.description.$error">{{ v$.title.$errors.map((e) =>
              e.$message).join()
            }}</div>
          </q-card-section>

          <q-card-actions>
            <q-btn label="SUBMIT" color="primary" type="submit" :loading="loading" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { useMaterialStore } from 'src/stores/material';
import { ref, watchEffect } from 'vue';
import { useVuelidate } from '@vuelidate/core'
import { useRequired } from 'src/composables/validators';
import { useQuasar } from 'quasar';
import { QRejectedEntry } from 'quasar';
import { MaterialForm } from 'src/models/material';
import { useNotify } from 'src/composables/notifications';
import { useRoute } from 'vue-router';

const { $state, updateMaterial } = useMaterialStore();
const loading = ref(false)
const route = useRoute();
const formDialog = ref<MaterialForm>({
  title: '',
  description: '',
  file: [],
})

const { notify } = useQuasar();

const rules = {
  title: { required: useRequired() },
  description: { required: useRequired() }
}

const v$ = useVuelidate(rules, formDialog.value)

const onSubmit = async () => {
  if (!v$.value.$invalid) {
    try {
      loading.value = true;
      await updateMaterial({ ...formDialog.value, course_id: $state.material.course_id, _method: 'PATCH' }, $state.material.id, route.params.id);
      $state.editDialog = false
    } catch (error) {
      useNotify('terjadi masalah', 'red')
      throw error;
    } finally {
      loading.value = false
      formDialog.value.title = ''
      formDialog.value.description = ''
      formDialog.value.file = []
    }
  } else {
    v$.value.$touch()
  }
}

const checkFileSize = (files: readonly unknown[] | FileList): readonly unknown[] => {
  const fileList = Array.from(files);
  return fileList.filter(file => (file instanceof File) && file.size < 20e+6);
};

const onRejected = (rejectedEntries: QRejectedEntry[]) => {
  notify({
    type: 'negative',
    message: `${rejectedEntries.length} file(s) did not pass validation constraints`
  })
}

watchEffect(() => {
  formDialog.value.title = $state.material.title
  formDialog.value.description = $state.material.description
})

</script>

<style scoped></style>
