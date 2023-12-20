import { defineStore } from 'pinia';

export const useUserDialog = defineStore('userDialog', {
  state: () => ({
    editDialog: false,
  }),
});
