import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { qCookies } from 'src/boot/cookies';
import { Registrant, DetailRegistration } from 'src/models/course-registrant';
import { AxiosResponse } from 'axios';

export const useCourseRegistrantStore = defineStore('course-registrant', {
  state: () => ({
    registrants: [] as Registrant[],
  }),

  actions: {
    async getAllCourseRegistrants() {
      const response = await api.get('course-registrant', {
        headers: {
          Authorization: `Bearer ${qCookies.get('token')}`,
        },
      });

      this.registrants = response.data.data;
    },

    async getCourseRegistrant(
      id: string | string[]
    ): Promise<DetailRegistration> {
      const response: AxiosResponse = await api.get('course-registrant/' + id, {
        headers: {
          Authorization: `Bearer ${qCookies.get('token')}`,
        },
      });
      return response.data;
    },
  },
});
