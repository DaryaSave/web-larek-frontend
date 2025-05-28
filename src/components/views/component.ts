export class Component<T extends HTMLElement> {
  protected _element: T;

  /**
   * @param element Корневой DOM-элемент компонента.
   */
  constructor(element: T) {
    this._element = element;
  }

  // Добавляет или убирает CSS-класс у элемента
  toggleClass(className: string): void {
    this._element.classList.toggle(className);
  }

  // Устанавливает текстовое содержимое элемента
  setText(text: string): void {
    this._element.textContent = text;
  }

  // Включает или выключает элемент через атрибут disabled
  setDisabled(isDisabled: boolean): void {
    if (isDisabled) {
      this._element.setAttribute('disabled', 'true');
    } else {
      this._element.removeAttribute('disabled');
    }
  }

  // Скрывает элемент (через атрибут hidden)
  setHidden(): void {
    this._element.hidden = true;
  }

  // Делает элемент видимым (убирает атрибут hidden)
  setVisible(): void {
    this._element.hidden = false;
  }

  // Устанавливает src и alt для IMG-элемента
  setImage(src: string, alt: string): void {
    if (this._element instanceof HTMLImageElement) {
      this._element.src = src;
      this._element.alt = alt;
    } else {
      console.warn('setImage: элемент не является <img>.');
    }
  }

  // Возвращает корневой DOM-элемент компонента
  render(): T {
    return this._element;
  }
}
