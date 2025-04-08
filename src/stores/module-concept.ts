import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { qCookies } from 'src/boot/cookies';
import { ModuleConcept } from 'src/models/module-concept';

interface ModuleConceptState {
  addConceptDialog: boolean;
  editConceptDialog: boolean;
  moduleId: number;
  concepts: ModuleConcept[];
}

export const useModuleConceptStore = defineStore('concept', {
  state: (): ModuleConceptState => ({
    addConceptDialog: false,
    editConceptDialog: false,
    moduleId: 0,
    concepts: [],
  }),

  actions: {
    // Get concepts for a module
    async getConcepts(moduleId: number): Promise<ModuleConcept[]> {
      try {
        const response = await api.get(`modules/${moduleId}/concepts`, {
          headers: {
            Authorization: `Bearer ${qCookies.get('token')}`,
          },
        });
        return response.data.data;
      } catch (error) {
        throw error;
      }
    },

    // Create new concept
    async createConcept(
      moduleId: number,
      conceptData: Partial<ModuleConcept>
    ): Promise<void> {
      try {
        await api.post(
          'module-concepts',
          {
            ...conceptData,
            module_id: moduleId,
          },
          {
            headers: {
              Authorization: `Bearer ${qCookies.get('token')}`,
            },
          }
        );
        this.addConceptDialog = false;
      } catch (error) {
        throw error;
      }
    },

    // Get single concept
    async getConcept(conceptId: number): Promise<ModuleConcept> {
      try {
        const response = await api.get(`module-concepts/${conceptId}`, {
          headers: {
            Authorization: `Bearer ${qCookies.get('token')}`,
          },
        });
        return response.data.data;
      } catch (error) {
        throw error;
      }
    },

    // Update concept
    async updateConcept(
      conceptId: number,
      conceptData: Partial<ModuleConcept>
    ): Promise<void> {
      try {
        await api.put(`module-concepts/${conceptId}`, conceptData, {
          headers: {
            Authorization: `Bearer ${qCookies.get('token')}`,
          },
        });
        this.editConceptDialog = false;
      } catch (error) {
        throw error;
      }
    },

    // Delete concept
    async deleteConcept(conceptId: number): Promise<void> {
      try {
        await api.delete(`module-concepts/${conceptId}`, {
          headers: {
            Authorization: `Bearer ${qCookies.get('token')}`,
          },
        });
      } catch (error) {
        throw error;
      }
    },

    // Reorder concepts
    async reorderConcepts(
      concepts: { id: number; order: number }[]
    ): Promise<void> {
      try {
        await api.post(
          'module-concepts/reorder',
          { concepts },
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
