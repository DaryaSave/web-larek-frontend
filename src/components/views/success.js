export class Success {
    constructor() {
        // Убираем зависимость от предварительной инициализации элементов
    }
    // Отображает сообщение об успешной оплате и сумму 
    render(totalAmount, message) {
        const template = document.querySelector('#success');
        const element = template.content.cloneNode(true);
        const messageElement = element.querySelector('.success__message');
        if (messageElement) {
            messageElement.textContent = message;
        }
        const totalElement = element.querySelector('.order-success__description');
        const closeButton = element.querySelector('.order-success__close');
        if (totalElement) {
            totalElement.textContent = `Списано ${totalAmount.toLocaleString('ru-RU')} синапсов`;
        }
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                // Используем правильный способ закрытия через систему событий
                // Найдем модальное окно и закроем его
                const modalElement = document.querySelector('#modal-container');
                if (modalElement) {
                    const closeBtn = modalElement.querySelector('.modal__close');
                    if (closeBtn) {
                        closeBtn.click(); // Имитируем клик по кнопке закрытия
                    }
                }
            });
        }
        return element.firstElementChild;
    }
}
