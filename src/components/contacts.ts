import { EventEmitter } from '../components/base/events';

export class Contacts {
    private _formElement: HTMLFormElement;
    private _inputPhone: HTMLInputElement;
    private _inputEmail: HTMLInputElement;
    private _events: EventEmitter;
    private _email = '';
    private _phone = '';

    constructor(formElement: HTMLFormElement, events: EventEmitter) {
        this._formElement = formElement;
        this._events = events;

        // Поиск полей с явным приведением типа
    const inputPhone = this._formElement.querySelector<HTMLInputElement>('input[name="phone"]');
    const inputEmail = this._formElement.querySelector<HTMLInputElement>('input[name="email"]');

      if (!inputPhone || !inputEmail) {
      throw new Error('Не найдены обязательные поля формы');
        }

        this._inputPhone = inputPhone;
        this._inputEmail = inputEmail;
        this.setEventListeners();
    }

    // Геттеры и сеттеры для валидации при изменении
    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
        this._events.emit('contacts:email', value);
    }

    get phone(): string {
        return this._phone;
    }

    set phone(value: string) {
        this._phone = value;
        this._events.emit('contacts:phone', value);
    }

    render(): HTMLFormElement {
        return this._formElement;
    }

    private handleInput = (field: 'phone' | 'email', value: string) => {
        this[field] = value;
    };

    setEventListeners(): void {
        this._inputPhone.addEventListener('input', () => 
            this.handleInput('phone', this._inputPhone.value)
        );
        this._inputEmail.addEventListener('input', () => 
            this.handleInput('email', this._inputEmail.value)
        );
    }

    validate(): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?[\d\s\-()]{7,}$/;

        const isValid = {
            email: emailRegex.test(this.email),
            phone: phoneRegex.test(this.phone)
        };

        this._inputEmail.setCustomValidity(
            isValid.email ? '' : 'Неверный формат email'
        );
        this._inputPhone.setCustomValidity(
            isValid.phone ? '' : 'Неверный формат телефона'
        );

        // Принудительное обновление состояния валидации
        this._formElement.classList.toggle('form_invalid', !(isValid.email && isValid.phone));
        
        return isValid.email && isValid.phone;
    }

    // Метод для очистки
    clear() {
        this.phone = '';
        this.email = '';
        this._formElement.reset();
        this._formElement.classList.remove('form_invalid');
    }
}