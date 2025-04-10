import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { qCookies } from 'src/boot/cookies';
import { CourseBenefit } from 'src/models/course-benefit';

interface CourseBenefitState {
  courseId: number;
  addBenefitDialog: boolean;
  editBenefitDialog: boolean;
  courseBenefits: CourseBenefit[];
}

export const useCourseBenefitStore = defineStore('course-benefit', {
  state: (): CourseBenefitState => ({
    courseId: 0,
    addBenefitDialog: false,
    editBenefitDialog: false,
    courseBenefits: [],
  }),

  actions: {
    async getBenefits(courseId: number): Promise<CourseBenefit[]> {
      try {
        const response = await api.get(`course/${courseId}/course_benefits`, {
          headers: {
            Authorization: `Bearer ${qCookies.get('token')}`,
          },
        });
        return response.data.data;
      } catch (error) {
        throw error;
      }
    },

    //get single benefit
    async getBenefit(benefitId: number): Promise<CourseBenefit> {
      try {
        const response = await api.get(`course_benefits/${benefitId}`, {
          headers: {
            Authorization: `Bearer ${qCookies.get('token')}`,
          },
        });
        return response.data.data;
      } catch (error) {
        throw error;
      }
    },

    async createBenefit(benefitData: Partial<FormData>): Promise<void> {
      try {
        await api.post('course_benefits', benefitData, {
          headers: {
            Authorization: `Bearer ${qCookies.get('token')}`,
          },
        });
        this.addBenefitDialog = false;
      } catch (error) {
        throw error;
      }
    },

    async updateBenefit(
      benefitId: number,
      benefitData: FormData
    ): Promise<void> {
      try {
        await api.post(`course_benefits/${benefitId}`, benefitData, {
          headers: {
            Authorization: `Bearer ${qCookies.get('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        this.editBenefitDialog = false;
      } catch (error) {
        throw error;
      }
    },

    async deleteBenefit(benefitId: number): Promise<void> {
      try {
        await api.delete(`course_benefits/${benefitId}`, {
          headers: {
            Authorization: `Bearer ${qCookies.get('token')}`,
          },
        });
      } catch (error) {
        throw error;
      }
    },
  },
});
