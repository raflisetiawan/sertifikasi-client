<template>
  <div class="q-pa-md">
    <div class="text-h6 text-center q-mb-md">Modul Pembelajaran</div>
    <q-list bordered separator>
      <q-expansion-item v-for="module in modules" :key="module.id" :icon="getModuleIcon(module.type)" expand-separator
        group="modules" class="module-item">
        <template v-slot:header>
          <!-- Thumbnail Section -->
          <q-item-section side>
            <q-img :src="module.thumbnail_url" style="width: 120px; height: 80px" fit="cover" class="rounded-borders" />
          </q-item-section>

          <!-- Content Section -->
          <q-item-section>
            <div class="text-h6">{{ module.title }}</div>
            <div class="text-subtitle2">{{ module.subtitle }}</div>
            <div class="row items-center q-gutter-x-md q-mt-sm">
              <q-chip :color="getModuleTypeColor(module.type)" text-color="white" class="text-caption">
                {{ getModuleTypeLabel(module.type) }}
              </q-chip>
              <q-badge color="primary" class="text-body2">
                {{ module.estimated_time_min }} menit
              </q-badge>
            </div>
          </q-item-section>
        </template>

        <q-card flat bordered>
          <q-card-section>
            <!-- Description Section -->
            <div class="text-h6 q-mb-md">Deskripsi</div>
            <div v-html="module.description" class="text-body1 q-mb-lg"></div>

            <!-- Concepts Section -->
            <div v-if="module.concepts?.length > 0" class="q-mb-lg">
              <div class="text-h6 q-mb-md">Konsep</div>
              <q-list separator>
                <q-item v-for="concept in module.concepts" :key="concept.id">
                  <q-item-section avatar>
                    <q-avatar color="primary" text-color="white">
                      {{ concept.order }}
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-body1">{{ concept.title }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>

            <!-- Exercises Section -->
            <div v-if="module.exercises?.length > 0">
              <div class="text-h6 q-mb-md">Latihan</div>
              <q-list separator>
                <q-item v-for="exercise in module.exercises" :key="exercise.id">
                  <q-item-section avatar>
                    <q-avatar color="secondary" text-color="white">
                      {{ exercise.order }}
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <div v-html="exercise.description" class="text-body1"></div>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import { Module } from 'src/models/course';

const props = defineProps<{
  modules: Module[];
}>();

const getModuleIcon = (type: string) => {
  switch (type) {
    case 'prework':
      return 'assignment';
    case 'module':
      return 'school';
    case 'final':
      return 'star';
    default:
      return 'article';
  }
};

const getModuleTypeColor = (type: string) => {
  switch (type) {
    case 'prework':
      return 'blue';
    case 'module':
      return 'green';
    case 'final':
      return 'purple';
    default:
      return 'grey';
  }
};

const getModuleTypeLabel = (type: string) => {
  switch (type) {
    case 'prework':
      return 'Pra-kerja';
    case 'module':
      return 'Modul';
    case 'final':
      return 'Final';
    default:
      return type;
  }
};
</script>

<style lang="scss" scoped>
.module-item {
  margin-bottom: 8px;
  border-radius: 4px;

  &:hover {
    background: #f5f5f5;
  }
}

.module-item {
  margin-bottom: 16px;
  border-radius: 8px;

  :deep(.q-expansion-item__container) {
    background: white;
  }

  :deep(.q-item) {
    padding: 16px;
  }

  :deep(.q-card) {
    margin: 0 16px 16px 16px;
  }

  &:hover {
    background: #f5f5f5;
    transition: background-color 0.3s ease;
  }
}

// Add responsive padding
@media (max-width: 599px) {
  .module-item {
    :deep(.q-card) {
      margin: 0 8px 8px 8px;
    }

    :deep(.q-item) {
      padding: 8px;
    }
  }
}
</style>
