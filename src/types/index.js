// Типы событий (если используется брокер событий)
export var EventTypes;
(function (EventTypes) {
    EventTypes["ADD_TO_BASKET"] = "ADD_TO_BASKET";
    EventTypes["REMOVE_FROM_BASKET"] = "REMOVE_FROM_BASKET";
    EventTypes["ORDER_PLACED"] = "ORDER_PLACED";
})(EventTypes || (EventTypes = {}));
// Экспорт всех типов
export * from './index';
