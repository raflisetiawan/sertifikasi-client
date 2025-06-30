import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { qCookies } from 'src/boot/cookies';
import type {
  BaseContent,
  TextContent,
  QuizContent,
  AssignmentContent,
  VideoContent,
} from 'src/models/module-content';

interface TextContentPayload {
  module_id: number;
  title: string;
  content: string;
  format: 'markdown' | 'html';
  order: number;
  is_required: boolean;
  minimum_duration_seconds?: number;
}

export const useModuleContentStore = defineStore('moduleContent', {
  state: () => ({
    contents: [] as BaseContent[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchContents(moduleId: number) {
      this.loading = true;
      try {
        const response = await api.get<{ data: BaseContent[] }>(
          `/admin/modules/${moduleId}/contents`,
          {
            headers: {
              Authorization: `Bearer ${qCookies.get('token')}`,
            },
          }
        );
        this.contents = response.data.data;
      } catch (error) {
        if (error instanceof Error) {
          this.error = error.message;
        } else {
          this.error = 'Failed to fetch contents';
        }
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createTextContent(data: TextContent) {
      try {
        const response = await api.post<{ data: BaseContent }>(
          '/admin/texts',
          data,
          {
            headers: {
              Authorization: `Bearer ${qCookies.get('token')}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error('Failed to create text content');
      }
    },

    async updateTextContent(contentId: number, data: TextContentPayload) {
      try {
        await api.put(
          `/admin/modules/${data.module_id}/contents/${contentId}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${qCookies.get('token')}`,
            },
          }
        );
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error('Failed to update text content');
      }
    },

    async fetchContentDetails(moduleId: number, contentId: number) {
      try {
        const response = await api.get<{ data: BaseContent }>(
          `/admin/modules/${moduleId}/contents/${contentId}`,
          {
            headers: {
              Authorization: `Bearer ${qCookies.get('token')}`,
            },
          }
        );
        return response.data.data;
      } catch (error) {
        if (error instanceof Error) {
          this.error = error.message;
        }
        console.error('Gagal mengambil detail konten:', error);
        throw new Error('Gagal mengambil detail konten');
      }
    },

    async createQuizContent(data: QuizContent) {
      try {
        const response = await api.post<{ data: BaseContent }>(
          '/admin/quizzes',
          data,
          {
            headers: {
              Authorization: `Bearer ${qCookies.get('token')}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error('Failed to create quiz content');
      }
    },
    async createAssignmentContent(data: AssignmentContent) {
      try {
        const response = await api.post<{ data: BaseContent }>(
          '/admin/assignments',
          data,
          {
            headers: {
              Authorization: `Bearer ${qCookies.get('token')}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error('Failed to create assignment content');
      }
    },
    async deleteContent(moduleId: number, contentId: number) {
      try {
        const response = await api.delete<{
          success: boolean;
          message: string;
        }>(`/admin/modules/${moduleId}/contents/${contentId}`, {
          headers: {
            Authorization: `Bearer ${qCookies.get('token')}`,
          },
        });
        return response.data;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error('Failed to delete content');
      }
    },
    async createVideoContent(data: VideoContent) {
      try {
        const response = await api.post<{ data: BaseContent }>(
          '/admin/videos',
          data,
          {
            headers: {
              Authorization: `Bearer ${qCookies.get('token')}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error('Failed to create video content');
      }
    },
    async createFileContent(data: FormData) {
      try {
        const response = await api.post<{ data: BaseContent }>(
          '/admin/files',
          data,
          {
            headers: {
              Authorization: `Bearer ${qCookies.get('token')}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        return response.data;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error('Failed to create file content');
      }
    },
  },
});
