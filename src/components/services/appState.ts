import {
  IProductItem,
  IOrder,
} from '../../types';

interface InitialState {
  basket?: IProductItem[];
  catalog?: IProductItem[];
  order?: IOrder;
}

export class AppState {
  public basket: IProductItem[];
  public catalog: IProductItem[];
  public order: IOrder;

  constructor(initialState: InitialState = {}) {
    this.basket = initialState.basket ?? [];
    this.catalog = initialState.catalog ?? [];
    this.order = {
      items: initialState.order?.items ?? [],
      total: initialState.order?.total ?? 0,
    };
  }

  /** Возвращает сумму цен товаров в корзине */
  getTotal(): number {
    return this.basket.reduce((sum, item) => sum + item.price, 0);
  }

  /** Устанавливает данные каталога */
  setCatalog(products: IProductItem[]): void {
     console.log('Полученные данные из API:', products); 
    this.catalog = [...products];
  }

  /** Добавляет товар в корзину, если его там нет, и обновляет заказ */
  addToBasket(product: IProductItem): void {
    if (!this.basket.some(p => p.id === product.id)) {
      this.basket.push(product);
      this.updateOrder();
    }
  }

  /** Удаляет товар из корзины и обновляет заказ */
  removeFromBasket(id: string): void {
    this.basket = this.basket.filter(item => item.id !== id);
    this.updateOrder();
  }

  /** Очищает корзину и сбрасывает заказ */
  clearBasket(): void {
    this.basket = [];
    this.clearOrder();
  }

  /** Очищает данные заказа */
  clearOrder(): void {
    this.order = { items: [], total: 0 };
  }

  /** Проверяет наличие товара в корзине */
  checkProduct(productId: string): boolean {
    return this.basket.some(p => p.id === productId);
  }

  /** Обновляет поля заказа (items и total) на основе корзины */
  private updateOrder(): void {
    this.order.items = this.basket.map(item => ({ product: item, quantity: 1 }));
    this.order.total = this.getTotal();
  }
}
