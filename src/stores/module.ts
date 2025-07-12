import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { qCookies } from 'src/boot/cookies';
import { Module } from 'src/models/module';

interface ModuleState {
  addModuleDialog: boolean;
  detailModuleDialog: boolean;
  courseId: number;
  modules: Module[];
  editModuleDialog: boolean;
}

export const useModuleStore = defineStore('module', {
  state: (): ModuleState => ({
    addModuleDialog: false,
    detailModuleDialog: false,
    courseId: 0,
    modules: [],
    editModuleDialog: false,
  }),

  actions: {
    async createModule(courseId: number, moduleData: FormData) {
      moduleData.append('course_id', courseId.toString());
      console.log('Creating module with data:', moduleData);
      try {
        await api.post('modules', moduleData, {
          headers: {
            Authorization: `Bearer ${qCookies.get('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        this.addModuleDialog = false;
      } catch (error) {
        throw error;
      }
    },
    async getModules(courseId: number): Promise<Module[]> {
      try {
        const response = await api.get(`admin/courses/${courseId}/modules`, {
          headers: {
            Authorization: `Bearer ${qCookies.get('token')}`,
          },
        });
        return response.data.data;
      } catch (error) {
        throw error;
      }
    },
    async getModule(moduleId: number): Promise<Module> {
      try {
        const response = await api.get(`modules/${moduleId}`, {
          headers: {
            Authorization: `Bearer ${qCookies.get('token')}`,
          },
        });
        return response.data.data;
      } catch (error) {
        throw error;
      }
    },

    async deleteModule(moduleId: number): Promise<void> {
      try {
        await api.delete(`modules/${moduleId}`, {
          headers: {
            Authorization: `Bearer ${qCookies.get('token')}`,
          },
        });
      } catch (error) {
        throw error;
      }
    },
    async getCourse(courseId: number) {
      try {
        const response = await api.get(`course/${courseId}`, {
          headers: {
            Authorization: `Bearer ${qCookies.get('token')}`,
          },
        });
        return response.data.data;
      } catch (error) {
        throw error;
      }
    },
    async updateModule(moduleId: number, moduleData: FormData): Promise<void> {
      try {
        await api.post(`modules/${moduleId}`, moduleData, {
          headers: {
            Authorization: `Bearer ${qCookies.get('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        this.editModuleDialog = false;
      } catch (error) {
        throw error;
      }
    },
  },
});
