export class AppData {
    constructor() {
        this._items = [];
        this._cart = [];
    }
    /** Устанавливает список товаров */
    setItems(items) {
        this._items = items;
    }
    /** Возвращает все загруженные товары */
    getItems() {
        return [...this._items];
    }
    /** Добавляет товар в начало списка */
    addItem(item) {
        this._items.unshift(item);
    }
    /** Удаляет товар из локального списка */
    deleteItem(itemId) {
        this._items = this._items.filter(item => item.id !== itemId);
    }
    /** Добавляет товар в корзину, если ещё не был добавлен */
    addToCart(item) {
        if (!this._cart.find(i => i.id === item.id)) {
            this._cart.push(item);
        }
    }
    /** Удаляет товар из корзины по ID */
    removeFromCart(itemId) {
        this._cart = this._cart.filter(item => item.id !== itemId);
    }
    /** Возвращает текущее содержимое корзины */
    getCart() {
        return [...this._cart];
    }
    /** Полностью очищает корзину */
    clearCart() {
        this._cart = [];
    }
}
