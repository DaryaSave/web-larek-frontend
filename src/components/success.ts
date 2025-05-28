export class Success {
  private _total: HTMLElement;
  private _message: HTMLElement;
  private _close: HTMLElement;

  constructor(totalElement: HTMLElement, closeButton: HTMLElement, messageElement: HTMLElement) {
    this._total = totalElement;
    this._message = messageElement;
    this._close = closeButton;
  }

  /** Отображает сообщение об успешной оплате и сумму */
  render(totalAmount: number, message: string): HTMLElement {
    const template = document.querySelector('#success') as HTMLTemplateElement;
    const element = template.content.cloneNode(true) as DocumentFragment;
    
    const totalElement = element.querySelector('.order-success__description') as HTMLElement;
    const closeButton = element.querySelector('.order-success__close') as HTMLElement;
    
    if (totalElement) {
      totalElement.textContent = `Списано ${totalAmount.toLocaleString('ru-RU')} синапсов`;
    }
    
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        // Закрываем модальное окно
        const modal = document.querySelector('#modal-container') as HTMLElement;
        if (modal) {
          modal.classList.remove('modal_active');
        }
      });
    }
    
    return element.firstElementChild as HTMLElement;
  }

  /** Показывает компонент */
  show(): void {
    this._total.closest('.success')?.classList.add('success_active');
  }

  /** Скрывает компонент */
  hide(): void {
    this._total.closest('.success')?.classList.remove('success_active');
  }

  /** Назначает обработчик для кнопки закрытия */
  setCloseListener(handler: () => void): void {
    this._close.addEventListener('click', handler);
  }
}
