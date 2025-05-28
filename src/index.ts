import './scss/styles.scss';

import { API_URL } from './utils/constants';
import { Api } from './components/services/api';
import { EventEmitter } from './components/base/events';
import { AppState } from './components/services/appState';
import { IProductItem } from './types';
import { Card } from './components/views/card';
import { Catalog } from './components/views/catalog';
import { Modal } from './components/views/modal';
import { Order } from './components/views/order';
import { Contacts } from './components/views/contacts';
import { Success } from './components/views/success';
import { createBasketItem } from './components/views/basket';
import { Page } from './components/views/page'; 

// === Инициализация ===
const api = new Api(API_URL);
const events = new EventEmitter();
const appState = new AppState();
const page = new Page({
  counterSelector: '.header__basket-counter',
  catalogSelector: '.gallery',
  wrapperSelector: '.page__wrapper',
  basketSelector: '.header__basket',
});

// === DOM-элементы ===
const catalogContainer = document.querySelector('.gallery') as HTMLElement;
const modalContainer = document.querySelector('#modal-container') as HTMLElement;

// Получаем шаблоны
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
if (!basketTemplate) throw new Error('Шаблон #basket не найден');

const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
if (!orderTemplate) throw new Error('Шаблон #order не найден');

const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
if (!contactsTemplate) throw new Error('Шаблон #contacts не найден');

const basketItemTemplate = document.querySelector('#card-basket');
if (!basketItemTemplate) {
  throw new Error('Шаблон корзины #card-basket не найден');
}

document.querySelector('.header__basket')?.addEventListener('click', () => {
  console.log('Клик по корзине'); 
  events.emit('basket:open');
});

// Проверка обязательных элементов
if (!catalogContainer || !modalContainer) {
  throw new Error('Не найдены необходимые DOM-элементы');
}

// === Компоненты ===
const modal = new Modal('#modal-container', events); 

const catalog = new Catalog(
  catalogContainer,
  null,
  (item: IProductItem) => events.emit('card:select', item)
);

const success = new Success(
  document.querySelector('.success__total') as HTMLElement,
  document.querySelector('.success__close') as HTMLElement,
  document.querySelector('.success__message') as HTMLElement
);

// === Обработчики событий ===

// Обновление каталога при изменении данных
events.on('catalog:changed', () => {
  catalog.render(appState.catalog);
});

// Обработка выбора карточки товара
events.on('card:select', (item: IProductItem) => {
  modal.close();
  const card = new Card(item, () => events.emit('card:add', item));
  modal.setContent(card.getElement());
  modal.open();
});

// Обработка добавления товара в корзину
events.on('card:add', (item: IProductItem) => {
  appState.addToBasket(item);
  events.emit('basket:updated');
  console.log(appState.basket);
  modal.close();
});

// Открытие корзины
events.on('basket:open', () => {

  // Создаем содержимое корзины из шаблона
  const basketElement = basketTemplate.content.cloneNode(true) as DocumentFragment;
  const basketContainer = basketElement.querySelector('.basket') as HTMLElement;
  const basketList = basketElement.querySelector('.basket__list') as HTMLElement;
  const basketPrice = basketElement.querySelector('.basket__price') as HTMLElement;
  
  // Очищаем список
  basketList.innerHTML = '';
  
  // Добавляем товары с правильными индексами
  appState.basket.forEach((item, index) => {
    const basketItem = createBasketItem({...item, index: index + 1}, events);
    basketList.appendChild(basketItem);
  });
  
  // Обновляем общую стоимость
  const totalPrice = appState.basket.reduce((sum, item) => sum + (item.price || 0), 0);
  basketPrice.textContent = `${totalPrice.toLocaleString('ru-RU')} синапсов`;

   // Получаем кнопку оформления как HTMLButtonElement
  const checkoutButton = basketElement.querySelector('.basket__button') as HTMLButtonElement;
  if (checkoutButton) {
    // Если в корзине есть товары — снимаем disabled, иначе оставляем установлено disabled
    if (appState.basket.length > 0) {
      checkoutButton.disabled = false;
      checkoutButton.classList.remove('button_disabled');
    } else {
      checkoutButton.disabled = true;
      checkoutButton.classList.add('button_disabled');
    }
 // Назначаем обработчик клика
    checkoutButton.addEventListener('click', () => {
      // Эмитируем событие оформления только если в корзине есть товары
      if (appState.basket.length > 0) {
        events.emit('order:open');
      }
    });
  }
  
  modal.setContent(basketContainer);
  modal.open();
});

events.on('basket:updated', () => {
  const basketCounter = document.querySelector('.header__basket-counter');
  if (basketCounter) {
    basketCounter.textContent = appState.basket.length.toString();
  }
});

// Блокировка прокрутки при открытии модального окна
events.on('modal:open', () => { 
  page.locked(true); 
});

// Разблокировка прокрутки при закрытии модального окна
events.on('modal:close', () => { 
  page.locked(false); 
});

// Обработчик удаления товара
events.on('basket:remove', (id: string) => {
  appState.removeFromBasket(id);
  events.emit('basket:updated');
  // Перерисовываем корзину
  events.emit('basket:open');
});

// Обработка успешного оформления заказа
events.on('order:success', () => {
  const totalPrice = appState.basket.reduce((sum, item) => sum + (item.price || 0), 0);
  const successElement = success.render(totalPrice, 'Заказ успешно оформлен!');
  
  appState.clearBasket();
  events.emit('basket:updated');

  modal.setContent(successElement);
  modal.open();
});

// Открытие формы заказа
events.on('order:open', () => {
  const orderElement = orderTemplate.content.cloneNode(true) as DocumentFragment;
  const orderContainer = orderElement.querySelector('form') as HTMLFormElement;
  
  if (orderContainer) {
    const paymentButtons = Array.from(orderContainer.querySelectorAll('.button_alt')) as HTMLElement[];
    new Order(orderContainer, paymentButtons, events);
  }
  
  modal.setContent(orderContainer);
  modal.open();
});

// Открытие формы контактов
events.on('contacts:open', () => {
  const contactsElement = contactsTemplate.content.cloneNode(true) as DocumentFragment;
  const contactContainer = contactsElement.querySelector('form') as HTMLFormElement;
  
  if (contactContainer) {
    new Contacts(contactContainer, events);
  }
  
  modal.setContent(contactContainer);
  modal.open();
});

// Закрытие корзины (дублирует modal:close)
events.on('basket:close', () => {
  modal.close();
});

// Получаем данные с сервера
api.getProductList()
  .then((products: IProductItem[]) => {
    if (!products.length) {
      console.error('API вернул пустой массив товаров');
      return;
    }
    appState.setCatalog(products);
    events.emit('catalog:changed');
  })
    .catch((err: Error) => {
        console.error('Ошибка загрузки товаров:', err.message);
    });

