import { defineStore } from 'pinia';
import { LocalStorage } from 'quasar';
import { api } from 'src/boot/axios';
import { Trainer } from 'src/models/trainer';

export const useTrainerStore = defineStore('trainer', {
  state: () => ({
    trainers: [] as Trainer[],
    trainer: {} as Trainer,
    addDialog: false,
    deleteDialog: false,
    updateDialog: false,
  }),
  actions: {
    async getTrainers(): Promise<void> {
      const response = await api.get('trainers');
      this.trainers = response.data;
    },
    async getTrainer(id: string | string[]): Promise<Trainer> {
      const response = await api.get(`trainers/${id}`);
      return response.data;
    },
    async getRandomOrSameQualificationTrainer(
      qualification: string | null,
      id: string | string[]
    ): Promise<Trainer[]> {
      const response = await api.get(
        `trainers/qualification/${qualification}/${id}`
      );
      return response.data;
    },
    async addTrainer(data: Trainer) {
      await api.post('trainers', data, {
        headers: {
          Authorization: 'Bearer ' + LocalStorage.getItem('token'),
          'Content-Type': 'multipart/form-data',
        },
      });
      await this.getTrainers();
    },
    async updateTrainer(id: number, updatedTrainer: Trainer): Promise<void> {
      await api.post(
        `trainers/${id}`,
        {
          id,
          ...updatedTrainer,
          _method: 'PUT',
        },
        {
          headers: {
            Authorization: 'Bearer ' + LocalStorage.getItem('token'),
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      await this.getTrainers();
    },
    async deleteTrainer(id: number): Promise<void> {
      await api.delete(`trainers/${id}`, {
        headers: {
          Authorization: 'Bearer ' + LocalStorage.getItem('token'),
        },
      });
      await this.getTrainers();
    },
    async toggleStarredTrainer(
      id: number | undefined,
      trainer: Trainer
    ): Promise<void> {
      await api.put(
        `trainers/${id}/toggle-starred`,
        { trainer },
        {
          headers: {
            Authorization: 'Bearer ' + LocalStorage.getItem('token'),
          },
        }
      );
    },
    async getStarredTrainer(): Promise<Trainer[]> {
      const response = await api.get('starred-trainers');
      return response.data;
    },
  },
});
