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
        // Клонируем содержимое шаблона
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
        if (title)
            title.textContent = this._data.title;
        if (image) {
            image.src = this._data.imageUrl;
            image.alt = this._data.title;
        }
        if (category) {
            category.textContent = this._data.category;
            // Добавляем класс категории для стилизации
            category.className = `card__category card__category_${this._getCategoryClass(this._data.category)}`;
        }
        if (description)
            description.textContent = this._data.description;
        if (price) {
            if (this._data.price === null || this._data.price === 0) {
                price.textContent = 'Бесценно';
            }
            else {
                price.textContent = `${this._data.price.toLocaleString('ru-RU')} синапсов`;
            }
        }
    }
    _getCategoryClass(category) {
        const categoryMap = {
            'софт-скил': 'soft',
            'хард-скил': 'hard',
            'другое': 'other',
            'дополнительное': 'additional',
            'кнопка': 'button'
        };
        return categoryMap[category] || 'other';
    }
    _setEventListeners() {
        const button = this._element.querySelector('.card__button');
        if (button) {
            // Если стоимость товара равна "Бесценно" (price === null или 0),
            // отключаем кнопку и не навешиваем обработчик.
            if (this._data.price === null || this._data.price === 0) {
                button.disabled = true;
                button.classList.add('button_disabled');
                return;
            }
            // В противном случае навешиваем обработчик клика.
            button.addEventListener('click', () => {
                this._handleAddToCart(this._data);
            });
        }
    }
    getElement() {
        return this._element;
    }
}
