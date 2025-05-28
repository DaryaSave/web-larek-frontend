import {
  IProductItem,
  IOrder,
  IOrderForm,
  IContactsFormState,
} from '../../types';

/** Ошибки форм заказа и контактов */
type FormErrors = {
  order?: string[];
  contact?: string[];
};

interface InitialState {
  basket?: IProductItem[];
  catalog?: IProductItem[];
  order?: IOrder;
  formErrors?: FormErrors;
}

/**
 * Глобальное состояние приложения: корзина, каталог, заказ, данные форм и ошибки.
 */
export class AppState {
  public basket: IProductItem[];
  public catalog: IProductItem[];
  public order: IOrder;
  public orderForm: IOrderForm;
  public contactForm: IContactsFormState;
  public formErrors: FormErrors;

  constructor(initialState: InitialState = {}) {
    this.basket = initialState.basket ?? [];
    this.catalog = initialState.catalog ?? [];
    this.order = {
      items: initialState.order?.items ?? [],
      total: initialState.order?.total ?? 0,
    };
    this.orderForm = { payment: '', address: '', email: '', phone: '' };
    this.contactForm = { valid: false, errors: [], email: '', phone: '' };
    this.formErrors = initialState.formErrors ?? {};
  }

  /** Возвращает сумму цен товаров в корзине */
  getTotal(): number {
    return this.basket.reduce((sum, item) => sum + item.price, 0);
  }

  /** Устанавливает данные каталога */
  setCatalog(products: IProductItem[]): void {
     console.log('Полученные данные из API:', products); 
    this.catalog = [...products];
  }

  /** Добавляет товар в корзину, если его там нет, и обновляет заказ */
  addToBasket(product: IProductItem): void {
    if (!this.basket.some(p => p.id === product.id)) {
      this.basket.push(product);
      this.updateOrder();
    }
  }

  /** Удаляет товар из корзины и обновляет заказ */
  removeFromBasket(id: string) {
    this.basket = this.basket.filter(item => item.id !== id);
    this.updateOrder();
  }

  /** Очищает корзину и сбрасывает заказ */
  clearBasket(): void {
    this.basket = [];
    this.clearOrder();
  }

  /** Очищает данные заказа и формы */
  clearOrder(): void {
    this.order = { items: [], total: 0 };
    this.orderForm = { payment: '', address: '', email: '', phone: '' };
    this.contactForm = { valid: false, errors: [], email: '', phone: '' };
    this.formErrors = {};
  }

  /** Проверяет наличие товара в корзине */
  checkProduct(productId: string): boolean {
    return this.basket.some(p => p.id === productId);
  }

  /** Устанавливает поле формы заказа */
  setOrderField(field: keyof IOrderForm, value: string): void {
    this.orderForm [field] = value;
  }

  /** Валидирует форму заказа: payment и address */
  validateOrder(): boolean {
    const errors: string[] = [];
    if (!this.orderForm.payment) errors.push('Способ оплаты не выбран');
    if (!this.orderForm.address) errors.push('Адрес не указан');
    this.formErrors.order = errors;
    return errors.length === 0;
  }

  setContactField(field: 'email' | 'phone', value: string): void {
  this.contactForm[field] = value;
}

  /** Валидирует контактную форму */
  validateContact(): boolean {
    const errors: string[] = [];
    const email = this.contactForm.email;
    const phone = this.contactForm.phone;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9\s\-()]{7,}$/;
    if (!emailRegex.test(email)) errors.push('Неверный формат email');
    if (!phoneRegex.test(phone)) errors.push('Неверный формат телефона');
    this.formErrors.contact = errors;
    this.contactForm.valid = errors.length === 0;
    return errors.length === 0;
  }

  /** Обновляет поля заказа (items и total) на основе корзины */
  private updateOrder(): void {
    this.order.items = this.basket.map(item => ({ product: item, quantity: 1 }));
    this.order.total = this.getTotal();
  }
}
