import { IUser } from '../../types';

export class UserInfo {
  private _data: IUser | null = null;

  /** Устанавливает данные пользователя */
  setUser(user: IUser): void {
    this._data = user;
  }

  /** Возвращает копию данных пользователя */
  getUser(): IUser | null {
    return this._data ? { ...this._data } : null;
  }

  /** Обновляет локальные данные пользователя */
  updateUser(updates: Partial<IUser>): void {
    if (!this._data) {
      throw new Error('UserInfo: данные пользователя не загружены');
    }
    this._data = { ...this._data, ...updates };
  }

  /** Очищает данные пользователя */
  clearUser(): void {
    this._data = null;
  }

  /** Проверяет, загружены ли данные пользователя */
  hasUser(): boolean {
    return this._data !== null;
  }

  /** Возвращает ID пользователя */
  getUserId(): string | null {
    return this._data?.id || null;
  }

  /** Возвращает имя пользователя */
  getUserName(): string | null {
    return this._data?.name || null;
  }

  /** Возвращает email пользователя */
  getUserEmail(): string | null {
    return this._data?.email || null;
  }
}
