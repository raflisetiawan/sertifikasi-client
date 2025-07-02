<template>
  <q-card class="q-mb-md">
    <q-card-section>
      <div class="text-subtitle1">Informasi Pendaftaran</div>
      <q-list>
        <q-item>
          <q-item-section>
            <q-item-label caption>Tanggal Daftar</q-item-label>
            <q-item-label>{{ formatDate(registeredAt) }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label caption>Status Verifikasi</q-item-label>
            <q-item-label>
              <q-chip :color="verification ? 'positive' : 'warning'" text-color="white">
                {{ verification ? 'Terverifikasi' : 'Belum Terverifikasi' }}
              </q-chip>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="verifiedAt">
          <q-item-section>
            <q-item-label caption>Tanggal Verifikasi</q-item-label>
            <q-item-label>{{ formatDate(verifiedAt) }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { useFormatters } from 'src/composables/useFormatters';

defineProps({
  registeredAt: { type: String, required: true },
  verification: { type: Boolean, required: true },
  verifiedAt: { type: String as PropType<string | null>, default: null },
});

const { formatDate } = useFormatters();
</script>
