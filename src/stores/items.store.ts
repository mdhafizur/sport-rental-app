/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { IItemState, Item } from '@src/interfaces';
import { defineStore } from 'pinia';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from 'src/firebase';

export const useItemsStore = defineStore({
  id: 'items',
  state: () => ({
    items: [],
  } as IItemState),
  getters: {
    getItems: (state: IItemState) => state.items,
  },
  actions: {
    setItems(items: Item[]) {
      this.items = items;
    },
    async fetchItems() {
      const querySnapshot = await getDocs(collection(firestore, 'items'));
      this.items = querySnapshot.docs.map((item:any) => ({
        ...item.data(),
        id: item.id,
      }));
    },
  },
});
