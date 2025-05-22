import './scss/styles.scss';

import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { AppState } from './components/base/appState';
import { IProductItem } from './types';

import { Card } from './components/card';
import { Catalog } from './components/catalog';
import { Basket } from './components/basket';
import { Modal } from './components/modal';
import { Order } from './components/order';
import { Contacts } from './components/contacts';
import { Success } from './components/success';
import { createBasketItem } from './components/basket';
import { Page } from './components/page'; 

// === Инициализация ===
const api = new Api('https://larek-api.nomoreparties.co');
const events = new EventEmitter();
const appState = new AppState();
const page = new Page({
  counterSelector: '.header__basket-counter',
  catalogSelector: '.gallery',
  wrapperSelector: '.page__wrapper',
  basketSelector: '.basket'
});

// === DOM-элементы ===
// Получаем элементы DOM с явным указанием типов
const catalogContainer = document.querySelector('#catalog') as HTMLElement;
const basketContainer = document.querySelector('.basket__list') as HTMLElement;
const totalElement = document.querySelector('.basket__total') as HTMLElement;
const modalContainer = document.querySelector('#modal') as HTMLElement;
const orderFormElement = document.querySelector('#orderForm') as HTMLFormElement;
const contactFormElement = document.querySelector('#contactForm') as HTMLFormElement;
const paymentButtons = Array.from(document.querySelectorAll('.payment-button')) as HTMLElement[];
const successTotal = document.querySelector('.success__total') as HTMLElement;
const successClose = document.querySelector('.success__close') as HTMLElement;
const successMessage = document.querySelector('.success__message') as HTMLElement;

// Проверка обязательных элементов
if (!catalogContainer || !basketContainer || !modalContainer || !totalElement) {
  throw new Error('Не найдены необходимые DOM-элементы');
}

// === Компоненты ===
// Инициализация компонентов с передачей правильных типов
const modal = new Modal('.modal');
const basket = new Basket(basketContainer, totalElement, createBasketItem);
const catalog = new Catalog(
  catalogContainer,
  (item: IProductItem) => new Card(item, (product: IProductItem) => basket.addItem(product)),
  (item: IProductItem) => events.emit('card:select', item)
);

const success = new Success(successTotal, successClose, successMessage);

// Инициализация форм, если элементы существуют
if (orderFormElement && paymentButtons.length > 0) {
  new Order(orderFormElement, paymentButtons);
}

if (contactFormElement) {
  new Contacts(contactFormElement);
}

// === Загрузка данных ===
api.getProductList()
  .then((products: IProductItem[]) => {
    appState.setCatalog(products);
    events.emit('catalog:changed');
  })
  .catch(console.error);

// === Обработчики событий ===

// Обновление каталога при изменении данных
events.on('catalog:changed', () => {
  catalog.render(appState.catalog);
});

// Обработка выбора карточки товара
events.on('card:select', (item: IProductItem) => {
  const card = new Card(item, () => events.emit('card:add', item));
  modal.setContent(card.getElement());
  modal.open();
});

// Обработка добавления товара в корзину
events.on('card:add', (item: IProductItem) => {
  appState.addToBasket(item);
  events.emit('basket:updated');
  modal.close();
});

// Обновление отображения корзины
events.on('basket:updated', () => {
  basket.render();
});

// Блокировка прокрутки при открытии модального окна
events.on('modal:open', () => { 
  page.locked(true); 
});

// Разблокировка прокрутки при закрытии модального окна
events.on('modal:close', () => { 
  page.locked(false); 
});

// Обработка удаления товара из корзины
events.on('card:remove', (id: string) => {
  appState.removeFromBasket(id);
  events.emit('basket:updated');
});

// Обработка успешного оформления заказа
events.on('order:success', () => {
  success.render(appState.order.total, 'Заказ успешно оформлен!');
  appState.clearBasket();
  events.emit('basket:updated');
});

// Открытие формы заказа
events.on('order:open', () => {
  modal.setContent(orderFormElement);
  modal.open();
});

// Открытие формы контактов
events.on('contacts:open', () => {
  modal.setContent(contactFormElement);
  modal.open();
});

// Открытие корзины
events.on('basket:open', () => {
  basket.render();
  modal.setContent(basketContainer);
  modal.open();
});

// Закрытие корзины (дублирует modal:close)
events.on('basket:close', () => {
  modal.close();
});

// Событие: Открытие модального окна 
events.on('modal:open', () => {
  modal.open();
});

// Получаем данные с сервера
api.getProductList()
    .then((products: IProductItem[]) => {
        appState.setCatalog(products); // Теперь типы совпадают
        events.emit('catalog:changed');
    })
    .catch((err: Error) => {
        console.error('Ошибка загрузки товаров:', err.message);
    });