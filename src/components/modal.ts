import { IModalData } from '../types';

export class Modal {
  private _popup: HTMLElement;
  private _closeButton: HTMLElement;
  private _content: HTMLElement;

  constructor(popupSelector: string) {
    const popup = document.querySelector<HTMLElement>(popupSelector);
    if (!popup) {
      throw new Error(`Элемент с селектором ${popupSelector} не найден.`);
    }

    this._popup = popup;

    const closeButton = popup.querySelector<HTMLElement>('.modal__close');
    const content = popup.querySelector<HTMLElement>('.modal__content');

    if (!closeButton || !content) {
      throw new Error('Не найдены .modal__close или .modal__content внутри модального окна.');
    }

    this._closeButton = closeButton;
    this._content = content;

    this._closeButton.addEventListener('click', () => this.close());
    this._popup.addEventListener('click', (event) => {
      if (event.target === this._popup) {
        this.close();
      }
    });
  }

  /** Устанавливает новое содержимое модального окна */
  setContent(element: HTMLElement) {
    this._content.innerHTML = '';
    this._content.appendChild(element);
  }

  /** Открывает модальное окно */
  open(): void {
    this._popup.classList.add('modal_active');
  }

  /** Закрывает модальное окно и очищает содержимое */
  close(): void {
    this._popup.classList.remove('modal_active');
    this._content.innerHTML = '';
  }

  /** Отображает данные в модальном окне */
  render(data: IModalData): void {
    this._content = data.content;
    this.open();
  }
}
