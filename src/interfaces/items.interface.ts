export interface Item{
  id: string;
  title: string;
  price: number;
}

export interface IItemState {
  items: Item[] | [];
}

export interface Getters {
  getItems(): Item[];
}

export interface Actions{
  setItems(items: Item[]): void;
}
