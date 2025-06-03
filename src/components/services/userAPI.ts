import { Api } from './api';
import { IUser } from '../../types';

export class UserAPI {
  private _api: Api;

  /**
   * @param api — клиент API для запросов, ожидается endpoint /user
   */
  constructor(api: Api) {
    this._api = api;
  }

  /** Запрашивает данные пользователя с сервера */
  async fetchUser(): Promise<IUser> {
    return await this._api.get('/user') as IUser;
  }

  /**
   * Обновляет данные пользователя на сервере
   * @param updates — поля для обновления (например, имя, email)
   */
  async updateUser(updates: Partial<IUser>): Promise<IUser> {
    return await this._api.post('/user', updates, 'PUT') as IUser;
  }

  /** Удаляет пользователя */
  async deleteUser(): Promise<void> {
    await this._api.delete('/user');
  }
} 