import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import {
  UpdateCourseForm,
  Courses,
  CreateCourseForm,
  CourseTable,
  CourseDetail,
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
    async storeCourse(data: CreateCourseForm) {
      await api.post('course', data, {
        headers: {
          Authorization: 'Bearer ' + qCookies.get('token'),
          'Content-Type': 'multipart/form-data',
        },
      });
      await this.setCourses();
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
    async getCourseForTable(): Promise<CourseTable[]> {
      const response = await api.get('courses', {
        headers: {
          Authorization: 'Bearer ' + qCookies.get('token'),
        },
      });

      return response.data.data;
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
  },
});
