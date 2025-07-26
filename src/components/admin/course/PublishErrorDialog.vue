<template>
  <q-dialog :model-value="show" @update:model-value="$emit('update:show', $event)">
    <q-card style="width: 500px; max-width: 90vw;">
      <q-card-section>
        <div class="text-h6">Error Publikasi Kursus</div>
        <q-icon name="warning" color="negative" size="2em" class="q-mr-sm" />
        <span>Beberapa kursus tidak dapat dipublikasikan karena tidak memenuhi syarat.</span>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-list bordered separator>
          <q-item v-for="(error, index) in errors" :key="index">
            <q-item-section>
              <q-item-label overline>ERROR</q-item-label>
              <q-item-label>{{ error }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Tutup" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean;
  errors: string[];
}>();

defineEmits(['update:show']);
</script>
