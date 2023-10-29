import { useMeta } from 'quasar';

export const useMetaTitle = (title: string) => {
  return useMeta({
    title: title,
    titleTemplate: (title) => `${title} - Sertifikasi`,
  });
};
