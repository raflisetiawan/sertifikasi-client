<template>
  <q-page padding>
    <div class="text-h4 text-primary q-mb-md">Pusat Bantuan</div>
    <div v-if="isLoggedIn" class="q-mb-md">
      <q-btn color="secondary" icon="history" label="Riwayat Pertanyaan Saya"
        :to="{ name: 'dashboard.help.my-questions' }" />
    </div>
    <q-card class="q-mb-lg">
      <q-card-section>
        <div class="text-h6">Daftar Pertanyaan Umum</div>
        <q-list>
          <q-expansion-item v-for="faq in faqs" :key="faq.id" :label="faq.question">
            <div v-html="faq.answer"></div>
          </q-expansion-item>
        </q-list>
      </q-card-section>
    </q-card>
    <q-card v-if="isLoggedIn">
      <q-card-section>
        <div class="text-h6">Kirim Pertanyaan ke Pusat Bantuan</div>
        <q-form @submit.prevent="submitQuestion">
          <q-input v-model="question" label="Tulis pertanyaan Anda" type="textarea" :disable="loading" required />
          <q-btn type="submit" color="primary" label="Kirim" :loading="loading" class="q-mt-md" />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from 'src/boot/axios';
import { qCookies } from 'src/boot/cookies';
import { useNotify } from 'src/composables/notifications';

const faqs = ref<Array<{ id: number; question: string; answer: string }>>([]);
const question = ref('');
const loading = ref(false);
const isLoggedIn = !!qCookies.get('token');

const fetchFaqs = async () => {
  try {
    const res = await api.get('/help-center');
    faqs.value = res.data.data;
  } catch (e) {
    useNotify('Gagal memuat FAQ', 'negative');
  }
};

const submitQuestion = async () => {
  if (!question.value) return;
  loading.value = true;
  try {
    await api.post('/help-center/questions', { question: question.value }, {
      headers: { Authorization: `Bearer ${qCookies.get('token')}` }
    });
    useNotify('Pertanyaan Anda telah dikirim.', 'positive');
    question.value = '';
  } catch (e) {
    useNotify('Gagal mengirim pertanyaan', 'negative');
  } finally {
    loading.value = false;
  }
};

onMounted(fetchFaqs);
</script>

<style scoped>
.q-expansion-item__container {
  background: #fafbfc;
}
</style>
