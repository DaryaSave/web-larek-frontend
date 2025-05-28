import { EventEmitter } from '../base/events';

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
        this.validateForm();
    }

    get phone(): string {
        return this._phone;
    }

    set phone(value: string) {
        this._phone = value;
        this.validateForm();
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
        
        // Обработчик отправки формы
        this._formElement.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    validateForm(): void {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?[\d\s\-()]{7,}$/;

        const isEmailValid = emailRegex.test(this.email);
        const isPhoneValid = phoneRegex.test(this.phone);
        const isFormValid = isEmailValid && isPhoneValid;

        const submitButton = this._formElement.querySelector<HTMLButtonElement>('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = !isFormValid;
        }
    }

    handleSubmit(event: SubmitEvent): void {
        event.preventDefault();
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?[\d\s\-()]{7,}$/;

        if (emailRegex.test(this.email) && phoneRegex.test(this.phone)) {
            this._events.emit('order:success');
        }
    }

    // Метод для очистки
    clear(): void {
        this.phone = '';
        this.email = '';
        this._formElement.reset();
    }
}