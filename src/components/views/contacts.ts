import { EventEmitter } from '../base/events';
import { Form, IFormState } from '../base/form';
import { ContactsFormModel, IContactsData } from '../models/formModel';

export class Contacts extends Form<IContactsData> {
    private _model: ContactsFormModel;
    private _inputPhone: HTMLInputElement | null;
    private _inputEmail: HTMLInputElement | null;

    constructor(formElement: HTMLFormElement, events: EventEmitter) {
        const model = new ContactsFormModel();
        super(formElement, events, model.getData());
        this._model = model;

        // Кэшируем элементы один раз
        this._inputPhone = this._element.querySelector<HTMLInputElement>('input[name="phone"]');
        this._inputEmail = this._element.querySelector<HTMLInputElement>('input[name="email"]');

        if (!this._inputPhone || !this._inputEmail) {
            throw new Error('Не найдены обязательные поля формы');
        }
        
        // Теперь вызываем init после того как все поля установлены
        this.init();
    }

    protected setEventListeners(): void {
        if (this._inputPhone) {
            this._inputPhone.addEventListener('input', () => {
                const value = this._inputPhone!.value;
                this.setField('phone', value);
                this._model.setField('phone', value);
            });
        }

        if (this._inputEmail) {
            this._inputEmail.addEventListener('input', () => {
                const value = this._inputEmail!.value;
                this.setField('email', value);
                this._model.setField('email', value);
            });
        }
    }

    protected validate(): IFormState {
        const errors: string[] = [];
        const modelErrors = this._model.getErrors();
        
        Object.values(modelErrors).forEach(fieldErrors => {
            errors.push(...fieldErrors);
        });

        return {
            valid: this._model.isValid(),
            errors
        };
    }

    protected onSubmit(data: IContactsData): void {
        // Передаем данные наверх через событие, без валидации в View
        this._events.emit('contacts:submit', data);
        this._events.emit('order:success');
    }

    // Переопределяем clear для сброса модели
    clear(): void {
        super.clear();
        this._model.clear();
    }
}