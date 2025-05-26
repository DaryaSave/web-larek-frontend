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

  public render(items: IProductItem[]) {
    this._container.innerHTML = '';
    items.forEach(item => {
      const element = this._createBasketItem(item);
      this._container.appendChild(element);
    });
    this._total.textContent = `${items.reduce((sum, item) => sum + item.price, 0)} синапсов`;
  }

  public addItem(data: IProductItem): void {
    if (!this._items.some(item => item.id === data.id)) {
      this._items.push(data);
      this.render(this._items);
    }
  }

  public removeItem(itemId: string): void {
    this._items = this._items.filter(item => item.id !== itemId);
    this.render(this._items);
  }

  public clear(): void {
    this._items = [];
    this.render(this._items);
  }

  public getItems(): IProductItem[] {
    return this._items;
  }
}

export const createBasketItem = (item: IProductItem): HTMLElement => {
  const basketItemTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
  const itemElement = basketItemTemplate.content.firstElementChild.cloneNode(true) as HTMLElement;

  const titleEl = itemElement.querySelector('.card__title') as HTMLElement;
  const priceEl = itemElement.querySelector('.card__price') as HTMLElement;

  titleEl.textContent = item.title;
  priceEl.textContent = `${item.price.toLocaleString()} синапсов`;

  return itemElement;
};