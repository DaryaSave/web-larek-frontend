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
import { IOrderData, IContactsData } from './components/models/formModel';

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

// === Кэшированные DOM-элементы ===
const catalogContainer = document.querySelector('.gallery') as HTMLElement;
const modalContainer = document.querySelector('#modal-container') as HTMLElement;
const basketCounter = document.querySelector('.header__basket-counter') as HTMLElement;
const headerBasket = document.querySelector('.header__basket') as HTMLElement;

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

const success = new Success();

// Переменные для хранения компонентов форм
let currentOrder: Order | null = null;
let currentContacts: Contacts | null = null;
let currentOrderData: IOrderData | null = null;
let orderCompleted = false; // Флаг для отслеживания завершенного заказа

// === Функция для создания корзины ===
function createBasketView(): HTMLElement {
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

  // Получаем кнопку оформления
  const checkoutButton = basketElement.querySelector('.basket__button') as HTMLButtonElement;
  if (checkoutButton) {
    const hasItems = appState.basket.length > 0;
    checkoutButton.disabled = !hasItems;
    
    if (hasItems) {
      checkoutButton.classList.remove('button_disabled');
    } else {
      checkoutButton.classList.add('button_disabled');
    }

    checkoutButton.addEventListener('click', () => {
      if (appState.basket.length > 0) {
        events.emit('order:open');
      }
    });
  }
  
  return basketContainer;
}

// === Функция для создания формы заказа ===
function createOrderForm(): HTMLFormElement {
  const orderElement = orderTemplate.content.cloneNode(true) as DocumentFragment;
  const orderContainer = orderElement.querySelector('form') as HTMLFormElement;
  
  if (orderContainer) {
    const paymentButtons = Array.from(orderContainer.querySelectorAll('.button_alt')) as HTMLElement[];
    currentOrder = new Order(orderContainer, paymentButtons, events);
  }
  
  return orderContainer;
}

// === Функция для создания формы контактов ===
function createContactsForm(): HTMLFormElement {
  const contactsElement = contactsTemplate.content.cloneNode(true) as DocumentFragment;
  const contactContainer = contactsElement.querySelector('form') as HTMLFormElement;
  
  if (contactContainer) {
    currentContacts = new Contacts(contactContainer, events);
  }
  
  return contactContainer;
}

// === Функция для отправки заказа ===
async function submitOrder(orderData: IOrderData, contactsData: IContactsData): Promise<void> {
  try {
    const orderPayload = {
      payment: orderData.payment,
      address: orderData.address,
      email: contactsData.email,
      phone: contactsData.phone,
      total: appState.getTotal(),
      items: appState.basket.map(item => item.id)
    };

    // Здесь можно добавить реальный API запрос
    // const result = await api.post('/order', orderPayload);
    
    console.log('Отправка заказа:', orderPayload);
    
    // Имитация успешной отправки
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    events.emit('order:success');
  } catch (error) {
    console.error('Ошибка при отправке заказа:', error);
    alert(`Ошибка при отправке заказа: ${(error as Error).message}`);
  }
}

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
  modal.close();
});

// Обновление счетчика корзины
events.on('basket:updated', () => {
  if (basketCounter) {
    basketCounter.textContent = appState.basket.length.toString();
  }
});

// Открытие корзины
events.on('basket:open', () => {
  const basketView = createBasketView();
  modal.setContent(basketView);
  modal.open();
});

// Обработчик удаления товара из корзины
events.on('basket:remove', (id: string) => {
  appState.removeFromBasket(id);
  events.emit('basket:updated');
  // Если модальное окно открыто И это корзина (не экран успеха), обновляем её
  if (modal.isOpen()) {
    const modalContent = modalContainer.querySelector('.modal__content');
    const isSuccessScreen = modalContent?.querySelector('.order-success');
    
    // Не обновляем содержимое если показывается экран успеха
    if (!isSuccessScreen) {
      const basketView = createBasketView();
      modal.setContent(basketView);
    }
  }
});

// Открытие формы заказа
events.on('order:open', () => {
  const orderForm = createOrderForm();
  modal.setContent(orderForm);
  modal.open();
});

// Обработка отправки формы заказа
events.on('order:submit', (data: IOrderData) => {
  currentOrderData = data;
  console.log('Данные заказа получены:', data);
});

// Открытие формы контактов
events.on('contacts:open', () => {
  const contactsForm = createContactsForm();
  modal.setContent(contactsForm);
  modal.open();
});

// Обработка отправки формы контактов
events.on('contacts:submit', (data: IContactsData) => {
  console.log('Данные контактов получены:', data);
  if (currentOrderData) {
    submitOrder(currentOrderData, data);
  }
});

// Обработка успешного оформления заказа
events.on('order:success', () => {
  // Сохраняем сумму ДО очистки корзины
  const totalPrice = appState.basket.reduce((sum, item) => sum + (item.price || 0), 0);
  
  // Создаем элемент успеха с правильной суммой
  const successElement = success.render(totalPrice, 'Заказ успешно оформлен!');
  
  // Показываем модальное окно с результатом
  modal.setContent(successElement);
  modal.open();
  
  // Устанавливаем флаг завершенного заказа
  orderCompleted = true;
  
  // Очищаем данные форм сразу
  currentOrderData = null;
  currentOrder?.clear();
  currentContacts?.clear();
  
  // Очистку корзины отложим до закрытия модального окна
  // чтобы избежать конфликтов с отображением
});

// Блокировка прокрутки при открытии модального окна
events.on('modal:open', () => { 
  page.locked(true); 
});

// Разблокировка прокрутки при закрытии модального окна
events.on('modal:close', () => { 
  page.locked(false);
  
  // Если заказ был завершен, очищаем корзину при закрытии модального окна
  if (orderCompleted) {
    appState.clearBasket();
    events.emit('basket:updated');
    orderCompleted = false; // Сбрасываем флаг
  }
});

// Обработчик клика по корзине
if (headerBasket) {
  headerBasket.addEventListener('click', () => {
    events.emit('basket:open');
  });
}

// Получаем данные с сервера (API запросы только в index.ts)
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

