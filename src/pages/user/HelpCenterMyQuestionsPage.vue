<template>
    <q-page padding>
        <div class="text-h4 text-primary q-mb-md">Riwayat Pertanyaan Saya</div>
        <q-card>
            <q-card-section>
                <q-list>
                    <q-item v-for="q in questions" :key="q.id">
                        <q-item-section>
                            <div class="text-subtitle1">{{ q.question }}</div>
                            <div class="text-caption text-grey-7">Dikirim: {{ q.created_at }}</div>
                            <div class="q-mt-sm">
                                <q-badge :color="q.status === 'answered' ? 'positive' : 'warning'">
                                    {{ q.status === 'answered' ? 'Sudah Dijawab' : 'Menunggu Jawaban' }}
                                </q-badge>
                            </div>
                            <div v-if="q.answer" class="q-mt-sm bg-grey-2 q-pa-sm rounded-borders">
                                <span class="text-weight-bold">Jawaban Admin:</span>
                                <div v-html="q.answer"></div>
                            </div>
                        </q-item-section>
                    </q-item>
                    <q-item v-if="questions.length === 0">
                        <q-item-section>Tidak ada pertanyaan yang pernah dikirim.</q-item-section>
                    </q-item>
                </q-list>
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from 'src/boot/axios';
import { qCookies } from 'src/boot/cookies';
import { useNotify } from 'src/composables/notifications';

const questions = ref<Array<{ id: number; question: string; answer: string; status: string; created_at: string }>>([]);

const fetchQuestions = async () => {
    try {
        const res = await api.get('/help-center/my-questions', {
            headers: { Authorization: `Bearer ${qCookies.get('token')}` }
        });
        questions.value = res.data.data;
    } catch (e) {
        useNotify('Gagal memuat riwayat pertanyaan', 'negative');
    }
};

onMounted(fetchQuestions);
</script>
