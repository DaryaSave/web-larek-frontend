export class Page {
  private readonly _counter: HTMLElement;
  private readonly _catalog: HTMLElement;
  private readonly _wrapper: HTMLElement;
  private readonly _basket: HTMLElement;

  constructor(options: {
    counterSelector: string;
    catalogSelector: string;
    wrapperSelector: string;
    basketSelector: string;
  }) {
    this._counter = document.querySelector<HTMLElement>(options.counterSelector);
    if (!this._counter) throw new Error(`Element not found: ${options.counterSelector}`);

    this._catalog = document.querySelector<HTMLElement>(options.catalogSelector);
    if (!this._catalog) throw new Error(`Element not found: ${options.catalogSelector}`);

    this._wrapper = document.querySelector<HTMLElement>(options.wrapperSelector);
    if (!this._wrapper) throw new Error(`Element not found: ${options.wrapperSelector}`);

    this._basket = document.querySelector<HTMLElement>(options.basketSelector);
    if (!this._basket) throw new Error(`Element not found: ${options.basketSelector}`);
  }
  

  // Блокирует или разблокирует прокрутку страницы 
  locked(isLocked: boolean): void {
    if (isLocked) {
      this._wrapper.classList.add('page__wrapper_locked');
    } else {
      this._wrapper.classList.remove('page__wrapper_locked');
    }
  }

  // Обновляет счетчик товаров в корзине 
  setCounter(count: number): void {
    this._counter.textContent = String(count);
  }

  // Очищает каталог товаров 
  clearCatalog(): void {
    this._catalog.innerHTML = '';
  }

  // Открывает или закрывает корзину 
  toggleBasket(isOpen: boolean): void {
    if (isOpen) {
      this._basket.classList.add('basket--open');
    } else {
      this._basket.classList.remove('basket--open');
    }
  }
}
