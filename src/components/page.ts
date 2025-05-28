export class Page {
  private readonly _counter: HTMLElement;
  private readonly _catalog: HTMLElement;
  private readonly _wrapper: HTMLElement;

  constructor(options: {
    counterSelector: string;
    catalogSelector: string;
    wrapperSelector: string;
  }) {
    this._counter = document.querySelector<HTMLElement>(options.counterSelector);
    if (!this._counter) throw new Error(`Element not found: ${options.counterSelector}`);

    this._catalog = document.querySelector<HTMLElement>(options.catalogSelector);
    if (!this._catalog) throw new Error(`Element not found: ${options.catalogSelector}`);

    this._wrapper = document.querySelector<HTMLElement>(options.wrapperSelector);
    if (!this._wrapper) throw new Error(`Element not found: ${options.wrapperSelector}`);
  }

  /** Блокирует или разблокирует прокрутку страницы */
  locked(isLocked: boolean): void {
    if (isLocked) {
      this._wrapper.classList.add('page__wrapper_locked');
    } else {
      this._wrapper.classList.remove('page__wrapper_locked');
    }
  }

  /** Обновляет счетчик товаров в корзине */
  setCounter(count: number): void {
    this._counter.textContent = String(count);
  }

  /** Очищает каталог товаров */
  clearCatalog(): void {
    this._catalog.innerHTML = '';
  }
}
