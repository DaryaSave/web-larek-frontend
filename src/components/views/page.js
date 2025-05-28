export class Page {
    constructor(options) {
        this._counter = document.querySelector(options.counterSelector);
        if (!this._counter)
            throw new Error(`Element not found: ${options.counterSelector}`);
        this._catalog = document.querySelector(options.catalogSelector);
        if (!this._catalog)
            throw new Error(`Element not found: ${options.catalogSelector}`);
        this._wrapper = document.querySelector(options.wrapperSelector);
        if (!this._wrapper)
            throw new Error(`Element not found: ${options.wrapperSelector}`);
        this._basket = document.querySelector(options.basketSelector);
        if (!this._basket)
            throw new Error(`Element not found: ${options.basketSelector}`);
    }
    /** Блокирует или разблокирует прокрутку страницы */
    locked(isLocked) {
        this._wrapper.style.overflow = isLocked ? 'hidden' : '';
    }
    /** Обновляет счетчик товаров в корзине */
    setCounter(count) {
        this._counter.textContent = String(count);
    }
    /** Очищает каталог товаров */
    clearCatalog() {
        this._catalog.innerHTML = '';
    }
    /** Открывает или закрывает корзину */
    toggleBasket(isOpen) {
        this._basket.classList.toggle('basket--open', isOpen);
        this.locked(isOpen);
    }
}
