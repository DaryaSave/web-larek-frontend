import { IProductItem } from '../../types';

export class AppData {
  private _items: IProductItem[] = [];
  private _cart: IProductItem[] = [];

  /** Устанавливает список товаров */
  setItems(items: IProductItem[]): void {
    this._items = items;
  }

  /** Возвращает все загруженные товары */
  getItems(): IProductItem[] {
    return [...this._items];
  }

  /** Добавляет товар в начало списка */
  addItem(item: IProductItem): void {
    this._items.unshift(item);
  }

  /** Удаляет товар из локального списка */
  deleteItem(itemId: string): void {
    this._items = this._items.filter(item => item.id !== itemId);
  }

  /** Добавляет товар в корзину, если ещё не был добавлен */
  addToCart(item: IProductItem): void {
    if (!this._cart.find(i => i.id === item.id)) {
      this._cart.push(item);
    }
  }

  /** Удаляет товар из корзины по ID */
  removeFromCart(itemId: string): void {
    this._cart = this._cart.filter(item => item.id !== itemId);
  }

  /** Возвращает текущее содержимое корзины */
  getCart(): IProductItem[] {
    return [...this._cart];
  }

  /** Полностью очищает корзину */
  clearCart(): void {
    this._cart = [];
  }
}
