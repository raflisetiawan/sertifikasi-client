<template>
  <div class="q-pa-md">
    <div class="text-h5 q-mb-lg">Pertanyaan yang sering di tanyakan (FAQ)</div>
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-6">
        <q-input outlined dense v-model="searchQuery" placeholder="Cari FAQ..." clearable>
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div class="col-12 col-md-6">
        <q-select outlined dense v-model="selectedCategory" :options="categoryOptions" label="Filter Kategori" clearable>
        </q-select>
      </div>
    </div>
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
      <q-item v-if="faqs.length === 0 && !loading">
        <q-item-section class="text-grey">Tidak ada FAQ yang ditemukan.</q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import { Faqs } from 'src/models/faq';
import { useFaqStore } from 'src/stores/faq';
import { ref, watch, onMounted } from 'vue';

const { $state, setFaqs } = useFaqStore();
const faqs = ref<Faqs[]>([])
const searchQuery = ref('');
const selectedCategory = ref(null);

const categoryOptions = ref<string[]>(['Akun', 'Pembayaran', 'Kursus', 'Teknis', 'Lain-lain']); // Example categories

const fetchFaqs = async () => {
  await setFaqs(searchQuery.value, selectedCategory.value || undefined);
  faqs.value = $state.faqs;
};

watch([searchQuery, selectedCategory], () => {
  fetchFaqs();
});

onMounted(() => {
  fetchFaqs();
});
</script>

<style scoped></style>
