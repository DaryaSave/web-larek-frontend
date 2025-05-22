import { IProductItem } from '../../types';

export type ApiListResponse<Type> = {
    total: number;
    items: Type[];
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class Api {
    readonly baseUrl: string;
    protected options: RequestInit;

    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers as object ?? {})
            }
        };
    }

    protected handleResponse<T>(response: Response): Promise<T> {
        if (response.ok) return response.json() as Promise<T>;
        else
            return response.json()
                .then((data) => Promise.reject(data.error ?? response.statusText));
    }

    get<T>(uri: string): Promise<T> {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method: 'GET'
        }).then(response => this.handleResponse<T>(response));
    }

    post<T>(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<T> {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method,
            body: JSON.stringify(data)
        }).then(response => this.handleResponse<T>(response));
    }

    // Метод для получения списка продуктов (исправлено)
    getProductList(): Promise<IProductItem[]> {
        return this.get<ApiListResponse<IProductItem>>('/product')
            .then(data => {
                // Дополнительная проверка данных (опционально)
                if (!data.items.every(this.isValidProduct)) {
                    throw new Error('Invalid product data format');
                }
                return data.items;
            });
    }

    // Валидация структуры продукта
    private isValidProduct(item: unknown): item is IProductItem {
    if (typeof item !== 'object' || item === null) return false;
    const target = item as { [key: string]: unknown };
    return (
        typeof target.id === 'string' &&
        typeof target.title === 'string' &&
        typeof target.description === 'string' &&
        typeof target.price === 'number' &&
        typeof target.image === 'string' &&
        typeof target.category === 'string'
    );
}
}