import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { qCookies } from 'src/boot/cookies';
import { ModuleExercise } from 'src/models/module-exercise';

interface ModuleExerciseState {
  addExerciseDialog: boolean;
  editExerciseDialog: boolean;
  moduleId: number;
  exercises: ModuleExercise[];
}

export const useModuleExerciseStore = defineStore('exercise', {
  state: (): ModuleExerciseState => ({
    addExerciseDialog: false,
    editExerciseDialog: false,
    moduleId: 0,
    exercises: [],
  }),

  actions: {
    async getExercises(moduleId: number): Promise<ModuleExercise[]> {
      try {
        const response = await api.get(`modules/${moduleId}/exercises`, {
          headers: {
            Authorization: `Bearer ${qCookies.get('token')}`,
          },
        });
        return response.data.data;
      } catch (error) {
        throw error;
      }
    },

    async createExercise(
      moduleId: number,
      exerciseData: Partial<ModuleExercise>
    ): Promise<void> {
      try {
        await api.post(
          'module-exercises',
          {
            ...exerciseData,
            module_id: moduleId,
          },
          {
            headers: {
              Authorization: `Bearer ${qCookies.get('token')}`,
            },
          }
        );
        this.addExerciseDialog = false;
      } catch (error) {
        throw error;
      }
    },

    async updateExercise(
      exerciseId: number,
      exerciseData: Partial<ModuleExercise>
    ): Promise<void> {
      try {
        await api.put(`module-exercises/${exerciseId}`, exerciseData, {
          headers: {
            Authorization: `Bearer ${qCookies.get('token')}`,
          },
        });
        this.editExerciseDialog = false;
      } catch (error) {
        throw error;
      }
    },

    async deleteExercise(exerciseId: number): Promise<void> {
      try {
        await api.delete(`module-exercises/${exerciseId}`, {
          headers: {
            Authorization: `Bearer ${qCookies.get('token')}`,
          },
        });
      } catch (error) {
        throw error;
      }
    },

    async reorderExercises(
      exercises: { id: number; order: number }[]
    ): Promise<void> {
      try {
        await api.post(
          'module-exercises/reorder',
          { exercises },
          {
            headers: {
              Authorization: `Bearer ${qCookies.get('token')}`,
            },
          }
        );
      } catch (error) {
        throw error;
      }
    },
  },
});
