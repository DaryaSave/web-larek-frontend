export class Success {
  constructor() {
    // Убираем зависимость от предварительной инициализации элементов
  }

  // Отображает сообщение об успешной оплате и сумму 
  render(totalAmount: number, message: string): HTMLElement {
    const template = document.querySelector('#success') as HTMLTemplateElement;
    const element = template.content.cloneNode(true) as DocumentFragment;
    const messageElement = element.querySelector('.success__message') as HTMLElement;

    if (messageElement) {
       messageElement.textContent = message;
    }

    const totalElement = element.querySelector('.order-success__description') as HTMLElement;
    const closeButton = element.querySelector('.order-success__close') as HTMLElement;
    
    if (totalElement) {
      totalElement.textContent = `Списано ${totalAmount.toLocaleString('ru-RU')} синапсов`;
    }
    
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        // Используем правильный способ закрытия через систему событий
        // Найдем модальное окно и закроем его
        const modalElement = document.querySelector('#modal-container') as HTMLElement;
        if (modalElement) {
          const closeBtn = modalElement.querySelector('.modal__close') as HTMLButtonElement;
          if (closeBtn) {
            closeBtn.click(); // Имитируем клик по кнопке закрытия
          }
        }
      });
    }
    
    return element.firstElementChild as HTMLElement;
  }
}
