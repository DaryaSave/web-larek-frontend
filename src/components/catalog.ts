import { IProductItem } from '../types';
import { Card } from './card'; 

export class Catalog {
  private _container: HTMLElement;
  private _items: IProductItem[] = [];
  private _onCardSelect?: (data: IProductItem) => void;
  private _createCard: (data: IProductItem) => Card;

  constructor(
    container: HTMLElement,
    createCard: (data: IProductItem) => Card,
    onCardSelect?: (data: IProductItem) => void
  ) {
    if (!container) throw new Error('Container element is required');
    this._container = container;
    this._createCard = createCard;
    this._onCardSelect = onCardSelect;
  }

  /** Отрисовывает все карточки */
  render(items: IProductItem[]): void {
    this.clear();
    this._items = items;
    this._items.forEach(item => this.addItem(item));
  }

  /** Добавляет одну карточку */
  addItem(data: IProductItem): void {
    if (!this._container) return;
    
    try {
      const card = this._createCard(data);
      this._container.appendChild(card.getElement());
      
      if (this._onCardSelect) {
        card.getElement().addEventListener('click', () => {
          if (this._onCardSelect) {
        this._onCardSelect(data);
      }
        });
      }
    } catch (e) {
      console.error('Failed to add card:', e);
    }
  }

  /** Очищает каталог */
  clear(): void {
    if (this._container) {
      this._container.innerHTML = '';
    }
    this._items = [];
  }
}