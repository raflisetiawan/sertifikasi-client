<template>
  <div>
    <!-- Key Concepts Section -->
    <section id="key-concept">
      <div class="row q-mt-lg justify-center">
        <div class="col-md-2 col-sm-3 col-xs-4">
          <div class="text-h6 text-center">Konsep Utama</div>
        </div>
      </div>
      <div class="row justify-center q-mt-md q-mb-md">
        <div class="col-md-10 col-sm-9 col-xs-8">
          <div class="row q-col-gutter-md">
            <div v-for="(concept, index) in parsedKeyConcepts" :key="index" class="col-12 col-sm-6">
              <q-card class="concept-card">
                <q-card-section class="row items-center no-wrap">
                  <q-icon name="school" color="primary" size="sm" class="q-mr-sm" />
                  <div class="text-body1">{{ concept }}</div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps(['course']);

const parsedKeyConcepts = computed(() => {
  if (!props.course?.key_concepts) return [];

  if (Array.isArray(props.course.key_concepts)) {
    return props.course.key_concepts;
  }

  try {
    return JSON.parse(props.course.key_concepts);
  } catch {
    return [];
  }
});
</script>

<style scoped>
.concept-card {
  background: #f5f5f5;
  transition: transform 0.2s;
}

.concept-card:hover {
  transform: translateY(-2px);
  background: #e3f2fd;
}
</style>
