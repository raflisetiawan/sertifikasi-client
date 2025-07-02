import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { qCookies } from 'src/boot/cookies';
import type {
  BaseContent,
  TextContent,
  QuizContent,
  AssignmentContent,
  VideoContent,
  PracticeContent,
} from 'src/models/module-content';

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

    async updateTextContent(contentId: number, data: TextContent) {
      try {
        await api.put(`/admin/texts/${contentId}`, data, {
          headers: {
            Authorization: `Bearer ${qCookies.get('token')}`,
          },
        });
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

    async updateQuizContent(contentId: number, data: QuizContent) {
      try {
        await api.put(`/admin/quizzes/${data.id}`, data, {
          headers: {
            Authorization: `Bearer ${qCookies.get('token')}`,
          },
        });
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error('Failed to update quiz content');
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
    async updateAssignmentContent(contentId: number, data: AssignmentContent) {
      try {
        await api.put(`/admin/assignments/${data.id}`, data, {
          headers: {
            Authorization: `Bearer ${qCookies.get('token')}`,
          },
        });
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error('Failed to update assignment content');
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

    async updateVideoContent(contentId: number, data: VideoContent) {
      try {
        await api.put(`/admin/videos/${contentId}`, data, {
          headers: {
            Authorization: `Bearer ${qCookies.get('token')}`,
          },
        });
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error('Failed to update video content');
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

    async updateFileContent(contentId: number, data: FormData) {
      try {
        const response = await api.post<{ data: BaseContent }>(
          `/admin/files/${contentId}`,
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
        throw new Error('Failed to update file content');
      }
    },

    async createPracticeContent(data: PracticeContent) {
      try {
        const response = await api.post<{ data: BaseContent }>(
          '/admin/practices',
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
        throw new Error('Failed to create practice content');
      }
    },

    async updatePracticeContent(contentId: number, data: PracticeContent) {
      try {
        await api.put(`/admin/practices/${data.id}`, data, {
          headers: {
            Authorization: `Bearer ${qCookies.get('token')}`,
          },
        });
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error('Failed to update practice content');
      }
    },
  },
});
