/**
 * Менеджер данных пользователя.
 * Загружает и хранит информацию о текущем пользователе.
 */
export class UserInfo {
    /**
     * @param api — клиент API для запросов, ожидается endpoint /user
     */
    constructor(api) {
        this._data = null;
        this._api = api;
    }
    /**
     * Запрашивает данные пользователя с сервера и сохраняет локально.
     */
    async fetchUser() {
        const user = await this._api.get('/user');
        this._data = user;
        return user;
    }
    /**
     * Возвращает текущие данные пользователя.
     * Если данные ещё не загружены, вернёт null.
     */
    getUser() {
        return this._data ? Object.assign({}, this._data) : null;
    }
    /**
     * Обновляет данные пользователя на сервере и локально.
     * @param updates — поля для обновления (например, имя, email)
     */
    async updateUser(updates) {
        if (!this._data) {
            throw new Error('UserInfo: данные пользователя не загружены');
        }
        const updated = await this._api.post('/user', updates, 'PUT');
        this._data = updated;
        return updated;
    }
}
