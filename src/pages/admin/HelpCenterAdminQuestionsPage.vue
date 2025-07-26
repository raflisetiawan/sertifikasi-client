<template>
    <q-page padding>
        <div class="text-h4 text-primary q-mb-md">Pengelolaan Pertanyaan Peserta - Pusat Bantuan</div>
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
                                <span class="text-weight-bold">Jawaban:</span>
                                <div v-html="q.answer"></div>
                            </div>
                            <div v-else class="q-mt-sm">
                                <q-input v-model="q._answer" label="Jawab pertanyaan ini" type="textarea" />
                                <q-btn color="primary" label="Kirim Jawaban" class="q-mt-sm" @click="submitAnswer(q)"
                                    :loading="q._loading" />
                            </div>
                        </q-item-section>
                    </q-item>
                    <q-item v-if="questions.length === 0">
                        <q-item-section>Tidak ada pertanyaan peserta.</q-item-section>
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

interface Question {
    id: number;
    question: string;
    answer: string;
    status: string;
    created_at: string;
    _answer?: string;
    _loading?: boolean;
}

const questions = ref<Question[]>([]);

const fetchQuestions = async () => {
    try {
        const res = await api.get('/help-center/questions', {
            headers: { Authorization: `Bearer ${qCookies.get('token')}` }
        });
        questions.value = res.data.data.map((q: Question) => ({ ...q, _answer: '', _loading: false }));
    } catch (e) {
        useNotify('Gagal memuat pertanyaan peserta', 'negative');
    }
};

const submitAnswer = async (q: Question) => {
    if (!q._answer) return;
    q._loading = true;
    try {
        await api.post(`/help-center/questions/${q.id}/answer`, { answer: q._answer }, {
            headers: { Authorization: `Bearer ${qCookies.get('token')}` }
        });
        useNotify('Jawaban berhasil dikirim', 'positive');
        q.answer = q._answer;
        q.status = 'answered';
        q._answer = '';
    } catch (e) {
        useNotify('Gagal mengirim jawaban', 'negative');
    } finally {
        q._loading = false;
    }
};

onMounted(fetchQuestions);
</script>
