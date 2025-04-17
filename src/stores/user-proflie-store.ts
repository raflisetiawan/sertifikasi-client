import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { qCookies } from 'src/boot/cookies';
import type { UserProfile, UpdateProfileForm } from 'src/models/user-profile';

export const useUserProfileStore = defineStore('user-profile', {
  state: () => ({
    profile: null as UserProfile | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchProfile() {
      try {
        const response = await api.get<{ success: boolean; data: UserProfile }>(
          '/user/profile',
          {
            headers: {
              Authorization: `Bearer ${qCookies.get('token')}`,
            },
          }
        );
        this.profile = response.data.data;
      } catch (error) {
        throw error;
      }
    },

    async updateProfile(data: UpdateProfileForm) {
      try {
        const response = await api.put<{ success: boolean; data: UserProfile }>(
          '/user/profile',
          data,
          {
            headers: {
              Authorization: `Bearer ${qCookies.get('token')}`,
            },
          }
        );
        this.profile = response.data.data;
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async updateProfileImage(userId: number, imageFile: File) {
      try {
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('_method', 'PUT');

        const response = await api.post<{
          success: boolean;
          data: UserProfile;
        }>(`/user/${userId}/update-image`, formData, {
          headers: {
            Authorization: `Bearer ${qCookies.get('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        this.profile = response.data.data;
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async removeProfileImage(userId: number) {
      try {
        const response = await api.delete<{
          success: boolean;
          data: UserProfile;
        }>(`/user/${userId}/remove-image`, {
          headers: {
            Authorization: `Bearer ${qCookies.get('token')}`,
          },
        });
        this.profile = response.data.data;
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
