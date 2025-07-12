import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { qCookies } from 'src/boot/cookies';
import { Forum, Thread } from 'src/models/forum'; // Assuming these models exist

interface CreateThreadPayload {
  title: string;
  content: string;
}

interface CreatePostPayload {
  content: string;
}

export const useTrainerForumStore = defineStore('trainerForum', {
  state: () => ({
    courseForum: null as Forum | null,
    selectedThread: null as Thread | null,
  }),
  actions: {
    async getCourseForum(courseId: number): Promise<void> {
      try {
        const response = await api.get(`trainer/courses/${courseId}/forum`, {
          headers: {
            Authorization: 'Bearer ' + qCookies.get('token'),
          },
        });
        this.courseForum = response.data; // Adjust based on actual API response structure
      } catch (error) {
        console.error('Error fetching course forum:', error);
        throw error;
      }
    },
    async getForumDetail(forumId: number): Promise<void> {
      try {
        const response = await api.get(`trainer/forums/${forumId}`, {
          headers: {
            Authorization: 'Bearer ' + qCookies.get('token'),
          },
        });
        this.courseForum = response.data; // Adjust based on actual API response structure
      } catch (error) {
        console.error('Error fetching forum detail:', error);
        throw error;
      }
    },
    async createThread(
      forumId: number,
      payload: CreateThreadPayload
    ): Promise<void> {
      try {
        await api.post(`trainer/forums/${forumId}/threads`, payload, {
          headers: {
            Authorization: 'Bearer ' + qCookies.get('token'),
          },
        });
        // Optionally refetch forum detail to update the thread list
        await this.getForumDetail(forumId);
      } catch (error) {
        console.error('Error creating thread:', error);
        throw error;
      }
    },
    async createPost(
      threadId: number,
      payload: CreatePostPayload
    ): Promise<void> {
      try {
        await api.post(`trainer/threads/${threadId}/posts`, payload, {
          headers: {
            Authorization: 'Bearer ' + qCookies.get('token'),
          },
        });
        // Optionally refetch thread detail to update the post list
        await this.getThreadDetail(threadId);
      } catch (error) {
        console.error('Error creating post:', error);
        throw error;
      }
    },
    async getThreadDetail(threadId: number): Promise<void> {
      try {
        const response = await api.get(`trainer/threads/${threadId}`, {
          headers: {
            Authorization: 'Bearer ' + qCookies.get('token'),
          },
        });
        this.selectedThread = response.data; // Adjust based on actual API response structure
      } catch (error) {
        console.error('Error fetching thread detail:', error);
        throw error;
      }
    },
  },
});
