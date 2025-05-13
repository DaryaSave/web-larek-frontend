# Проектная работа "Веб-ларек"
https://github.com/DaryaSave/web-larek-frontend.git 

## Краткое описание

Веб-приложение интернет-магазина с корзиной, оформлением заказа и взаимодействием с API.  
Стек: TypeScript, HTML, SCSS, Webpack.

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Архитектура проекта

### Основные части

**Типы данных (types/)** — описание структуры данных для товаров, корзины, заказов, API и событий.

**Базовые классы (components/base/)** — инфраструктурные классы: EventEmitter (событийная шина), Api (клиент для запросов к серверу).

**Утилиты (utils/)** — вспомогательные функции для работы с DOM, шаблонами и данными.

**Компоненты интерфейса (components/)** — визуальные и логические компоненты (карточки товаров, корзина, формы, модальные окна и т.д.).

**Точка входа (index.ts)** — инициализация приложения, подключение стилей, создание экземпляров компонентов.


### Взаимодействие частей

- Взаимодействие между компонентами реализовано через события (паттерн "Наблюдатель", EventEmitter).

- Запросы к серверу изолированы в классе Api.

- Все DOM-элементы, с которыми работают компоненты, кэшируются в свойствах для повышения производительности.

- Повторяющийся код вынесен в утилиты.


## Описание основных классов и интерфейсов

### 1. Класс `EventEmitter` (паттерн "Наблюдатель")

**Назначение:**
Брокер событий для организации слабосвязанного взаимодействия между частями приложения.

**Конструктор:**
Не принимает параметров.

**Свойства:**
`_events: Map<EventName, Set<Subscriber>>` — карта событий и их подписчиков.

**Методы:**
- `on<T>(event: EventName, callback: (data: T) => void): void` — Подписывает callback на событие event с данными типа T.
- `off(event: EventName, callback: Subscriber): void` — Отписывает callback от события event.
- `emit<T>(event: EventName, data?: T): void` — Инициирует событие event с передачей данных типа T.
- `onAll(callback: (event: EmitterEvent) => void): void` — подписка на все события.
- `offAll(): void` — сбросить все подписки.
- `trigger<T>(event: EventName, context?: Partial<T>): (data: T) => void` — возвращает callback-триггер для event с частичным контекстом типа T.


### 2. Класс `Api`

**Назначение:**
Инкапсулирует работу с серверным API.

**Конструктор:**
`constructor(baseUrl: string, options?: RequestInit)`

- `baseUrl: string` — базовый URL API.
- `options?: RequestInit` — дополнительные опции запроса.

**Свойства:**
- `baseUrl: string` — базовый URL.
- `options: RequestInit` — опции fetch-запросов.

**Методы:**
- `get(uri: string): Promise<object>` — выполняет GET-запрос по относительному URI.
- `post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>`— POST-запрос (по умолчанию), с возможностью указания метода PUT или DELETE через параметр method.
- `handleResponse(response: Response): Promise<object>` — обрабатывает HTTP-ответ, возвращает JSON или ошибку.


### 3. Утилиты (`utils/utils.ts`)

- `pascalToKebab(value: string): string` — преобразует строку из PascalCase в kebab-case.
- `isSelector(x: any): x is string` — проверяет, является ли аргумент строкой-селектором.
- `isEmpty(value: any): boolean` — проверяет, является ли значение пустым (null, undefined, пустая строка или массив).
- `ensureAllElements<T>(selectorElement, context?): T[]` — возвращает массив элементов по селектору, либо выбрасывает ошибку, если элементы не найдены.
- `ensureElement<T>(selectorElement, context?): T` — возвращает один элемент по селектору, либо выбрасывает ошибку, если элемент не найден.
- `cloneTemplate<T>(query): T` — клонирует содержимое элемента <template> и возвращает результат типизированным элементом.
- `bem(block, element?, modifier?)` — генерирует имя класса по методологии БЭМ.
- `getObjectProperties(obj, filter?)` — возвращает список имён свойств объекта, с возможностью фильтрации.
- `setElementData<T>(el, data)` — устанавливает dataset-атрибуты.
- `getElementData<T>(el, scheme)` — получает типизированные данные из dataset.
- `isPlainObject(obj)` — проверяет, является ли объект простым (не экземпляром класса или массивом).
- `isBoolean(v)` — проверяет, является ли значение boolean.
- `createElement<T>(tagName, props?, children?)` — создает DOM-элемент.


## Компоненты интерфейса

### 1. Компонент ProductCard

**Назначение:**
Отображение карточки товара, взаимодействие с корзиной.

**Свойства:**
- `element: HTMLElement` — корневой DOM-элемент карточки.
- `data: IProduct` — данные товара.
- `events: EventEmitter` — брокер событий.

**Методы:**
- `render(): void` — отображает карточку товара с данными.
- `bindEvents(): void` — вешает обработчики на кнопки (добавить в корзину и др.).


## 2. Компонент Basket

**Назначение:**
Отображение корзины, управление товарами.

**Свойства:**
- `items: ICartItem[]` — список товаров в корзине.
- `element: HTMLElement` — DOM-элемент корзины.
- `events: EventEmitter`

**Методы:**
- `render(): void` — Отображает список товаров и общую сумму.
- `addItem(item: ICartItem): void` — Добавляет товар в корзину.
- `removeItem(productId: string): void` — Удаляет товар по ID.
- `updateItemQuantity(productId: string, quantity: number): void` — Обновляет количество товара.
- `clear(): void` — Очищает корзину.


## 3. Компонент OrderForm
**Назначение:**
Форма оформления заказа (контакты, адрес, оплата).

**Свойства:**
- `formElement: HTMLFormElement`
- `state: IOrderFormState`
- `events: EventEmitter` 

**Методы:**
- `validate(): boolean` — Проверяет валидность формы, обновляет состояние.
- `getFormData(): IOrderForm` — Возвращает данные заказа.
- `submit(): void` — Отправляет данные заказа через событие.


## Типы данных
`IProduct` — описание товара: id, title, description, price, image, category.
`ICartItem` — элемент корзины: product (IProduct), quantity.
`IBasket` — корзина: список товаров, сумма, активность.
`IOrderForm` — данные формы заказа.
`IOrder` — заказ: товары, сумма.
`IOrderResult` — ответ сервера: id заказа, сумма.
`IProductAPI` — интерфейс API: методы getProductList, placeOrder.
`IFormState` — состояние формы: валидность, ошибки, значения полей.
`EventTypes` — перечисление типов событий.
`IEvent<T>` — структура события с данными типа T.


**Паттерны**
- `Observer` — событийная шина через EventEmitter.
- `SRP/SoC` — разделение данных, логики, представления.
- `Инкапсуляция API` — класс Api.


## Об архитектуре 

Проект построен по принципу событийного взаимодействия (паттерн "Наблюдатель").
Модели управляют данными и инициируют события при их изменении.
Основной код слушает события, синхронизирует данные между моделями и компонентами отображения, обновляет интерфейс.
Компоненты отвечают только за визуальное представление и не содержат бизнес-логики.
Запросы к серверу инкапсулированы в классе Api.