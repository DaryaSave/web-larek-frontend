export class Basket {
    constructor(container, totalElement, createBasketItem, events) {
        this.events = events;
        this._items = [];
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
    render(items) {
        this._items = items;
        // Очищает контейнер, чтобы убрать старую разметку.
        this._container.innerHTML = '';
        // Отрисовывает каждый товар из массива
        items.forEach((item, index) => {
            const itemWithIndex = Object.assign(Object.assign({}, item), { index: index + 1 });
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
    updateCheckoutButton() {
        const isEmpty = this._items.length === 0;
        this._checkoutButton.disabled = isEmpty;
        if (isEmpty) {
            this._checkoutButton.classList.add('button_disabled');
        }
        else {
            this._checkoutButton.classList.remove('button_disabled');
        }
    }
    addItem(item) {
        // Если товара с таким id ещё нет в корзине, добавляем его.
        if (!this._items.some(existing => existing.id === item.id)) {
            this._items.push(Object.assign(Object.assign({}, item), { index: this._items.length + 1 }));
            this.render(this._items);
        }
    }
    removeItem(itemId) {
        this._items = this._items
            .filter(item => item.id !== itemId)
            .map((item, index) => (Object.assign(Object.assign({}, item), { index: index + 1 })));
        this.render(this._items);
    }
    get items() {
        return this._items;
    }
    get total() {
        return this._items.reduce((sum, item) => sum + (item.price || 0), 0);
    }
}
// Утилитная функция для создания DOM-элемента для товара в корзине. 
export function createBasketItem(item, events) {
    const li = document.createElement('li');
    li.classList.add('basket__item', 'card', 'card_compact');
    li.innerHTML = `
    <span class="basket__item-index">${item.index}</span>
    <span class="card__title">${item.title}</span>
    <span class="card__price">${item.price} синапсов</span>
    <button class="basket__item-delete card__button" aria-label="удалить"></button>
  `;
    const deleteButton = li.querySelector('.basket__item-delete');
    if (deleteButton) {
        deleteButton.addEventListener('click', () => {
            events.emit('basket:remove', item.id);
        });
    }
    return li;
}
