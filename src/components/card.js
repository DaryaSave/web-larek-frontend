export class Card {
    constructor(data, handleAddToCart) {
        this._data = data;
        this._handleAddToCart = handleAddToCart;
        this._element = this._getTemplate();
        this._fillData();
        this._setEventListeners();
    }
    _getTemplate() {
        // Находим шаблон по id
        const template = document.getElementById('card-preview');
        if (!template)
            throw new Error('Шаблон #card-preview не найден');
        // Клонируем содержимое шаблона (первый элемент внутри)
        const firstElement = template.content.firstElementChild;
        if (!firstElement) {
            throw new Error('Шаблон пустой, элемент не найден');
        }
        const card = firstElement.cloneNode(true);
        return card;
    }
    _fillData() {
        const title = this._element.querySelector('.card__title');
        const image = this._element.querySelector('.card__image');
        const category = this._element.querySelector('.card__category');
        const description = this._element.querySelector('.card__text');
        const price = this._element.querySelector('.card__price');
        const button = this._element.querySelector('.card__button');
        if (button) {
            button.textContent = 'Добавить в корзину';
        }
        if (title)
            title.textContent = this._data.title;
        if (image) {
            image.src = this._data.imageUrl;
            image.alt = this._data.title;
        }
        if (category)
            category.textContent = this._data.category;
        if (description)
            description.textContent = this._data.description;
        if (price)
            price.textContent = `${this._data.price.toLocaleString()} синапсов`;
    }
    _setEventListeners() {
        const button = this._element.querySelector('.card__button');
        if (!button)
            throw new Error('Кнопка card__button не найдена');
        button.addEventListener('click', () => {
            this._handleAddToCart(this._data);
            button.textContent = 'В корзине';
            button.setAttribute('disabled', 'true');
        });
    }
    getElement() {
        return this._element;
    }
}
