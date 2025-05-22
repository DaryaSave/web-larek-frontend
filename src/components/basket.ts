import { IProductItem } from '../types';

export class Basket {
  private _container: HTMLElement;
  private _total: HTMLElement;
  private _items: IProductItem[] = [];
  private _createBasketItem: (data: IProductItem) => HTMLElement;

  constructor(
    container: HTMLElement,
    totalElement: HTMLElement,
    createBasketItem: (data: IProductItem) => HTMLElement
  ) {
    this._container = container;
    this._total = totalElement;
    this._createBasketItem = createBasketItem;
  }

  public render(): void {
    this._container.innerHTML = '';

    this._items.forEach((item) => {
      const element = this._createBasketItem(item);
      this._container.appendChild(element);
    });

    this.updateTotal();
  }

  public addItem(data: IProductItem): void {
    // Проверка на дубли (по id)
    const existingItem = this._items.find((item) => item.id === data.id);
    if (!existingItem) {
      this._items.push(data);
      this.render();
    }
  }

  public removeItem(itemId: string): void {
    this._items = this._items.filter((item) => item.id !== itemId);
    this.render();
  }

  public clear(): void {
    this._items = [];
    this.render();
  }

  public getItems(): IProductItem[] {
    return this._items;
  }

  public updateTotal(): void {
    const total = this._items.reduce((sum, item) => sum + item.price, 0);
    this._total.textContent = `${total.toLocaleString()} ₽`;
  }
}
export const createBasketItem = (item: IProductItem): HTMLElement => {
  const basketItemTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
  const itemElement = basketItemTemplate.content.cloneNode(true) as HTMLElement;

  const titleEl = itemElement.querySelector('.card__title') as HTMLElement;
  const priceEl = itemElement.querySelector('.card__price') as HTMLElement;

  titleEl.textContent = item.title;
  priceEl.textContent = `${item.price.toLocaleString()} синапсов`;

  return itemElement;
};
