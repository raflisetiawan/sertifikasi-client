import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { api } from 'src/boot/axios';
import { qCookies } from 'src/boot/cookies';
import { CourseDetail } from 'src/models/dashboard';

export function useCourseDetail() {
  const route = useRoute();
  const loading = ref(true);
  const error = ref<string | null>(null);
  const courseDetail = ref<CourseDetail | null>(null);

  const fetchCourseDetail = async () => {
    try {
      loading.value = true;
      error.value = null;
      const response = await api.get<{ data: CourseDetail }>(`/user/courses/${route.params.id}`, {
        headers: {
          Authorization: `Bearer ${qCookies.get('token')}`
        }
      });
      courseDetail.value = response.data.data;
    } catch (err) {
      error.value = 'Gagal memuat detail kelas';
      console.error('Error fetching course detail:', err);
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    fetchCourseDetail();
  });

  return {
    courseDetail,
    loading,
    error,
    fetchCourseDetail
  };
}
