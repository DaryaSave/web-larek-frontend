import { Form } from '../base/form';
import { OrderFormModel } from '../models/formModel';
export class Order extends Form {
    constructor(formElement, buttons, events) {
        // Инициализируем поля ДО вызова super
        const model = new OrderFormModel();
        super(formElement, events, model.getData());
        // Инициализируем остальные поля после super
        this._buttons = buttons;
        this._model = model;
        this._addressInput = this._element.querySelector('input[name="address"]');
        // Теперь вызываем init после того как все поля установлены
        this.init();
    }
    cacheElements() {
        // Все элементы уже кэшированы в конструкторе
    }
    setEventListeners() {
        // Проверяем, что buttons инициализированы
        if (!this._buttons) {
            console.error('Buttons not initialized');
            return;
        }
        // Обработчики для кнопок оплаты
        this._buttons.forEach((button) => {
            button.addEventListener('click', () => {
                const method = button.getAttribute('name');
                if (method) {
                    this.setPaymentMethod(method);
                }
            });
        });
        // Обработчик для поля адреса
        if (this._addressInput) {
            this._addressInput.addEventListener('input', (e) => {
                const value = e.target.value;
                this.setField('address', value);
                this._model.setField('address', value);
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
    setPaymentMethod(method) {
        this.setField('payment', method);
        this._model.setField('payment', method);
        this._events.emit('payment:changed', method);
        // Обновляем стили кнопок
        this._buttons.forEach(button => {
            if (button.getAttribute('name') === method) {
                button.classList.remove('button_alt');
                button.classList.add('button_alt-active');
            }
            else {
                button.classList.remove('button_alt-active');
                button.classList.add('button_alt');
            }
        });
    }
    onSubmit(data) {
        // Передаем данные наверх через событие, без прямых API запросов
        this._events.emit('order:submit', data);
        this._events.emit('contacts:open');
    }
    // Переопределяем clear для сброса модели
    clear() {
        super.clear();
        this._model.clear();
        // Сброс стилей кнопок
        if (this._buttons) {
            this._buttons.forEach(button => {
                button.classList.remove('button_alt-active');
                button.classList.add('button_alt');
            });
        }
    }
}
