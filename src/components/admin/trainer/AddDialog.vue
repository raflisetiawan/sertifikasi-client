<template>
  <div>
    <q-dialog v-model="$state.addDialog" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card>
        <q-card-section class="bg-primary text-white">
          <div class="row justify-between">
            <div class="col-6">
              <div class="text-h6">Tambah Trainer</div>
            </div>
            <div class="col-1">
              <q-btn dense flat icon="close" v-close-popup>
                <q-tooltip class="bg-white text-primary">Close</q-tooltip>
              </q-btn>
            </div>
          </div>

        </q-card-section>
        <q-separator></q-separator>
        <q-form @submit="onSubmit" enctype="multipart/form-data">
          <q-card-section class="q-pt-none">
            <div class="row">
              <div class="col-md-4 col-sm-6 col-xs-12">
                <q-input v-model="formDialog.name" class="q-my-md q-mr-md" label="Nama" outlined type="text"
                  :error="v$.name.$error" :error-message="v$.name.$errors.map((e) => e.$message).join()"
                  @input="v$.name.$touch" @blur="v$.name.$touch" />
              </div>
              <div class="col-md-4 col-sm-6 col-xs-12">
                <q-input v-model="formDialog.email" class="q-my-md q-mr-md" label="Email" outlined type="text"
                  :error="v$.email.$error" :error-message="v$.email.$errors.map((e) => e.$message).join()"
                  @input="v$.email.$touch" @blur="v$.email.$touch" />
              </div>
              <div class="col-md-4 col-sm-6 col-xs-12">
                <q-input v-model="formDialog.qualification" class="q-my-md q-mr-md" label="Kualifikasi" outlined
                  placeholder="SEO Specialist" type="text" :error="v$.qualification.$error"
                  :error-message="v$.qualification.$errors.map((e) => e.$message).join()" @input="v$.qualification.$touch"
                  @blur="v$.qualification.$touch" />
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 col-sm-8 col-xs-12">
                <q-file hint="ukuran max 2mb" :filter="checkFileSize" outlined v-model="formDialog.image"
                  accept=".jpg, image/*" counter use-chips label="Upload gambar" @rejected="onRejected" />
              </div>
            </div>
            <div class="text-body1">Deskripsi</div>

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
            <div class="q-ml-md text-body2 text-red-8" v-if="v$.description.$error">{{ v$.description.$errors.map((e) =>
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
import { useTrainerStore } from 'src/stores/trainer';
import { ref } from 'vue';
import { useVuelidate } from '@vuelidate/core'
import { useEmail, useRequired } from 'src/composables/validators';
import { useNotify } from 'src/composables/notifications';
import { QRejectedEntry, useQuasar } from 'quasar';

const { notify } = useQuasar()
const { $state, addTrainer } = useTrainerStore();
const loading = ref(false)
const formDialog = ref({
  name: '',
  qualification: '',
  description: '',
  image: null,
  email: '',
})

const rules = {
  name: { required: useRequired() },
  email: { required: useRequired(), email: useEmail() },
  qualification: { required: useRequired() },
  description: { required: useRequired() },
}

const v$ = useVuelidate(rules, formDialog.value)

const onSubmit = async () => {
  if (!v$.value.$invalid) {
    try {
      loading.value = true;
      await addTrainer(formDialog.value)
      $state.addDialog = false
    } catch (error) {
      useNotify('terjadi masalah', 'red')
      throw error;
    } finally {
      loading.value = false
    }
  } else {
    v$.value.$touch()
  }
}

const onRejected = (rejectedEntries: QRejectedEntry[]) => {
  notify({
    type: 'negative',
    message: `${rejectedEntries.length} file(s) did not pass validation constraints`
  })
}

const checkFileSize = (files: readonly unknown[] | FileList): readonly unknown[] => {
  const fileList = Array.from(files);
  return fileList.filter(file => (file instanceof File) && file.size < 2e+6);
};

</script>

<style scoped></style>
