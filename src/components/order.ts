import { EventEmitter } from '../components/base/events';

export class Order {
  private _formElement: HTMLFormElement;
  private _buttons: HTMLElement[];
  protected _events: EventEmitter;
  public payment = '';
  public address = '';

  constructor(formElement: HTMLFormElement, buttons: HTMLElement[], events: EventEmitter) {
    this._formElement = formElement;
    this._buttons = buttons;
    this._events = events;
    this.setEventListeners();
  }

  render(): HTMLFormElement {
    // В данном контексте render возвращает форму, 
    // возможно, она уже есть на странице, поэтому просто возвращаем элемент
    return this._formElement;
  }

  setEventListeners(): void {
    // Обработчик для кнопок оплаты
    this._buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const method = button.getAttribute('name');
        if (method) {
          this.setPaymentMethod(method);
        }
      });
    });

    // Обработчик для поля адреса
    const addressInput = this._formElement.querySelector<HTMLInputElement>('input[name="address"]');
    if (addressInput) {
      addressInput.addEventListener('input', (e) => {
        this.address = (e.target as HTMLInputElement).value;
        this.validateForm();
      });
    }

    // Обработчик отправки формы
    this._formElement.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  validateForm(): void {
    const submitButton = this._formElement.querySelector<HTMLButtonElement>('.order__button');
    if (submitButton) {
      submitButton.disabled = !(this.payment && this.address.trim());
    }
  }

  setPaymentMethod(method: string): void {
    this.payment = method;
    this._events.emit('payment:changed', method);
    
    // Обновляем стили кнопок
    this._buttons.forEach(button => {
      if (button.getAttribute('name') === method) {
        button.classList.remove('button_alt');
        button.classList.add('button_alt-active');
      } else {
        button.classList.remove('button_alt-active');
        button.classList.add('button_alt');
      }
    });
    
    this.validateForm();
  }

  async submitOrder(): Promise<void> {
    const orderData = {
      payment: this.payment,
      address: this.address.trim(),
    };

    try {
      // Пример отправки запроса на сервер
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error(`Ошибка при отправке заказа: ${response.statusText}`);
      }

      alert('Заказ успешно отправлен!');

      // Очистка корзины и формы (если нужно)
      this._formElement.reset();
      this.payment = '';
      this.address = '';

      this._buttons.forEach(button => button.classList.remove('selected'));

      // Дополнительно можно вызвать колбек очистки корзины, если есть
      // this.clearCart();
    } catch (error) {
      alert(`Ошибка: ${(error as Error).message}`);
    }
  }

  handleSubmit(event: SubmitEvent): void {
    event.preventDefault();

    if (this.payment && this.address.trim()) {
      this._events.emit('contacts:open');
    }
  }
}
