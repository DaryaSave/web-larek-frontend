import { Api } from '../base/api';
export class ProductAPI extends Api {
    constructor(cdn, baseUrl, options) {
        super(baseUrl, options);
        this.cdn = cdn;
    }
    getCardList() {
        return this.get('/product').then((data) => data.items.map((item) => (Object.assign(Object.assign({}, item), { image: this.cdn + item.image }))));
    }
    orderCards(order) {
        return this.post('/order', order).then((data) => data);
    }
}
