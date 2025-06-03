export class AppState {
    constructor(initialState = {}) {
        var _a, _b, _c, _d, _e, _f;
        this.basket = (_a = initialState.basket) !== null && _a !== void 0 ? _a : [];
        this.catalog = (_b = initialState.catalog) !== null && _b !== void 0 ? _b : [];
        this.order = {
            items: (_d = (_c = initialState.order) === null || _c === void 0 ? void 0 : _c.items) !== null && _d !== void 0 ? _d : [],
            total: (_f = (_e = initialState.order) === null || _e === void 0 ? void 0 : _e.total) !== null && _f !== void 0 ? _f : 0,
        };
    }
    /** Возвращает сумму цен товаров в корзине */
    getTotal() {
        return this.basket.reduce((sum, item) => sum + item.price, 0);
    }
    /** Устанавливает данные каталога */
    setCatalog(products) {
        console.log('Полученные данные из API:', products);
        this.catalog = [...products];
    }
    /** Добавляет товар в корзину, если его там нет, и обновляет заказ */
    addToBasket(product) {
        if (!this.basket.some(p => p.id === product.id)) {
            this.basket.push(product);
            this.updateOrder();
        }
    }
    /** Удаляет товар из корзины и обновляет заказ */
    removeFromBasket(id) {
        this.basket = this.basket.filter(item => item.id !== id);
        this.updateOrder();
    }
    /** Очищает корзину и сбрасывает заказ */
    clearBasket() {
        this.basket = [];
        this.clearOrder();
    }
    /** Очищает данные заказа */
    clearOrder() {
        this.order = { items: [], total: 0 };
    }
    /** Проверяет наличие товара в корзине */
    checkProduct(productId) {
        return this.basket.some(p => p.id === productId);
    }
    /** Обновляет поля заказа (items и total) на основе корзины */
    updateOrder() {
        this.order.items = this.basket.map(item => ({ product: item, quantity: 1 }));
        this.order.total = this.getTotal();
    }
}
