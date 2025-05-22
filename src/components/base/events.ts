type EventName = string | RegExp;
type Subscriber<T = unknown> = (data: T) => void;

type EmitterEvent = {
    eventName: string,
    data: unknown
};

export interface IEvents {
on<T = void>(eventName: EventName, callback: Subscriber<T>): void;
emit<T = void>(eventName: string, data?: T): void;
trigger<T = void>(eventName: string, context?: Partial<T>): (data: T) => void;
}


export class EventEmitter implements IEvents {
    _events: Map<EventName, Set<Subscriber<unknown>>>;

    constructor() {
        this._events = new Map<EventName, Set<Subscriber<unknown>>>();
    }

    on<T = void>(eventName: EventName, callback: Subscriber<T>) {
        if (!this._events.has(eventName)) {
            this._events.set(eventName, new Set<Subscriber<unknown>>());
        }
        this._events.get(eventName)?.add(callback);
    }

off(eventName: EventName, callback: Subscriber<unknown>) {
    const subscribers = this._events.get(eventName);
    if (subscribers) {
        subscribers.delete(callback);
        if (subscribers.size === 0) {
            this._events.delete(eventName);
        }
    }
}


    emit<T = void>(eventName: string, data?: T) {
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

    onAll(callback: Subscriber<EmitterEvent>) {
        this.on("*", callback);
    }

    offAll() {
        this._events = new Map<EventName, Set<Subscriber<unknown>>>();
    }

    trigger<T = void>(eventName: string, context?: Partial<T>) {
        return (event: T) => {
            this.emit(eventName, {
                ...(event as object),
                ...(context as object)
            } as T);
        };
    }
    }
