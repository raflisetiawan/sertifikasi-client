import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { qCookies } from 'src/boot/cookies';
import type { Forum, Thread, Post } from 'src/models/forum';

export const useForumStore = defineStore('forum', {
  state: () => ({
    forums: [] as Forum[],
    threads: [] as Thread[],
    posts: [] as Post[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    // Admin actions
    async createCourseForum(
      courseId: number,
      data: { title: string; description: string }
    ) {
      try {
        const response = await api.post(
          `/admin/courses/${courseId}/forums`,
          data,
          {
            headers: { Authorization: `Bearer ${qCookies.get('token')}` },
          }
        );
        return response.data;
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(error.message || 'Failed to create forum');
        }
        throw new Error('An unknown error occurred');
      }
    },

    async fetchAdminCourseForum(courseId: number) {
      this.loading = true;
      try {
        const response = await api.get(`/admin/courses/${courseId}/forums`, {
          headers: { Authorization: `Bearer ${qCookies.get('token')}` },
        });
        return response.data.data;
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.error = error.message || 'Failed to fetch course forum';
        } else {
          this.error = 'An unknown error occurred';
        }
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateForum(
      id: number,
      data: { title: string; description: string }
    ) {
      try {
        const response = await api.put(`/admin/forums/${id}`, data, {
          headers: { Authorization: `Bearer ${qCookies.get('token')}` },
        });
        return response.data;
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(error.message || 'Failed to update forum');
        }
        throw new Error('An unknown error occurred');
      }
    },

    async deleteForum(id: number) {
      try {
        await api.delete(`/admin/forums/${id}`, {
          headers: { Authorization: `Bearer ${qCookies.get('token')}` },
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(error.message || 'Failed to delete forum');
        }
        throw new Error('An unknown error occurred');
      }
    },

    // User actions
    async fetchCourseForum(courseId: number) {
      this.loading = true;
      try {
        const response = await api.get(`/courses/${courseId}/forum`, {
          headers: { Authorization: `Bearer ${qCookies.get('token')}` },
        });
        return response.data.data;
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.error = error.message || 'Failed to fetch course forum';
        } else {
          this.error = 'An unknown error occurred';
        }
        return null;
      } finally {
        this.loading = false;
      }
    },

    async createThread(forumId: number, data: { title: string; body: string }) {
      try {
        const response = await api.post(`/forums/${forumId}/threads`, data, {
          headers: { Authorization: `Bearer ${qCookies.get('token')}` },
        });
        return response.data;
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(error.message || 'Failed to create thread');
        }
        throw new Error('An unknown error occurred');
      }
    },

    async fetchThreadWithPosts(id: number) {
      this.loading = true;
      try {
        const response = await api.get(`/threads/${id}`, {
          headers: { Authorization: `Bearer ${qCookies.get('token')}` },
        });
        return response.data.data;
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.error = error.message || 'Failed to fetch thread details';
        } else {
          this.error = 'An unknown error occurred';
        }
        return null;
      } finally {
        this.loading = false;
      }
    },

    async updateThread(id: number, data: { title: string; body: string }) {
      try {
        const response = await api.put(`/threads/${id}`, data, {
          headers: { Authorization: `Bearer ${qCookies.get('token')}` },
        });
        return response.data;
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(error.message || 'Failed to update thread');
        }
        throw new Error('An unknown error occurred');
      }
    },

    async deleteThread(id: number) {
      try {
        await api.delete(`/threads/${id}`, {
          headers: { Authorization: `Bearer ${qCookies.get('token')}` },
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(error.message || 'Failed to delete thread');
        }
        throw new Error('An unknown error occurred');
      }
    },

    async createPost(threadId: number, data: { body: string }) {
      try {
        const response = await api.post(`/threads/${threadId}/posts`, data, {
          headers: { Authorization: `Bearer ${qCookies.get('token')}` },
        });
        return response.data;
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(error.message || 'Failed to create post');
        }
        throw new Error('An unknown error occurred');
      }
    },

    async updatePost(id: number, data: { body: string }) {
      try {
        const response = await api.put(`/posts/${id}`, data, {
          headers: { Authorization: `Bearer ${qCookies.get('token')}` },
        });
        return response.data;
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(error.message || 'Failed to update post');
        }
        throw new Error('An unknown error occurred');
      }
    },

    async deletePost(id: number) {
      try {
        await api.delete(`/posts/${id}`, {
          headers: { Authorization: `Bearer ${qCookies.get('token')}` },
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(error.message || 'Failed to delete post');
        }
        throw new Error('An unknown error occurred');
      }
    },
  },
});
