import { defineStore } from 'pinia';
import { qCookies } from 'src/boot/cookies';
import { api } from 'src/boot/axios';
import { RegisteredCourse } from 'src/models/course';

export const useUserCourse = defineStore('userCourse', {
  state: () => ({
    followedCourses: [] as RegisteredCourse[],
  }),
  actions: {
    async getFollowedCourse(userId: number) {
      const response = await api.get(`user/course/${userId}`, {
        headers: {
          Authorization: `Bearer ${qCookies.get('token')}`,
        },
      });
      this.followedCourses = response.data.data;
    },
  },
});
