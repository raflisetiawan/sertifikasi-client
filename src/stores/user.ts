import { defineStore } from 'pinia';
import { User } from 'src/models/user';
import { api } from 'src/boot/axios';
import { useNotify } from 'src/composables/notifications';
import { UserEditForm } from 'src/models/user';
import { qCookies } from 'src/boot/cookies';
import { useUser } from 'src/composables/auth/user';
import { Cookies } from 'quasar';

export const useUserStore = defineStore('user', {
  state: (): User => ({
    email: '',
    id: 0,
    name: '',
    created_at: '',
    role: '',
    phone_number: 0,
    image: '',
  }),
  getters: {
    getUser: (state) => (state = state),
  },
  actions: {
    setUser(userData: User) {
      this.$state.id = userData.id;
      this.$state.name = userData.name;
      this.$state.email = userData.email;
      this.$state.phone_number = userData.phone_number;
      this.$state.created_at = userData.created_at;
      this.$state.role = userData.role;
      this.$state.email_verified_at = userData.email_verified_at;
    },
    resetUser() {
      this.$state.id = 0;
      this.$state.name = '';
      this.$state.email = '';
      this.$state.email_verified_at = null;
      this.$state.updated_at = null;
      this.$state.created_at = '';
      this.$state.role = '';
      this.$state.email_verified_at = null;

      // qCookies.remove('token');
      // qCookies.remove('signedIn');
    },
    async logout() {
      try {
        const response = await api.post('signout');
        if (response.data.success) {
          this.resetUser();
          Cookies.remove('token');
          Cookies.remove('signedIn');
          useNotify('Berhasil logout', 'green');
          this.router.push({ name: 'auth.login' });
        } else {
          useNotify('Berhasil logout', 'green');
        }
      } catch (error) {
        useNotify('Terjadi masalah', 'red');
        throw error;
      }
    },
    async editProfile(data: UserEditForm): Promise<void> {
      await api.post(`user-profile/${this.id}`, data, {
        headers: {
          Authorization: `Bearer ${qCookies.get('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const response = await useUser(qCookies.get('token'));
      this.setUser(response.data.user);
    },
  },
});
