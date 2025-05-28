export class Basket {
    constructor(container, totalElement, createBasketItem) {
        this._items = [];
        this._container = container;
        this._total = totalElement;
        this._createBasketItem = createBasketItem;
    }
    render() {
        this._container.innerHTML = '';
        this._items.forEach((item) => {
            const element = this._createBasketItem(item);
            this._container.appendChild(element);
        });
        this.updateTotal();
    }
    addItem(data) {
        // Проверка на дубли (по id)
        const existingItem = this._items.find((item) => item.id === data.id);
        if (!existingItem) {
            this._items.push(data);
            this.render();
        }
    }
    removeItem(itemId) {
        this._items = this._items.filter((item) => item.id !== itemId);
        this.render();
    }
    clear() {
        this._items = [];
        this.render();
    }
    getItems() {
        return this._items;
    }
    updateTotal() {
        const total = this._items.reduce((sum, item) => sum + item.price, 0);
        this._total.textContent = `${total.toLocaleString()} ₽`;
    }
}
export const createBasketItem = (item) => {
    const basketItemTemplate = document.querySelector('#card-basket');
    const itemElement = basketItemTemplate.content.cloneNode(true);
    const titleEl = itemElement.querySelector('.card__title');
    const priceEl = itemElement.querySelector('.card__price');
    titleEl.textContent = item.title;
    priceEl.textContent = `${item.price.toLocaleString()} синапсов`;
    return itemElement;
};
