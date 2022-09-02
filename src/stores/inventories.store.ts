import { defineStore } from 'pinia';

export const useInventoriesStore = defineStore({
  id: 'inventories',
  state: () => ({
    inventories: [] || null,
  }),
  actions: {
    async setItems(items: any) {
      this.inventories = items;
    },
  },
});
