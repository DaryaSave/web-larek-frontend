export class Contacts {
    constructor(formElement) {
        this._formElement = formElement;
        // Ищем в форме поля для телефона и email по селекторам (например, по имени или id)
        this._inputPhone = this._formElement.querySelector('input[name="phone"]');
        if (!this._inputPhone) {
            throw new Error('Поле "phone" не найдено в форме');
        }
        this._inputEmail = this._formElement.querySelector('input[name="email"]');
        if (!this._inputEmail) {
            throw new Error('Поле "email" не найдено в форме');
        }
        // Инициализируем значения из формы
        this.phone = this._inputPhone.value || '';
        this.email = this._inputEmail.value || '';
        // Навешиваем обработчики событий
        this.setEventListeners();
    }
    /** Возвращает DOM-элемент формы */
    render() {
        return this._formElement;
    }
    /** Навешивает обработчики input, обновляет phone и email */
    setEventListeners() {
        this._inputPhone.addEventListener('input', () => {
            this.phone = this._inputPhone.value;
        });
        this._inputEmail.addEventListener('input', () => {
            this.email = this._inputEmail.value;
        });
    }
    /** Проверяет корректность email и телефона */
    validate() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?[0-9\s\-()]{7,}$/;
        const emailValid = emailRegex.test(this.email);
        const phoneValid = phoneRegex.test(this.phone);
        // Можно добавить отображение ошибок в UI, если нужно (например, подсветку полей)
        if (!emailValid) {
            this._inputEmail.setCustomValidity('Неверный формат email');
        }
        else {
            this._inputEmail.setCustomValidity('');
        }
        if (!phoneValid) {
            this._inputPhone.setCustomValidity('Неверный формат телефона');
        }
        else {
            this._inputPhone.setCustomValidity('');
        }
        // Обновляем встроенный механизм валидации формы
        this._inputEmail.reportValidity();
        this._inputPhone.reportValidity();
        return emailValid && phoneValid;
    }
}
