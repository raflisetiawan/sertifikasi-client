import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import {
  UpdateCourseForm,
  Courses,
  CreateCourseForm,
  CourseTable,
  CourseDetail,
  CourseIdAndNames,
} from 'src/models/course';
import { qCookies } from 'src/boot/cookies';
import { AxiosResponse } from 'axios';
import { CourseBenefitExample } from 'src/models/course-benefit';

export const useCourseStore = defineStore('course', {
  state: () => ({
    courses: null as Courses[] | null,
    showEditStatusDialog: false,
    editedStatusDialog: 0,
    showUploadCertificateTemplateDialog: false,
    uploadedCerticiateTemplateDialogId: 0,
    addModuleDialog: false,
  }),
  getters: {
    getCourses: (state) => state.courses,
  },
  actions: {
    async setCourses() {
      const response = await api.get('course');
      this.courses = response.data.data;
    },
    async storeCourse(data: CreateCourseForm): Promise<Courses> {
      const response = await api.post('course', data, {
        headers: {
          Authorization: 'Bearer ' + qCookies.get('token'),
          'Content-Type': 'multipart/form-data',
        },
      });
      await this.setCourses();
      return response.data.data;
    },
    async syncTrainers(courseId: number, trainerIds: number[]) {
      await api.post(
        `courses/${courseId}/trainers/sync`,
        { trainer_ids: trainerIds },
        {
          headers: {
            Authorization: 'Bearer ' + qCookies.get('token'),
          },
        }
      );
    },
    async showCourse(id: string | string[] | number): Promise<AxiosResponse> {
      const response = await api.get(`course/${id}`);
      return response.data;
    },

    async updateCourse(id: string | string[] | number, data: UpdateCourseForm) {
      await api.post(`course/${id}`, data, {
        headers: {
          Authorization: 'Bearer ' + qCookies.get('token'),
          'Content-Type': 'multipart/form-data',
        },
      });
      await this.setCourses();
    },

    async destroyCourse(id: number) {
      await api.delete(`course/${id}`, {
        headers: {
          Authorization: 'Bearer ' + qCookies.get('token'),
        },
      });
      await this.setCourses();
    },

    async getCourseNameById(id: string | string[]): Promise<string> {
      const response = await api.get(`courses/name/${id}`);
      return response.data.course_name;
    },
    async getCourseForTable(
      filters: { status?: string; start_date?: string; end_date?: string } = {}
    ): Promise<CourseTable[]> {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.start_date) params.append('start_date', filters.start_date);
      if (filters.end_date) params.append('end_date', filters.end_date);

      const response = await api.get('courses', {
        params,
        headers: {
          Authorization: 'Bearer ' + qCookies.get('token'),
        },
      });

      return response.data.data;
    },
    async bulkUpdateStatus(ids: number[], status: string) {
      await api.post(
        'admin/courses/bulk-update-status',
        { ids, status },
        {
          headers: {
            Authorization: 'Bearer ' + qCookies.get('token'),
          },
        }
      );
    },
    async bulkDelete(ids: number[]) {
      await api.post(
        'courses/bulk-delete',
        { ids },
        {
          headers: {
            Authorization: 'Bearer ' + qCookies.get('token'),
          },
        }
      );
    },
    async getCourseWithModules(id: number): Promise<CourseDetail> {
      try {
        const response = await api.get(`course/${id}/with-modules`);
        return response.data.data;
      } catch (error) {
        throw error;
      }
    },
    async getCourseBenefitByCourseId(
      id: string | string[] | number
    ): Promise<CourseBenefitExample[]> {
      const response = await api.get(`course/${id}/course_benefits`);
      return response.data.data;
    },
    async getCourseIdAndNames(): Promise<CourseIdAndNames[]> {
      const response = await api.get('courses/get/name-and-id', {
        headers: {
          Authorization: 'Bearer ' + qCookies.get('token'),
        },
      });
      return response.data.data;
    },
  },
});
