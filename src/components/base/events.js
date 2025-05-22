export class EventEmitter {
    constructor() {
        this._events = new Map();
    }
    on(eventName, callback) {
        var _a;
        if (!this._events.has(eventName)) {
            this._events.set(eventName, new Set());
        }
        (_a = this._events.get(eventName)) === null || _a === void 0 ? void 0 : _a.add(callback);
    }
    off(eventName, callback) {
        const subscribers = this._events.get(eventName);
        if (subscribers) {
            subscribers.delete(callback);
            if (subscribers.size === 0) {
                this._events.delete(eventName);
            }
        }
    }
    emit(eventName, data) {
        this._events.forEach((subscribers, name) => {
            if (name === '*') {
                subscribers.forEach(callback => callback({
                    eventName,
                    data
                }));
            }
            if ((name instanceof RegExp && name.test(eventName)) || name === eventName) {
                subscribers.forEach(callback => callback(data));
            }
        });
    }
    onAll(callback) {
        this.on("*", callback);
    }
    offAll() {
        this._events = new Map();
    }
    trigger(eventName, context) {
        return (event) => {
            this.emit(eventName, Object.assign(Object.assign({}, event), context));
        };
    }
}
