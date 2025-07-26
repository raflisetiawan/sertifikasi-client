import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import {
  Courses,
  CourseForm,
  CourseTable,
  CourseDetail,
  CourseIdAndNames,
  CourseForUpdate,
} from 'src/models/course';
import { qCookies } from 'src/boot/cookies';
import { AxiosError, AxiosResponse } from 'axios';
import { CourseBenefitExample } from 'src/models/course-benefit';

export const useCourseStore = defineStore('course', {
  state: () => ({
    courses: null as Courses[] | null,
    course: null as CourseForUpdate | null,
    showEditStatusDialog: false,
    editedStatusDialog: 0,
    showUploadCertificateTemplateDialog: false,
    uploadedCerticiateTemplateDialogId: 0,
    addModuleDialog: false,
    publicationErrors: [] as string[],
  }),
  getters: {
    getCourses: (state) => state.courses,
    getCourse: (state) => state.course,
  },
  actions: {
    async setCourses() {
      const response = await api.get('course');
      this.courses = response.data.data;
    },
    async storeCourse(data: CourseForm): Promise<Courses> {
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
    async showCourseAdmin(id: string | string[] | number): Promise<void> {
      const response = await api.get(`course/admin/${id}`);
      this.course = response.data.data;
    },

    async updateCourse(id: string | string[] | number, data: CourseForm) {
      const formData = new FormData();

      // Append fields to FormData
      Object.entries(data).forEach(([key, value]) => {
        if (value === null || value === undefined) return;

        if (key === 'live_sessions' && Array.isArray(value)) {
          value.forEach((session, index) => {
            Object.entries(session).forEach(([sessionKey, sessionValue]) => {
              if (sessionValue !== null && sessionValue !== undefined) {
                formData.append(
                  `live_sessions[${index}][${sessionKey}]`,
                  sessionValue as string
                );
              }
            });
          });
        } else if (
          [
            'key_concepts',
            'facility',
            'trainer_ids',
            'trainer_selected',
          ].includes(key) &&
          Array.isArray(value)
        ) {
          value.forEach((item) => {
            formData.append(`${key}[]`, item);
          });
        } else if (value instanceof File) {
          formData.append(key, value, value.name);
        } else if (typeof value === 'number') {
          formData.append(key, value.toString());
        } else {
          formData.append(key, value as string);
        }
      });

      formData.append('_method', 'PUT');

      await api.post(`course/${id}`, formData, {
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
      if (status === 'published') {
        this.publicationErrors = []; // Reset errors
        const courseNames =
          this.courses?.filter((c) => ids.includes(c.id)).map((c) => c.name) ??
          [];

        for (let i = 0; i < ids.length; i++) {
          const id = ids[i];
          const name = courseNames[i] || `ID ${id}`;
          try {
            await this.publishCourse(id);
          } catch (error) {
            const axiosError = error as AxiosError<{ errors: string[] }>;
            if (
              axiosError.response?.status === 422 &&
              axiosError.response?.data?.errors
            ) {
              const errorMessages = axiosError.response.data.errors.map(
                (msg) => `[${name}] ${msg}`
              );
              this.publicationErrors.push(...errorMessages);
            } else {
              this.publicationErrors.push(
                `Gagal mempublikasikan kursus ${name}.`
              );
            }
          }
        }

        if (this.publicationErrors.length > 0) {
          throw new Error('Beberapa kursus gagal dipublikasikan.');
        }
      } else {
        await api.post(
          'admin/courses/bulk-update-status',
          { ids, status },
          {
            headers: {
              Authorization: 'Bearer ' + qCookies.get('token'),
            },
          }
        );
      }
    },
    async publishCourse(courseId: number) {
      return await api.post(
        `/api/admin/course/${courseId}/publish`,
        {},
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
