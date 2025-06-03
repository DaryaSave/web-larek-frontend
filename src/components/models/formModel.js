export class FormModel {
    constructor(initialData) {
        this._errors = {};
        this._valid = false;
        this._data = Object.assign({}, initialData);
        this.validate();
    }
    // Установка значения поля
    setField(field, value) {
        this._data[field] = value;
        this.validate();
    }
    // Получение данных
    getData() {
        return Object.assign({}, this._data);
    }
    // Получение ошибок
    getErrors() {
        return Object.assign({}, this._errors);
    }
    // Проверка валидности
    isValid() {
        return this._valid;
    }
    // Очистка данных
    clear() {
        Object.keys(this._data).forEach(key => {
            this._data[key] = '';
        });
        this.validate();
    }
}
export class OrderFormModel extends FormModel {
    constructor() {
        super({ payment: '', address: '' });
    }
    validate() {
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
export class ContactsFormModel extends FormModel {
    constructor() {
        super({ email: '', phone: '' });
    }
    validate() {
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
