export class Catalog {
    constructor(container, createCard, onCardSelect) {
        this._items = [];
        if (!container)
            throw new Error('Container element is required');
        this._container = container;
        this._createCard = createCard;
        this._onCardSelect = onCardSelect;
    }
    /** Отрисовывает все карточки */
    render(items) {
        this.clear();
        this._items = items;
        this._items.forEach(item => this.addItem(item));
    }
    /** Добавляет одну карточку */
    addItem(data) {
        if (!this._container)
            return;
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
        }
        catch (e) {
            console.error('Failed to add card:', e);
        }
    }
    /** Очищает каталог */
    clear() {
        if (this._container) {
            this._container.innerHTML = '';
        }
        this._items = [];
    }
}
