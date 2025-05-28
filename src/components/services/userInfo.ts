import { Api } from './api';
import { IUser } from '../../types';

export class UserInfo {
  private _api: Api;
  private _data: IUser | null = null;

  /**
   * @param api — клиент API для запросов, ожидается endpoint /user
   */
  constructor(api: Api) {
    this._api = api;
  }

  /** Запрашивает данные пользователя с сервера и сохраняет локально */
  async fetchUser(): Promise<IUser> {
    const user = await this._api.get('/user') as IUser;
    this._data = user;
    return user;
  }

  getUser(): IUser | null {
    return this._data ? { ...this._data } : null;
  }

  /**
   * @param updates — поля для обновления (например, имя, email)
   */
  async updateUser(updates: Partial<IUser>): Promise<IUser> {
    if (!this._data) {
      throw new Error('UserInfo: данные пользователя не загружены');
    }
    const updated = await this._api.post('/user', updates, 'PUT') as IUser;
    this._data = updated;
    return updated;
  }
}
