import { IBasketItem } from '../../types';
import { EventEmitter } from '../base/events';

export class Basket {
  private _container: HTMLElement;
  private _total: HTMLElement;
  private _items: IBasketItem[] = [];
  private _createBasketItem: (
    item: IBasketItem,
    events: EventEmitter
  ) => HTMLElement;
  private _checkoutButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    totalElement: HTMLElement,
    createBasketItem: (item: IBasketItem, events: EventEmitter) => HTMLElement,
    private events: EventEmitter
  ) {
    this._container = container;
    this._total = totalElement;
    this._createBasketItem = createBasketItem;

    // Создает кнопку "Оформить" один раз — изначально отключенную.
    this._checkoutButton = document.createElement('button');
    this._checkoutButton.className = 'button basket__checkout';
    this._checkoutButton.textContent = 'Оформить';
    this._checkoutButton.disabled = true;
    this._checkoutButton.addEventListener('click', () => {
      if (this._items.length > 0) {
        this.events.emit('order:open');
      }
    });
  }

  public render(items: IBasketItem[]): void {
    this._items = items;
    // Очищает контейнер, чтобы убрать старую разметку.
    this._container.innerHTML = '';

    // Отрисовывает каждый товар из массива
    items.forEach((item, index) => {
      const itemWithIndex = { ...item, index: index + 1 };
      const element = this._createBasketItem(itemWithIndex, this.events);
      this._container.appendChild(element);
    });

    // Обновляет итоговую сумму корзины
    const totalPrice = items.reduce((sum, item) => sum + (item.price || 0), 0);
    this._total.textContent = `${totalPrice.toLocaleString('ru-RU')} синапсов`;

    // Добавляет кнопку "Оформить" в конец контейнера.
    this._container.appendChild(this._checkoutButton);

    // Обновляет состояние кнопки (если товаров нет — отключена, иначе активна)
    this.updateCheckoutButton();
  }

  private updateCheckoutButton(): void {
    const isEmpty = this._items.length === 0;
    this._checkoutButton.disabled = isEmpty;
    if (isEmpty) {
      this._checkoutButton.classList.add('button_disabled');
    } else {
      this._checkoutButton.classList.remove('button_disabled');
    }
  }

  public addItem(item: IBasketItem): void {
    // Если товара с таким id ещё нет в корзине, добавляем его.
    if (!this._items.some(existing => existing.id === item.id)) {
      this._items.push({ ...item, index: this._items.length + 1 });
      this.render(this._items);
    }
  }

  public removeItem(itemId: string): void {
    this._items = this._items
      .filter(item => item.id !== itemId)
      .map((item, index) => ({ ...item, index: index + 1 }));
    this.render(this._items);
  }

  public get items(): IBasketItem[] {
    return this._items;
  }

  public get total(): number {
    return this._items.reduce((sum, item) => sum + (item.price || 0), 0);
  }
}

// Утилитная функция для создания DOM-элемента для товара в корзине. 
export function createBasketItem(item: IBasketItem, events: EventEmitter): HTMLElement {
  const li = document.createElement('li');
  li.classList.add('basket__item', 'card', 'card_compact');
  li.innerHTML = `
    <span class="basket__item-index">${item.index}</span>
    <span class="card__title">${item.title}</span>
    <span class="card__price">${item.price} синапсов</span>
    <button class="basket__item-delete card__button" aria-label="удалить"></button>
  `;

  const deleteButton = li.querySelector('.basket__item-delete') as HTMLButtonElement;
  if (deleteButton) {
    deleteButton.addEventListener('click', () => {
      events.emit('basket:remove', item.id);
    });
  }

  return li;
}
