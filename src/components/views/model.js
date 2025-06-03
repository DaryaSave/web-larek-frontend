// Гарда для проверки на модель 
export const isModel = (obj) => {
    return obj instanceof Model;
};
/**
 * Базовая модель, чтобы можно было отличить ее от простых объектов с данными
 */
export class Model {
    constructor(data, events) {
        this.events = events;
        Object.assign(this, data);
    }
    emitChanges(event, payload) {
        this.events.emit(event, payload !== null && payload !== void 0 ? payload : {});
    }
}
