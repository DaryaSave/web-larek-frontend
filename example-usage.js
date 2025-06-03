/**
 * Пример использования новой архитектуры форм
 */

import { Contacts } from './src/components/views/contacts.js';
import { Order } from './src/components/views/order.js';
import { EventEmitter } from './src/components/base/events.js';

// Инициализация системы событий
const events = new EventEmitter();

// Инициализация формы контактов
const contactsFormElement = document.querySelector('#contacts-form');
const contactsForm = new Contacts(contactsFormElement, events);

// Инициализация формы заказа
const orderFormElement = document.querySelector('#order-form');
const paymentButtons = document.querySelectorAll('.payment-button');
const orderForm = new Order(orderFormElement, paymentButtons, events);

// Обработчики событий форм
events.on('contacts:submit', (data) => {
	console.log('Контактные данные отправлены:', data);

	// Можно интегрировать с API или другими компонентами
	submitContactsToAPI(data);
});

events.on('order:submit', (data) => {
	console.log('Заказ отправлен:', data);

	// Интеграция с системой заказов
	processOrder(data);
});

events.on('contacts:email-changed', (data) => {
	console.log('Email изменен:', data.email, 'Валиден:', data.valid);
});

events.on('order:payment-changed', (data) => {
	console.log('Способ оплаты изменен:', data.payment);

	// Можно обновить UI или выполнить другие действия
	updatePaymentUI(data.payment);
});

// Пример функций интеграции
async function submitContactsToAPI(contactsData) {
	try {
		const response = await fetch('/api/contacts', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(contactsData),
		});

		if (response.ok) {
			console.log('Контакты успешно сохранены');
			events.emit('contacts:saved', contactsData);
		}
	} catch (error) {
		console.error('Ошибка сохранения контактов:', error);
		events.emit('contacts:error', { error: error.message });
	}
}

async function processOrder(orderData) {
	try {
		// Получаем контактные данные
		const contactsData = contactsForm.getContactsData();

		// Объединяем данные заказа и контактов
		const fullOrderData = {
			...orderData,
			...contactsData,
			timestamp: new Date().toISOString(),
		};

		const response = await fetch('/api/orders', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(fullOrderData),
		});

		if (response.ok) {
			console.log('Заказ успешно обработан');
			events.emit('order:processed', fullOrderData);

			// Очищаем формы после успешной отправки
			contactsForm.clear();
			orderForm.clearOrder();
		}
	} catch (error) {
		console.error('Ошибка обработки заказа:', error);
		events.emit('order:error', { error: error.message });
	}
}

function updatePaymentUI(paymentMethod) {
	// Пример обновления UI в зависимости от способа оплаты
	const paymentInfo = document.querySelector('#payment-info');
	if (paymentInfo) {
		switch (paymentMethod) {
			case 'card':
				paymentInfo.textContent = 'Оплата картой онлайн';
				break;
			case 'cash':
				paymentInfo.textContent = 'Оплата наличными при получении';
				break;
			default:
				paymentInfo.textContent = 'Выберите способ оплаты';
		}
	}
}

// Пример программной установки данных
function setExampleData() {
	// Установка контактных данных
	contactsForm.setContactsData({
		email: 'user@example.com',
		phone: '+7 (999) 123-45-67',
	});

	// Установка данных заказа
	orderForm.setOrderData({
		payment: 'card',
		address: 'Москва, ул. Примерная, д. 1',
	});
}

// Экспорт для использования в других модулях
export { contactsForm, orderForm, events, setExampleData };
