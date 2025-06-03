import { EventEmitter } from './events';
import { Component } from '../views/component';

export interface IFormState {
  valid: boolean;
  errors: string[];
}

export abstract class Form<T extends Record<string, string>> extends Component<HTMLFormElement> {
  protected _submitButton: HTMLButtonElement | null;
  protected _events: EventEmitter;
  protected _formData: T;
  protected _formState: IFormState;

  constructor(
    container: HTMLFormElement,
    events: EventEmitter,
    initialData: T
  ) {
    super(container);
    this._events = events;
    this._formData = { ...initialData };
    this._formState = { valid: false, errors: [] };
    this._submitButton = this._element.querySelector<HTMLButtonElement>('button[type="submit"]');
  }

  // Метод для инициализации после того как все поля установлены
  protected init(): void {
    this._element.addEventListener('submit', (e) => this.handleSubmit(e));
    this.setEventListeners();
  }

  // Абстрактные методы, которые должны реализовать наследники
  protected abstract setEventListeners(): void;
  protected abstract validate(): IFormState;

  // Установка значения поля формы
  protected setField(field: keyof T, value: string): void {
    (this._formData as any)[field] = value;
    this.validateAndUpdate();
  }

  // Получение данных формы
  getData(): T {
    return { ...this._formData };
  }

  // Валидация и обновление состояния
  protected validateAndUpdate(): void {
    this._formState = this.validate();
    this.updateSubmitButton();
  }

  // Обновление состояния кнопки отправки
  protected updateSubmitButton(): void {
    if (this._submitButton) {
      this.setDisabled(!this._formState.valid);
      this._submitButton.disabled = !this._formState.valid;
    }
  }

  // Обработчик отправки формы
  protected handleSubmit(event: SubmitEvent): void {
    event.preventDefault();
    
    if (this._formState.valid) {
      this.onSubmit(this._formData);
    }
  }

  // Метод для переопределения в наследниках
  protected abstract onSubmit(data: T): void;

  // Сброс формы
  clear(): void {
    this._element.reset();
    Object.keys(this._formData).forEach(key => {
      (this._formData as any)[key] = '';
    });
    this.validateAndUpdate();
  }

  // Отображение ошибок
  showErrors(errors: string[]): void {
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