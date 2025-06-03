import { EventEmitter } from '../base/events';
export class Modal {
    constructor(popupSelector, events) {
        const popup = document.querySelector(popupSelector);
        if (!popup) {
            throw new Error(`Элемент с селектором ${popupSelector} не найден.`);
        }
        this._popup = popup;
        this._events = events || new EventEmitter();
        const closeButton = popup.querySelector('.modal__close');
        const content = popup.querySelector('.modal__content');
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
    // Устанавливает новое содержимое модального окна 
    setContent(element) {
        this._content.innerHTML = '';
        this._content.appendChild(element);
    }
    // Открывает модальное окно 
    open() {
        this._popup.classList.add('modal_active');
        this._events.emit('modal:open');
    }
    // Закрывает модальное окно и очищает содержимое 
    close() {
        this._popup.classList.remove('modal_active');
        this._content.innerHTML = '';
        this._events.emit('modal:close');
    }
    // Проверяет, открыто ли модальное окно
    isOpen() {
        return this._popup.classList.contains('modal_active');
    }
    // Отображает данные в модальном окне 
    render(data) {
        this._content = data.content;
        this.open();
    }
}
