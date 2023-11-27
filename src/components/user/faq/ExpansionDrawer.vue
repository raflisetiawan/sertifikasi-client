<template>
  <div class="q-pa-md">
    <div class="text-h5 q-mb-lg">Pertanyaan yang sering di tanyakan (FAQ)</div>
    <q-list bordered class="rounded-borders">
      <template v-for="(faq, index) in faqs" :key="faq.id">
        <q-expansion-item expand-separator group="faq" :default-opened="index === 0 ? true : false">
          <template v-slot:header>
            <div class="text-h6">{{ faq.question }}</div>
          </template>
          <q-card>
            <q-card-section>
              <div class="text-body1" v-html="faq.answer">
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </template>
    </q-list>
  </div>
</template>

<script setup lang="ts" async>
import { Faqs } from 'src/models/faq';
import { useFaqStore } from 'src/stores/faq';
import { ref } from 'vue';

const { $state, setFaqs } = useFaqStore();
const faqs = ref<Faqs[]>([])

if ($state.faqs.length !== 0) {
  faqs.value = $state.faqs;
} else {
  await setFaqs();
  faqs.value = $state.faqs
}
</script>

<style scoped></style>
