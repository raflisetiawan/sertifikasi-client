import { defineStore } from 'pinia';
import { Cookies } from 'quasar';
import { api } from 'src/boot/axios';
import { ZoomLink } from 'src/models/course';

export const useZoomLinkStore = defineStore('zoomLink', {
  state: () => ({
    addZoomDialog: false,
    editZoomDialog: false,
    deleteZoomDialog: false,
    courseId: 0,
    zoomLinkData: {} as ZoomLink,
  }),
  actions: {
    async addZoomLink(link: string): Promise<void> {
      await api.post(
        'zoom-link',
        { link, course_id: this.courseId },
        {
          headers: {
            Authorization: 'Bearer ' + Cookies.get('token'),
          },
        }
      );
    },
    async editZoomLink(link: string): Promise<void> {
      await api.post(
        `zoom-link/${this.zoomLinkData.id}`,
        { link, course_id: this.zoomLinkData.courseId, _method: 'PATCH' },
        {
          headers: {
            Authorization: 'Bearer ' + Cookies.get('token'),
          },
        }
      );
    },
    async deleteZoomLink(): Promise<void> {
      await api.delete(`zoom-link/${this.zoomLinkData.id}`, {
        headers: {
          Authorization: 'Bearer ' + Cookies.get('token'),
        },
      });
    },
  },
});
