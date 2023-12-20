import { defineStore } from 'pinia';
import { LocalStorage } from 'quasar';
import { api } from 'src/boot/axios';
import { UserCourses } from 'src/models/course';

export const useUserCourse = defineStore('userCourse', {
  state: () => ({
    followedCourses: [] as UserCourses[],
  }),
  actions: {
    async getFollowedCourse(userId: number) {
      const response = await api.get(`user/course/${userId}`, {
        headers: {
          Authorization: `Bearer ${LocalStorage.getItem('token')}`,
        },
      });
      this.followedCourses = response.data.data;
    },
  },
});
