export class Catalog {
    constructor(container, createCard, onCardSelect) {
        this._items = [];
        if (!container)
            throw new Error('Container element is required');
        this._container = container;
        this._createCard = createCard;
        this._onCardSelect = onCardSelect;
    }
    // Отрисовывает все карточки 
    render(items) {
        this.clear();
        this._items = items;
        this._items.forEach(item => this.addItem(item));
    }
    // Добавляет одну карточку 
    addItem(data) {
        if (!this._container)
            return;
        try {
            const cardElement = this.createCatalogCard(data);
            this._container.appendChild(cardElement);
            if (this._onCardSelect) {
                cardElement.addEventListener('click', () => {
                    if (this._onCardSelect) {
                        this._onCardSelect(data);
                    }
                });
            }
        }
        catch (e) {
            console.error('Failed to add card:', e);
        }
    }
    // Создает карточку для каталога 
    createCatalogCard(data) {
        var _a;
        const template = document.querySelector('#card-catalog');
        if (!template)
            throw new Error('Шаблон #card-catalog не найден');
        const element = (_a = template.content.firstElementChild) === null || _a === void 0 ? void 0 : _a.cloneNode(true);
        if (!element)
            throw new Error('Элемент в шаблоне не найден');
        const title = element.querySelector('.card__title');
        const image = element.querySelector('.card__image');
        const category = element.querySelector('.card__category');
        const price = element.querySelector('.card__price');
        if (title)
            title.textContent = data.title;
        if (image) {
            image.src = data.imageUrl;
            image.alt = data.title;
        }
        if (category) {
            category.textContent = data.category;
            category.className = `card__category card__category_${this.getCategoryClass(data.category)}`;
        }
        if (price) {
            if (data.price === null || data.price === 0) {
                price.textContent = 'Бесценно';
            }
            else {
                price.textContent = `${data.price.toLocaleString('ru-RU')} синапсов`;
            }
        }
        return element;
    }
    // Получает класс для категории 
    getCategoryClass(category) {
        const categoryMap = {
            'софт-скил': 'soft',
            'хард-скил': 'hard',
            'другое': 'other',
            'дополнительное': 'additional',
            'кнопка': 'button'
        };
        return categoryMap[category] || 'other';
    }
    // Очищает каталог
    clear() {
        if (this._container) {
            this._container.innerHTML = '';
        }
        this._items = [];
    }
}
