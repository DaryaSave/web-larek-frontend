export class UserService {
    constructor(userAPI, userInfo) {
        this._userAPI = userAPI;
        this._userInfo = userInfo;
    }
    /** Загружает данные пользователя с сервера и сохраняет локально */
    async loadUser() {
        try {
            const user = await this._userAPI.fetchUser();
            this._userInfo.setUser(user);
            return user;
        }
        catch (error) {
            console.error('Ошибка загрузки пользователя:', error);
            throw error;
        }
    }
    /** Обновляет данные пользователя на сервере и локально */
    async updateUser(updates) {
        try {
            const updatedUser = await this._userAPI.updateUser(updates);
            this._userInfo.setUser(updatedUser);
            return updatedUser;
        }
        catch (error) {
            console.error('Ошибка обновления пользователя:', error);
            throw error;
        }
    }
    /** Возвращает локальные данные пользователя */
    getUser() {
        return this._userInfo.getUser();
    }
    /** Проверяет, загружены ли данные пользователя */
    hasUser() {
        return this._userInfo.hasUser();
    }
    /** Очищает данные пользователя */
    logout() {
        this._userInfo.clearUser();
    }
    /** Возвращает имя пользователя */
    getUserName() {
        return this._userInfo.getUserName();
    }
    /** Возвращает email пользователя */
    getUserEmail() {
        return this._userInfo.getUserEmail();
    }
}
