import { defineStore } from 'pinia';
import { qCookies } from 'src/boot/cookies';
import { api } from 'src/boot/axios';
import { Faqs } from 'src/models/faq';

export const useFaqStore = defineStore('faq', {
  state: () => ({
    faqs: [] as Faqs[],
    faq: {} as Faqs,
    addDialog: false,
    deleteDialog: false,
    updateDialog: false,
  }),
  actions: {
    async setFaqs(search?: string, category?: string) {
      const params: { search?: string; category?: string } = {};
      if (search) {
        params.search = search;
      }
      if (category) {
        params.category = category;
      }
      const response = await api.get('faqs', { params });
      this.faqs = response.data.data;
    },
    async addFaqs(answer: string, question: string, category: string) {
      await api.post(
        'faqs',
        {
          answer,
          question,
          category,
        },
        {
          headers: {
            Authorization: 'Bearer ' + qCookies.get('token'),
          },
        }
      );
      await this.setFaqs();
    },
    async updateFaq(
      id: number,
      answer: string,
      question: string,
      category: string
    ) {
      await api.post(
        `faqs/${id}`,
        {
          id,
          answer,
          question,
          category,
          _method: 'PUT',
        },
        {
          headers: {
            Authorization: 'Bearer ' + qCookies.get('token'),
          },
        }
      );
      await this.setFaqs();
    },
    async deleteFaq(id: number) {
      await api.delete(`faqs/${id}`, {
        headers: {
          Authorization: 'Bearer ' + qCookies.get('token'),
        },
      });
      await this.setFaqs();
    },
  },
});
