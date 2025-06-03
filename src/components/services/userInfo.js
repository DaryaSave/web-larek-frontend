export class UserInfo {
    constructor() {
        this._data = null;
    }
    /** Устанавливает данные пользователя */
    setUser(user) {
        this._data = user;
    }
    /** Возвращает копию данных пользователя */
    getUser() {
        return this._data ? Object.assign({}, this._data) : null;
    }
    /** Обновляет локальные данные пользователя */
    updateUser(updates) {
        if (!this._data) {
            throw new Error('UserInfo: данные пользователя не загружены');
        }
        this._data = Object.assign(Object.assign({}, this._data), updates);
    }
    /** Очищает данные пользователя */
    clearUser() {
        this._data = null;
    }
    /** Проверяет, загружены ли данные пользователя */
    hasUser() {
        return this._data !== null;
    }
    /** Возвращает ID пользователя */
    getUserId() {
        var _a;
        return ((_a = this._data) === null || _a === void 0 ? void 0 : _a.id) || null;
    }
    /** Возвращает имя пользователя */
    getUserName() {
        var _a;
        return ((_a = this._data) === null || _a === void 0 ? void 0 : _a.name) || null;
    }
    /** Возвращает email пользователя */
    getUserEmail() {
        var _a;
        return ((_a = this._data) === null || _a === void 0 ? void 0 : _a.email) || null;
    }
}
