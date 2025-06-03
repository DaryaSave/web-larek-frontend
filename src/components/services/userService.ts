import { UserAPI } from './userAPI';
import { UserInfo } from './userInfo';
import { IUser } from '../../types';

export class UserService {
  private _userAPI: UserAPI;
  private _userInfo: UserInfo;

  constructor(userAPI: UserAPI, userInfo: UserInfo) {
    this._userAPI = userAPI;
    this._userInfo = userInfo;
  }

  /** Загружает данные пользователя с сервера и сохраняет локально */
  async loadUser(): Promise<IUser> {
    try {
      const user = await this._userAPI.fetchUser();
      this._userInfo.setUser(user);
      return user;
    } catch (error) {
      console.error('Ошибка загрузки пользователя:', error);
      throw error;
    }
  }

  /** Обновляет данные пользователя на сервере и локально */
  async updateUser(updates: Partial<IUser>): Promise<IUser> {
    try {
      const updatedUser = await this._userAPI.updateUser(updates);
      this._userInfo.setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Ошибка обновления пользователя:', error);
      throw error;
    }
  }

  /** Возвращает локальные данные пользователя */
  getUser(): IUser | null {
    return this._userInfo.getUser();
  }

  /** Проверяет, загружены ли данные пользователя */
  hasUser(): boolean {
    return this._userInfo.hasUser();
  }

  /** Очищает данные пользователя */
  logout(): void {
    this._userInfo.clearUser();
  }

  /** Возвращает имя пользователя */
  getUserName(): string | null {
    return this._userInfo.getUserName();
  }

  /** Возвращает email пользователя */
  getUserEmail(): string | null {
    return this._userInfo.getUserEmail();
  }
} 