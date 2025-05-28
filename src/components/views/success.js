export class Success {
    constructor(totalElement, closeButton, messageElement) {
        this._total = totalElement;
        this._message = messageElement;
        this._close = closeButton;
    }
    /** Отображает сообщение об успешной оплате и сумму */
    render(totalAmount, message) {
        this._total.textContent = `${totalAmount.toFixed(2)} ₽`;
        this._message.textContent = message;
        this.show();
    }
    /** Показывает компонент */
    show() {
        var _a;
        (_a = this._total.closest('.success')) === null || _a === void 0 ? void 0 : _a.classList.add('success_active');
    }
    /** Скрывает компонент */
    hide() {
        var _a;
        (_a = this._total.closest('.success')) === null || _a === void 0 ? void 0 : _a.classList.remove('success_active');
    }
    /** Назначает обработчик для кнопки закрытия */
    setCloseListener(handler) {
        this._close.addEventListener('click', handler);
    }
}
