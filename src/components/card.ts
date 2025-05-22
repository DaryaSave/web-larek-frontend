interface IProductItem {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  category: string;
  description: string;
}
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
    const button = this._element.querySelector('.card__button');
    if (button) {
  button.textContent = 'Добавить в корзину';
}


    if (title) title.textContent = this._data.title;
    if (image) {
      image.src = this._data.imageUrl;
      image.alt = this._data.title;
    }
    if (category) category.textContent = this._data.category;
    if (description) description.textContent = this._data.description;
    if (price) price.textContent = `${this._data.price.toLocaleString()} синапсов`;
  }

  private _setEventListeners() {
    const button = this._element.querySelector('.card__button');
    if (!button) throw new Error('Кнопка card__button не найдена');
    button.addEventListener('click', () => {
      this._handleAddToCart(this._data);
      button.textContent = 'В корзине';
      button.setAttribute('disabled', 'true');
    });
  }

  getElement(): HTMLElement {
    return this._element;
  }
}
