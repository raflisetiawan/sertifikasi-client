<template>
  <div>
    <q-dialog v-model="$state.addDialog" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card>
        <q-card-section class="bg-primary text-white">
          <div class="row justify-between">
            <div class="col-6">
              <div class="text-h6">Buat FAQ</div>
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
            <q-input v-model="formDialog.question" class="q-my-md" label="Pertanyaan" outlined type="text"
              :error="v$.question.$error" :error-message="v$.question.$errors.map((e) => e.$message).join()"
              @input="v$.question.$touch" @blur="v$.question.$touch" />
            <q-select v-model="formDialog.category" :options="categoryOptions" label="Kategori" outlined class="q-mb-md"
              :error="v$.category.$error" :error-message="v$.category.$errors.map((e) => e.$message).join()"
              @input="v$.category.$touch" @blur="v$.category.$touch" />
            <div class="text-body1">Jawaban</div>

            <q-editor v-model="formDialog.answer" :dense="$q.screen.lt.md" :toolbar="[
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
            <div class="q-ml-md text-body2 text-red-8" v-show="v$.answer.$error">{{ v$.question.$errors.map((e) =>
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
import { useFaqStore } from 'src/stores/faq';
import { ref } from 'vue';
import { useVuelidate } from '@vuelidate/core'
import { useRequired } from 'src/composables/validators';
import { useNotify } from 'src/composables/notifications';

const { $state, addFaqs } = useFaqStore();
const loading = ref(false)
const formDialog = ref({
  question: '',
  answer: '',
  category: null as string | null,
})

const categoryOptions = ref<string[]>(['Akun', 'Pembayaran', 'Kursus', 'Teknis', 'Lain-lain']); // Example categories

const rules = {
  question: { required: useRequired() },
  answer: { required: useRequired() },
  category: { required: useRequired() }
}

const v$ = useVuelidate(rules, formDialog.value)

const onSubmit = async () => {
  if (!v$.value.$invalid) {
    try {
      loading.value = true;
      await addFaqs(formDialog.value.answer, formDialog.value.question, formDialog.value.category || '')
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

</script>

<style scoped></style>
