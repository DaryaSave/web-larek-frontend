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
  render(totalAmount: number, message: string): void {
    this._total.textContent = `${totalAmount.toFixed(2)} ₽`;
    this._message.textContent = message;
    this.show();
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
