export class Order {
    constructor(formElement, buttons) {
        this.payment = '';
        this.address = '';
        this._formElement = formElement;
        this._buttons = buttons;
        this.setEventListeners();
    }
    render() {
        // В данном контексте render возвращает форму, 
        // возможно, она уже есть на странице, поэтому просто возвращаем элемент
        return this._formElement;
    }
    setEventListeners() {
        // Обработчик для кнопок оплаты
        this._buttons.forEach((button) => {
            button.addEventListener('click', () => {
                const method = button.dataset.paymentMethod;
                if (method) {
                    this.setPaymentMethod(method);
                }
            });
        });
        // Обработчик для поля адреса
        const addressInput = this._formElement.querySelector('input[name="address"]');
        if (addressInput) {
            addressInput.addEventListener('input', (e) => {
                this.address = e.target.value;
            });
        }
        // Обработчик отправки формы
        this._formElement.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    validate() {
        if (!this.payment) {
            alert('Пожалуйста, выберите способ оплаты');
            return false;
        }
        if (!this.address.trim()) {
            alert('Пожалуйста, введите адрес доставки');
            return false;
        }
        return true;
    }
    setPaymentMethod(method) {
        this.payment = method;
        // Обновляем стили кнопок, выделяя выбранную
        this._buttons.forEach(button => {
            if (button.dataset.paymentMethod === method) {
                button.classList.add('selected'); // предположим, что класс 'selected' выделяет кнопку
            }
            else {
                button.classList.remove('selected');
            }
        });
    }
    async submitOrder() {
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
        }
        catch (error) {
            alert(`Ошибка: ${error.message}`);
        }
    }
    handleSubmit(event) {
        event.preventDefault();
        if (this.validate()) {
            this.submitOrder();
        }
    }
}
