import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { UpdateCourseForm, Courses, CreateCourseForm } from 'src/models/course';
import { LocalStorage } from 'quasar';
import { AxiosResponse } from 'axios';

export const useCourseStore = defineStore('course', {
  state: () => ({
    courses: null as Courses[] | null,
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
          Authorization: 'Bearer ' + LocalStorage.getItem('token'),
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
          Authorization: 'Bearer ' + LocalStorage.getItem('token'),
          'Content-Type': 'multipart/form-data',
        },
      });
      await this.setCourses();
    },

    async destroyCourse(id: number) {
      await api.delete(`course/${id}`, {
        headers: {
          Authorization: 'Bearer ' + LocalStorage.getItem('token'),
        },
      });
      await this.setCourses();
    },
  },
});
