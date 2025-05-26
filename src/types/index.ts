// src/types/index.ts

// Типы данных для товаров
export interface IProductItem {
    id: string;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;

}

// Типы данных для корзины
export interface ICartItem {
    product: IProductItem;
    quantity: number;
}

export interface IBasket {
    items: ICartItem[];   // Список товаров в корзине
    isActive: boolean;    // Состояние выбранной корзины (открыта/закрыта и т.п.)
    total: number;        // Итоговая сумма корзины
}

// Типы данных для заказов

// Форма оформления заказа (вводимые данные пользователя)
export interface IOrderForm {
    payment: string;
    address: string;
    email: string;
    phone: string;
}

// Объект заказа, передаваемый в API
export interface IOrder {
    items: ICartItem[];  // Товары в заказе
    total: number;       // Итоговая сумма заказа
}

// Ответ от API после оформления заказа
export interface IOrderResult {
    id: string;
    total: number;
}

// Типы данных для API-клиента
export interface IProductAPI {
    getProductList(): Promise<IProductItem[]>;
    placeOrder(order: IOrder): Promise<IOrderResult>;
}

// Типы данных для отображения (компоненты)
export interface ICard extends IProductItem {
  _brand?: never;
}

// Типы данных для форм и их состояния
export interface IFormState {
    valid: boolean;
    errors: string[];
}

export interface IOrderFormState extends IFormState, IOrderForm {}

export interface IContactsFormState extends IFormState {
    email: string;
    phone: string;
}

// Интерфейс пользователя
export interface IUser {
    id: string;
    name: string;
    email: string;
}

// Типы событий (если используется брокер событий)
export enum EventTypes {
    ADD_TO_BASKET = 'ADD_TO_BASKET',
    REMOVE_FROM_BASKET = 'REMOVE_FROM_BASKET',
    ORDER_PLACED = 'ORDER_PLACED',
}

export interface IEvent<T = unknown> {
    type: EventTypes;
    data: T;
}

// Экспорт всех типов для удобного импорта
export * from './index';

// Тип данных для модального окна
export interface IModalData {
  content: HTMLElement;
}
