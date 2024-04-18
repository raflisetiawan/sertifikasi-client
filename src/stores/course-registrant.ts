import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { qCookies } from 'src/boot/cookies';
import { Registrant, DetailRegistration } from 'src/models/course-registrant';
import { AxiosResponse } from 'axios';
import { CourseIdAndNames } from 'src/models/course';

export const useCourseRegistrantStore = defineStore('course-registrant', {
  state: () => ({
    registrants: [] as Registrant[],
  }),

  actions: {
    async getAllCourseRegistrants(
      courseId?: number | null,
      date?: string,
      verification?: boolean,
      user_email?: string
    ) {
      const response = await api.get('course-registrant', {
        headers: {
          Authorization: `Bearer ${qCookies.get('token')}`,
        },
        params: {
          course_id: courseId,
          date,
          verification,
          user_email,
        },
      });

      this.registrants = response.data.data;
    },

    async getAllCourseIdAndName(): Promise<CourseIdAndNames[]> {
      const response = await api.get('courses/name-and-id', {
        headers: {
          Authorization: `Bearer ${qCookies.get('token')}`,
        },
      });
      return response.data.data;
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
