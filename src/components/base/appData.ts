// ===== AppData.ts =====
import { Api } from '../base/api';
import { UserInfo } from '../userInfo';
import { IProductItem } from '../../types';

/**
 * Менеджер данных приложения: хранит список товаров и корзину,
 * взаимодействует с сервером и UserInfo.
 */
export class AppData {
  private _api: Api;
  private _userInfo: UserInfo;
  private _items: IProductItem[] = [];
  private _cart: IProductItem[] = [];

  /**
   * @param api — клиент API для запросов к серверу
   * @param userInfo — менеджер данных пользователя
   */
  constructor(api: Api, userInfo: UserInfo) {
    this._api = api;
    this._userInfo = userInfo;
  }

  /**
   * Инициализация приложения: загрузка пользователя и товаров.
   */
  async initApp(): Promise<void> {
    try {
      await this._userInfo.fetchUser();
      const products = await this._api.get('/products') as IProductItem[];
      this._items = products;
    } catch (err) {
      console.error('Ошибка инициализации приложения:', err);
    }
  }

  /** Возвращает все загруженные товары */
  getItems(): IProductItem[] {
    return [...this._items];
  }

  /**
   * Создаёт новый товар на сервере и добавляет в начало списка.
   */
  async addItem(data: IProductItem): Promise<IProductItem> {
    const added = await this._api.post('/products', data) as IProductItem;
    this._items.unshift(added);
    return added;
  }

  /**
   * Удаляет товар на сервере и из локального списка.
   */
  async deleteItem(itemId: string): Promise<void> {
    await this._api.post(`/products/${itemId}`, {}, 'DELETE');
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
