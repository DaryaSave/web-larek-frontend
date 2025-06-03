import { Component } from '../views/component';
export class Form extends Component {
    constructor(container, events, initialData) {
        super(container);
        this._events = events;
        this._formData = Object.assign({}, initialData);
        this._formState = { valid: false, errors: [] };
        this._submitButton = this._element.querySelector('button[type="submit"]');
    }
    // Метод для инициализации после того как все поля установлены
    init() {
        this._element.addEventListener('submit', (e) => this.handleSubmit(e));
        this.setEventListeners();
    }
    // Установка значения поля формы
    setField(field, value) {
        this._formData[field] = value;
        this.validateAndUpdate();
    }
    // Получение данных формы
    getData() {
        return Object.assign({}, this._formData);
    }
    // Валидация и обновление состояния
    validateAndUpdate() {
        this._formState = this.validate();
        this.updateSubmitButton();
    }
    // Обновление состояния кнопки отправки
    updateSubmitButton() {
        if (this._submitButton) {
            this.setDisabled(!this._formState.valid);
            this._submitButton.disabled = !this._formState.valid;
        }
    }
    // Обработчик отправки формы
    handleSubmit(event) {
        event.preventDefault();
        if (this._formState.valid) {
            this.onSubmit(this._formData);
        }
    }
    // Сброс формы
    clear() {
        this._element.reset();
        Object.keys(this._formData).forEach(key => {
            this._formData[key] = '';
        });
        this.validateAndUpdate();
    }
    // Отображение ошибок
    showErrors(errors) {
        this._formState.errors = errors;
        this._formState.valid = errors.length === 0;
        this.updateSubmitButton();
        // Можно добавить логику отображения ошибок в UI
        const errorContainer = this._element.querySelector('.form__errors');
        if (errorContainer) {
            errorContainer.innerHTML = errors.map(error => `<span class="form__error">${error}</span>`).join('');
        }
    }
}
