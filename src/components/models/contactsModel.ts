import { Model } from '../views/model.js';
import { ContactsValidator } from './contactsValidator.js';

export interface IContactsData {
  email: string;
  phone: string;
}

export class ContactsModel extends Model<IContactsData> {
  private _validator: ContactsValidator;
  public email: string;
  public phone: string;

  constructor(data: Partial<IContactsData> = {}, events: any) {
    super(data, events);

    // Инициализируем поля с пустыми значениями, если они не переданы
    this.email = data.email || '';
    this.phone = data.phone || '';

    // Создаем валидатор
    this._validator = new ContactsValidator();
  }

  /** Устанавливает email и валидирует его */
  setEmail(email: string): void {
    this.email = email;
    this._validator.validateEmail(email);
    this.emitChanges('contacts:email-changed', {
      email,
      valid: this.isValid(),
    });
  }

  /** Устанавливает телефон и валидирует его */
  setPhone(phone: string): void {
    this.phone = phone;
    this._validator.validatePhone(phone);
    this.emitChanges('contacts:phone-changed', {
      phone,
      valid: this.isValid(),
    });
  }

  /** Устанавливает все контактные данные */
  setContacts(contacts: Partial<IContactsData>): void {
    this.email = contacts.email || '';
    this.phone = contacts.phone || '';
    this._validator.validate(this.getContactsData());
    this.emitChanges('contacts:changed', {
      contacts: this.getContactsData(),
      valid: this.isValid(),
    });
  }

  /** Возвращает объект с контактными данными */
  getContactsData(): IContactsData {
    return {
      email: this.email,
      phone: this.phone,
    };
  }

  /** Проверяет валидность всех данных */
  isValid(): boolean {
    return this._validator.validate(this.getContactsData());
  }

  /** Возвращает ошибки валидации */
  getValidationErrors(): Record<string, string> {
    return this._validator.getErrors();
  }

  /** Получает ошибку для конкретного поля */
  getFieldError(fieldName: keyof IContactsData): string | null {
    return this._validator.getFieldError(fieldName);
  }

  /** Очищает все данные и ошибки */
  clear(): void {
    this.email = '';
    this.phone = '';
    this._validator.clearErrors();
    this.emitChanges('contacts:cleared');
  }

  /** Проверяет, есть ли данные для отправки */
  hasData(): boolean {
    return this.email.trim() !== '' || this.phone.trim() !== '';
  }
}
