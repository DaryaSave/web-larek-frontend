import { IProductItem } from '../types';

export class Card {
  private _data: IProductItem;
  private _element: HTMLElement;
  private _handleAddToCart: (item: IProductItem) => void;

  constructor(data: IProductItem, handleAddToCart: (item: IProductItem) => void) {
    this._data = data;
    this._handleAddToCart = handleAddToCart;

    this._element = this._getTemplate();
    this._fillData();
    this._setEventListeners();
  }

  private _getTemplate(): HTMLElement {
    // Находим шаблон по id
    const template = document.getElementById('card-preview') as HTMLTemplateElement;
    if (!template) throw new Error('Шаблон #card-preview не найден');

    // Клонируем содержимое шаблона (первый элемент внутри)
    const firstElement = template.content.firstElementChild;
    if (!firstElement) {
      throw new Error('Шаблон пустой, элемент не найден');
    }
    const card = firstElement.cloneNode(true) as HTMLElement;
    return card;
  }

  private _fillData() {
    const title = this._element.querySelector('.card__title');
    const image = this._element.querySelector('.card__image') as HTMLImageElement;
    const category = this._element.querySelector('.card__category');
    const description = this._element.querySelector('.card__text');
    const price = this._element.querySelector('.card__price');

    if (title) title.textContent = this._data.title;
    if (image) {
      image.src = this._data.imageUrl;
      image.alt = this._data.title;
    }
    if (category) {
      category.textContent = this._data.category;
      // Добавляем класс категории для стилизации
      category.className = `card__category card__category_${this._getCategoryClass(this._data.category)}`;
    }
    if (description) description.textContent = this._data.description;
    if (price) {
      if (this._data.price === null || this._data.price === 0) {
        price.textContent = 'Бесценно';
      } else {
        price.textContent = `${this._data.price.toLocaleString('ru-RU')} синапсов`;
      }
    }
  }

  private _getCategoryClass(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'софт-скил': 'soft',
      'хард-скил': 'hard',
      'другое': 'other',
      'дополнительное': 'additional',
      'кнопка': 'button'
    };
    return categoryMap[category] || 'other';
  }

  private _setEventListeners() {
    const button = this._element.querySelector('.card__button') as HTMLButtonElement;
    if (button) {
      // Если стоимость товара равна "Бесценно" (price === null или 0),
      // отключаем кнопку и не навешиваем обработчик.
      if (this._data.price === null || this._data.price === 0) {
        button.disabled = true;
        button.classList.add('button_disabled');
        // Можно изменить текст кнопки, чтобы отразить неработающее состояние:
        // button.textContent = 'В корзину (бесценно)';
        return;
      }
      // В противном случае навешиваем обработчик клика.
      button.addEventListener('click', () => {
        this._handleAddToCart(this._data);
      });
    }
  }

  public getElement(): HTMLElement {
    return this._element;
  }
}
