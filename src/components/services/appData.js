/**
 * Менеджер данных приложения: хранит список товаров и корзину,
 * взаимодействует с сервером и UserInfo.
 */
export class AppData {
    /**
     * @param api — клиент API для запросов к серверу
     * @param userInfo — менеджер данных пользователя
     */
    constructor(api, userInfo) {
        this._items = [];
        this._cart = [];
        this._api = api;
        this._userInfo = userInfo;
    }
    /**
     * Инициализация приложения: загрузка пользователя и товаров.
     */
    async initApp() {
        try {
            await this._userInfo.fetchUser();
            const products = await this._api.get('/products');
            this._items = products;
        }
        catch (err) {
            console.error('Ошибка инициализации приложения:', err);
        }
    }
    /** Возвращает все загруженные товары */
    getItems() {
        return [...this._items];
    }
    /**
     * Создаёт новый товар на сервере и добавляет в начало списка.
     */
    async addItem(data) {
        const added = await this._api.post('/products', data);
        this._items.unshift(added);
        return added;
    }
    /**
     * Удаляет товар на сервере и из локального списка.
     */
    async deleteItem(itemId) {
        await this._api.post(`/products/${itemId}`, {}, 'DELETE');
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
