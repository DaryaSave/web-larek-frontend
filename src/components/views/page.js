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
    // Блокирует или разблокирует прокрутку страницы 
    locked(isLocked) {
        if (isLocked) {
            this._wrapper.classList.add('page__wrapper_locked');
        }
        else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }
    // Обновляет счетчик товаров в корзине 
    setCounter(count) {
        this._counter.textContent = String(count);
    }
    // Очищает каталог товаров 
    clearCatalog() {
        this._catalog.innerHTML = '';
    }
    // Открывает или закрывает корзину 
    toggleBasket(isOpen) {
        if (isOpen) {
            this._basket.classList.add('basket--open');
        }
        else {
            this._basket.classList.remove('basket--open');
        }
    }
}
