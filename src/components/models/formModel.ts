export interface IFormData {
  [key: string]: string;
}

export interface IFormErrors {
  [key: string]: string[];
}

export interface IFormModel<T extends IFormData> {
  data: T;
  errors: IFormErrors;
  valid: boolean;
}

export abstract class FormModel<T extends IFormData> {
  protected _data: T;
  protected _errors: IFormErrors = {};
  protected _valid = false;

  constructor(initialData: T) {
    this._data = { ...initialData };
    this.validate();
  }

  // Установка значения поля
  setField(field: keyof T, value: string): void {
    (this._data as any)[field] = value;
    this.validate();
  }

  // Получение данных
  getData(): T {
    return { ...this._data };
  }

  // Получение ошибок
  getErrors(): IFormErrors {
    return { ...this._errors };
  }

  // Проверка валидности
  isValid(): boolean {
    return this._valid;
  }

  // Очистка данных
  clear(): void {
    Object.keys(this._data).forEach(key => {
      (this._data as any)[key] = '';
    });
    this.validate();
  }

  // Абстрактный метод валидации
  protected abstract validate(): void;
}

// Модель формы заказа
export interface IOrderData extends IFormData {
  payment: string;
  address: string;
}

export class OrderFormModel extends FormModel<IOrderData> {
  constructor() {
    super({ payment: '', address: '' });
  }

  protected validate(): void {
    this._errors = {};
    const data = this._data;

    if (!data.payment) {
      this._errors.payment = ['Необходимо выбрать способ оплаты'];
    }

    if (!data.address.trim()) {
      this._errors.address = ['Необходимо указать адрес доставки'];
    }

    this._valid = Object.keys(this._errors).length === 0;
  }
}

// Модель формы контактов
export interface IContactsData extends IFormData {
  email: string;
  phone: string;
}

export class ContactsFormModel extends FormModel<IContactsData> {
  constructor() {
    super({ email: '', phone: '' });
  }

  protected validate(): void {
    this._errors = {};
    const data = this._data;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      this._errors.email = ['Некорректный формат email'];
    }

    const phoneRegex = /^\+?[\d\s\-()]{7,}$/;
    if (!phoneRegex.test(data.phone)) {
      this._errors.phone = ['Некорректный формат телефона'];
    }

    this._valid = Object.keys(this._errors).length === 0;
  }
} 