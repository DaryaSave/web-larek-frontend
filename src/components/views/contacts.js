import { Form } from '../base/form';
import { ContactsFormModel } from '../models/formModel';
export class Contacts extends Form {
    constructor(formElement, events) {
        const model = new ContactsFormModel();
        super(formElement, events, model.getData());
        this._model = model;
        // Кэшируем элементы один раз
        this._inputPhone = this._element.querySelector('input[name="phone"]');
        this._inputEmail = this._element.querySelector('input[name="email"]');
        if (!this._inputPhone || !this._inputEmail) {
            throw new Error('Не найдены обязательные поля формы');
        }
        // Теперь вызываем init после того как все поля установлены
        this.init();
    }
    setEventListeners() {
        if (this._inputPhone) {
            this._inputPhone.addEventListener('input', () => {
                const value = this._inputPhone.value;
                this.setField('phone', value);
                this._model.setField('phone', value);
            });
        }
        if (this._inputEmail) {
            this._inputEmail.addEventListener('input', () => {
                const value = this._inputEmail.value;
                this.setField('email', value);
                this._model.setField('email', value);
            });
        }
    }
    validate() {
        const errors = [];
        const modelErrors = this._model.getErrors();
        Object.values(modelErrors).forEach(fieldErrors => {
            errors.push(...fieldErrors);
        });
        return {
            valid: this._model.isValid(),
            errors
        };
    }
    onSubmit(data) {
        // Передаем данные наверх через событие, без валидации в View
        this._events.emit('contacts:submit', data);
        this._events.emit('order:success');
    }
    // Переопределяем clear для сброса модели
    clear() {
        super.clear();
        this._model.clear();
    }
}
