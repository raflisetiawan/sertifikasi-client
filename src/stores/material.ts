import { defineStore } from 'pinia';
import { qCookies } from 'src/boot/cookies';
import { api } from 'src/boot/axios';
import { MaterialForm, Material } from 'src/models/material';

export const useMaterialStore = defineStore('material', {
  state: () => ({
    editDialog: false,
    addDialog: false,
    material: {} as Material,
    materials: [] as Material[],
    deleteDialog: false,
  }),
  actions: {
    async addMaterial(data: MaterialForm): Promise<void> {
      await api.post('materials', data, {
        headers: {
          Authorization: `Bearer ${qCookies.get('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    async getMaterialByCourseId(
      courseId: string | string[] | number | undefined
    ): Promise<void> {
      const response = await api.get(`materials/by-course/${courseId}`);
      this.materials = response.data.data;
    },
    async updateMaterial(
      data: MaterialForm,
      materialId: number | undefined,
      routeId: string | string[]
    ): Promise<void> {
      await api.post(`materials/${materialId}`, data, {
        headers: {
          Authorization: `Bearer ${qCookies.get('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      this.getMaterialByCourseId(routeId);
    },
    async deleteMaterial(
      id: number | undefined,
      routeId: string | string[]
    ): Promise<void> {
      await api.delete(`materials/${id}`, {
        headers: {
          Authorization: `Bearer ${qCookies.get('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      this.getMaterialByCourseId(routeId);
    },
  },
});
