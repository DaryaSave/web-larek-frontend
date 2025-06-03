import { CDN_URL } from '../../utils/constants';
export class Api {
    constructor(baseUrl, options = {}) {
        var _a;
        this.baseUrl = baseUrl;
        this.options = {
            headers: Object.assign({ 'Content-Type': 'application/json' }, ((_a = options.headers) !== null && _a !== void 0 ? _a : {}))
        };
    }
    handleResponse(response) {
        if (response.ok)
            return response.json();
        else
            return response.json()
                .then((data) => { var _a; return Promise.reject((_a = data.error) !== null && _a !== void 0 ? _a : response.statusText); });
    }
    delete(uri) {
        return fetch(this.baseUrl + uri, Object.assign(Object.assign({}, this.options), { method: 'DELETE' })).then(response => this.handleResponse(response));
    }
    get(uri) {
        return fetch(this.baseUrl + uri, Object.assign(Object.assign({}, this.options), { method: 'GET' })).then(response => this.handleResponse(response));
    }
    post(uri, data, method = 'POST') {
        return fetch(this.baseUrl + uri, Object.assign(Object.assign({}, this.options), { method, body: JSON.stringify(data) })).then(response => this.handleResponse(response));
    }
    // Метод для получения списка продуктов (исправлено)
    getProductList() {
        return this.get('/product')
            .then(data => {
            // Преобразуем данные из API к нужному формату
            const products = data.items.map(item => {
                var _a;
                return ({
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    price: (_a = item.price) !== null && _a !== void 0 ? _a : 0,
                    imageUrl: CDN_URL + item.image,
                    category: item.category
                });
            });
            // Проверяем валидность преобразованных данных
            if (!products.every(this.isValidProduct)) {
                throw new Error('Invalid product data format');
            }
            return products;
        });
    }
    // Валидация структуры продукта
    isValidProduct(item) {
        if (typeof item !== 'object' || item === null)
            return false;
        const target = item;
        return (typeof target.id === 'string' &&
            typeof target.title === 'string' &&
            typeof target.description === 'string' &&
            typeof target.price === 'number' &&
            typeof target.imageUrl === 'string' &&
            typeof target.category === 'string');
    }
}
