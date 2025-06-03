/**
 * Класс валидации контактных данных
 * Отвечает за проверку корректности email и телефона согласно бизнес-логике
 */
export class ContactsValidator {
    constructor() {
        // Регулярные выражения для валидации
        this._emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        this._phoneRegex = /^\+?[0-9\s\-()]{7,}$/;
        // Хранение ошибок валидации
        this._errors = {};
    }
    /** Валидирует email */
    validateEmail(email) {
        if (!email || !email.trim()) {
            this._errors.email = 'Email обязателен для заполнения';
            return false;
        }
        if (!this._emailRegex.test(email.trim())) {
            this._errors.email = 'Неверный формат email';
            return false;
        }
        delete this._errors.email;
        return true;
    }
    /** Валидирует телефон */
    validatePhone(phone) {
        if (!phone || !phone.trim()) {
            this._errors.phone = 'Телефон обязателен для заполнения';
            return false;
        }
        if (!this._phoneRegex.test(phone.trim())) {
            this._errors.phone = 'Неверный формат телефона';
            return false;
        }
        delete this._errors.phone;
        return true;
    }
    /** Валидирует все контактные данные */
    validate(contactsData) {
        const emailValid = this.validateEmail(contactsData.email);
        const phoneValid = this.validatePhone(contactsData.phone);
        return emailValid && phoneValid;
    }
    /** Возвращает ошибки валидации */
    getErrors() {
        return Object.assign({}, this._errors);
    }
    /** Проверяет наличие ошибок */
    hasErrors() {
        return Object.keys(this._errors).length > 0;
    }
    /** Очищает все ошибки */
    clearErrors() {
        this._errors = {};
    }
    /** Получает ошибку для конкретного поля */
    getFieldError(fieldName) {
        return this._errors[fieldName] || null;
    }
}
