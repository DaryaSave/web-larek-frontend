export class UserAPI {
    /**
     * @param api — клиент API для запросов, ожидается endpoint /user
     */
    constructor(api) {
        this._api = api;
    }
    /** Запрашивает данные пользователя с сервера */
    async fetchUser() {
        return await this._api.get('/user');
    }
    /**
     * Обновляет данные пользователя на сервере
     * @param updates — поля для обновления (например, имя, email)
     */
    async updateUser(updates) {
        return await this._api.post('/user', updates, 'PUT');
    }
    /** Удаляет пользователя */
    async deleteUser() {
        await this._api.delete('/user');
    }
}
