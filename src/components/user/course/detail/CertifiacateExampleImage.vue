<template>
  <div class="q-pa-md">
    <div class="text-h6 text-center q-mb-md">Benefit yang didapatkan</div>
    <div v-if="!isLoading && courseBenefits.length">
      <div class="row q-col-gutter-md justify-center">
        <div v-for="benefit in courseBenefits" :key="benefit.id" class="col-12 col-sm-6 col-md-4">
          <q-card class="benefit-card">
            <q-img :src="benefit.gambar" spinner-color="primary" style="height: 200px" fit="contain" />
            <q-card-section>
              <div class="text-h6">{{ benefit.judul }}</div>
              <div class="text-subtitle2">{{ benefit.deskripsi }}</div>
              <div class="text-body2">{{ benefit.diperoleh_melalui }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
    <div v-else-if="isLoading" class="text-center q-pa-md">
      <q-spinner color="primary" size="3em" />
      <div class="text-subtitle1 q-mt-sm">Loading benefits...</div>
    </div>
    <div v-else class="text-center q-pa-md">
      <div class="text-subtitle1">No benefits available</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CourseBenefitExample } from 'src/models/course-benefit';
import { useCourseStore } from 'src/stores/course';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const courseStore = useCourseStore();
const route = useRoute();
const isLoading = ref(true);
const courseBenefits = ref<CourseBenefitExample[]>([]);

const loadBenefits = async () => {
  try {
    isLoading.value = true;
    courseBenefits.value = await courseStore.getCourseBenefitByCourseId(route.params.id);
  } catch (error) {
    console.error('Error fetching course benefits:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadBenefits();
});
</script>

<style scoped>
.benefit-card {
  height: 100%;
  transition: transform 0.2s;
}

.benefit-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 599px) {
  .benefit-card {
    margin-bottom: 16px;
  }
}
</style>
