<template>
  <div id="course-page">
    <q-ajax-bar ref="bar" color="pink-11" position="top" size="5px" skip-hijack />
    <div class="banner">
      <q-img src="~/assets/Daftar-Kelas-polos.svg" fit="cover" position="center" height="200px">
        <div class="absolute-center bg-transparent">
          <div class="text-h4 text-white text-center">Daftar Kelas</div>
          <q-separator size="5px" class="q-mt-md" color="primary"></q-separator>
          <div class="text-body1 q-mt-md text-center">Daftar kelas yang bisa anda ikuti :</div>
        </div>
      </q-img>
    </div>
    <div class="container q-pa-md">
      <!-- Search and Sort Controls -->
      <div class="row q-my-md q-gutter-md justify-center">
        <div class="col-12 col-md-6">
          <q-input dense outlined v-model="searchTerm" placeholder="Cari nama kursus...">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-3">
          <q-select dense outlined v-model="sortBy" :options="sortOptions" label="Urutkan Berdasarkan" />
        </div>
      </div>

      <Suspense>
        <CourseCard :courses="filteredCourses" />
        <template #fallback>
          <CourseCardSkeleton />
        </template>
      </Suspense>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMetaTitle } from 'src/composables/meta';
import { defineAsyncComponent, ref, computed, onMounted } from 'vue';
import CourseCardSkeleton from 'components/user/course/CourseCardSkeleton.vue'
import { useCourseStore } from 'src/stores/course';
import { Courses } from 'src/models/course';

useMetaTitle('Kelas')

const bar = ref();
const courseStore = useCourseStore();

const searchTerm = ref('');
const sortBy = ref({ label: 'Terbaru', value: 'newest' });
const sortOptions = [
  { label: 'Terbaru', value: 'newest' },
  { label: 'Nama (A-Z)', value: 'name-asc' },
  { label: 'Nama (Z-A)', value: 'name-desc' },
];

onMounted(async () => {
  if (!courseStore.courses) {
    await courseStore.setCourses();
  }
});

const filteredCourses = computed(() => {
  let courses: Courses[] = courseStore.courses || [];

  // Search filter
  if (searchTerm.value) {
    courses = courses.filter(course =>
      course.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
  }

  // Sort
  switch (sortBy.value.value) {
    case 'name-asc':
      courses.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      courses.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'newest':
    default:
      // API already returns by newest, but we can re-sort if needed
      courses.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });
      break;
  }

  return courses;
});


const CourseCard = defineAsyncComponent(() => import('components/user/course/CourseCard.vue'))

</script>

<style scoped></style>
